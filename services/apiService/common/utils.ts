import { REQUEST_CONFIG } from "~/services/apiService/common/constant"
import { ApiError } from "~/services/apiService/common/errors"
import type {
  ApiResponse,
  LogItem,
  TodayUsageData
} from "~/services/apiService/common/type"
import { AuthTypeEnum } from "~/types"
import { tempWindowFetch, type TempWindowFetchParams } from "~/utils/browserApi"
import { joinUrl } from "~/utils/url"

/**
 * 创建请求头
 */
const createRequestHeaders = (
  userId?: number | string,
  accessToken?: string
): Record<string, string> => {
  const baseHeaders = {
    "Content-Type": REQUEST_CONFIG.HEADERS.CONTENT_TYPE,
    Pragma: REQUEST_CONFIG.HEADERS.PRAGMA
  }

  const userHeaders: Record<string, string> = userId
    ? {
        "New-API-User": userId.toString(),
        "Veloera-User": userId.toString(),
        "voapi-user": userId.toString(),
        "User-id": userId.toString(),
        "Rix-Api-User": userId.toString(),
        "neo-api-user": userId.toString()
      }
    : {}

  const headers: Record<string, string> = { ...baseHeaders, ...userHeaders }
  // TODO：bug，还是带上了 cookie，导致网站没有使用 access_token进行验证
  if (accessToken) {
    headers["Cookie"] = "" // 使用 Bearer token 时清空 Cookie 头
    headers["Authorization"] = `Bearer ${accessToken}`
  }

  return headers
}

/**
 * 创建基本请求配置
 * @param headers 请求头
 * @param credentials 请求凭证信息
 * @param options 可选，请求配置
 * @returns RequestInit - 基本请求配置
 */
const createBaseRequest = (
  headers: HeadersInit,
  credentials: RequestCredentials,
  options: RequestInit = {}
): RequestInit => {
  const method = (options.method ?? "GET").toUpperCase()

  const defaultHeaders: HeadersInit = {
    ...headers,
    // 非 GET 请求自动加 Content-Type
    ...(method !== "GET" ? { "Content-Type": "application/json" } : {})
  }

  return {
    method,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}) // 用户自定义 headers 可覆盖默认值
    },
    credentials,
    ...options
  }
}

/**
 * 创建带 cookie 认证的请求
 */
const createCookieAuthRequest = (
  userId: number | string | undefined,
  options: RequestInit = {}
): RequestInit =>
  createBaseRequest(createRequestHeaders(userId), "include", options)

/**
 * 创建带 Bearer token 认证的请求
 */
const createTokenAuthRequest = (
  userId: number | string | undefined,
  accessToken: string,
  options: RequestInit = {}
): RequestInit =>
  createBaseRequest(createRequestHeaders(userId, accessToken), "omit", options)

/**
 * 计算今日时间戳范围
 */
export const getTodayTimestampRange = (): { start: number; end: number } => {
  const today = new Date()

  // 今日开始时间戳
  today.setHours(0, 0, 0, 0)
  const start = Math.floor(today.getTime() / 1000)

  // 今日结束时间戳
  today.setHours(23, 59, 59, 999)
  const end = Math.floor(today.getTime() / 1000)

  return { start, end }
}

/**
 * 聚合使用量数据
 */
export const aggregateUsageData = (
  items: LogItem[]
): Omit<TodayUsageData, "today_requests_count"> => {
  return items.reduce(
    (acc, item) => ({
      today_quota_consumption: acc.today_quota_consumption + (item.quota || 0),
      today_prompt_tokens: acc.today_prompt_tokens + (item.prompt_tokens || 0),
      today_completion_tokens:
        acc.today_completion_tokens + (item.completion_tokens || 0)
    }),
    {
      today_quota_consumption: 0,
      today_prompt_tokens: 0,
      today_completion_tokens: 0
    }
  )
}

/**
 * 基于 apiRequest 的快捷函数：直接提取 data
 * @waring 非必要请勿在外部使用
 * @see fetchApi fetchApiData
 */
const apiRequestData = async <T>(
  url: string,
  options?: RequestInit,
  endpoint?: string
): Promise<T> => {
  const res = await apiRequest<T>(url, options, endpoint)

  if (res.success === false || res.data === undefined) {
    if (res.message) {
      throw new ApiError(res.message, undefined, endpoint)
    }
    throw new ApiError("响应数据格式错误", undefined, endpoint)
  }

  return res.data
}

/**
 * 通用 API 请求函数
 * @param url 请求 URL
 * @param options 请求配置
 * @param endpoint 可选，接口名称，用于错误追踪
 * @returns ApiResponse 对象
 * 默认：返回完整响应，不提取 data
 * @waring 非必要请勿在外部使用
 * @see fetchApi fetchApiData
 */
const apiRequest = async <T>(
  url: string,
  options?: RequestInit,
  endpoint?: string
): Promise<ApiResponse<T>> => {
  const response = await fetch(url, options)

  if (!response.ok) {
    throw new ApiError(
      `请求失败: ${response.status}`,
      response.status,
      endpoint
    )
  }

  return response.json()
}

// 通用请求函数
export interface FetchApiParams {
  baseUrl: string
  endpoint: string
  userId?: number | string
  token?: string
  authType?: AuthTypeEnum // 认证方式，默认 token
  options?: RequestInit // 可额外自定义 fetch 参数
}

const _fetchApi = async <T>(
  { baseUrl, endpoint, userId, token, authType, options }: FetchApiParams,
  onlyData: boolean = false
) => {
  const url = joinUrl(baseUrl, endpoint)
  let authOptions = {}
  switch (authType) {
    case AuthTypeEnum.Cookie:
      authOptions = createCookieAuthRequest(userId)
      break
    case AuthTypeEnum.AccessToken:
      authOptions = createTokenAuthRequest(userId, token!)
      break
    case AuthTypeEnum.None:
      authOptions = {}
      break
    default:
      if (token) {
        authOptions = createTokenAuthRequest(userId, token!)
      }
      break
  }

  const fetchOptions = {
    ...authOptions,
    ...options
  }

  const context: TempWindowFallbackContext = {
    baseUrl,
    url,
    endpoint,
    fetchOptions,
    onlyData
  }

  return await executeWithTempWindowFallback(context, async () => {
    if (onlyData) {
      return await apiRequestData<T>(url, fetchOptions, endpoint)
    }
    return await apiRequest<T>(url, fetchOptions, endpoint)
  })
}

/**
 * 通用 API 请求函数，直接返回 data
 * @param params
 */
export const fetchApiData = async <T>(params: FetchApiParams): Promise<T> => {
  return (await _fetchApi(params, true)) as T
}

export function fetchApi<T>(
  params: FetchApiParams,
  _normalResponseType: true
): Promise<T>
export function fetchApi<T>(
  params: FetchApiParams,
  _normalResponseType?: false
): Promise<ApiResponse<T>>

/**
 * 通用 API 请求函数
 * @param params
 * @param _normalResponseType
 */
export async function fetchApi<T>(
  params: FetchApiParams,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _normalResponseType?: boolean
): Promise<T | ApiResponse<T>> {
  return await _fetchApi(params)
}

const TEMP_WINDOW_FALLBACK_STATUS = new Set([401, 403, 429])

interface TempWindowFallbackContext {
  baseUrl: string
  url: string
  endpoint?: string
  fetchOptions: RequestInit
  onlyData: boolean
}

async function executeWithTempWindowFallback<T>(
  context: TempWindowFallbackContext,
  primaryRequest: () => Promise<T | ApiResponse<T>>
): Promise<T | ApiResponse<T>> {
  try {
    return await primaryRequest()
  } catch (error) {
    if (!shouldUseTempWindowFallback(error, context)) {
      throw error
    }

    return await fetchViaTempWindow<T>(context)
  }
}

function shouldUseTempWindowFallback(
  error: unknown,
  context: TempWindowFallbackContext
): boolean {
  if (!(error instanceof ApiError)) {
    return false
  }

  if (!error.statusCode || !TEMP_WINDOW_FALLBACK_STATUS.has(error.statusCode)) {
    return false
  }

  if (!isHttpUrl(context.baseUrl)) {
    return false
  }

  return Boolean(prepareTempWindowFetchOptions(context.fetchOptions))
}

async function fetchViaTempWindow<T>(
  context: TempWindowFallbackContext
): Promise<T | ApiResponse<T>> {
  const fetchOptions = prepareTempWindowFetchOptions(context.fetchOptions)

  if (!fetchOptions) {
    throw new ApiError(
      "Temp window fetch fallback is not supported for current request",
      undefined,
      context.endpoint
    )
  }

  const requestPayload: TempWindowFetchParams = {
    originUrl: context.baseUrl,
    fetchUrl: context.url,
    fetchOptions,
    responseType: "json",
    requestId: `temp-fetch-${Date.now()}`
  }

  console.log("[API Service] Using temp window fetch fallback for", context.url)

  const response = await tempWindowFetch(requestPayload)

  if (!response.success) {
    throw new ApiError(
      response.error || "Temp window fetch failed",
      response.status,
      context.endpoint
    )
  }

  const responseBody = response.data

  if (context.onlyData) {
    return extractDataFromApiResponseBody<T>(responseBody, context.endpoint)
  }

  return responseBody as ApiResponse<T>
}

function prepareTempWindowFetchOptions(
  fetchOptions: RequestInit
): Record<string, any> | null {
  const normalized: Record<string, any> = {}

  if (fetchOptions.method) {
    normalized.method = fetchOptions.method
  }

  if (fetchOptions.headers) {
    const plainHeaders = toPlainHeaders(fetchOptions.headers)
    // 移除空的 Cookie 头，确保页面环境自行携带 cookie
    if (plainHeaders.Cookie === "") {
      delete plainHeaders.Cookie
    }
    normalized.headers = plainHeaders
  }

  const serializedBody = serializeBody(fetchOptions.body)
  if (serializedBody === null) {
    return null
  }

  if (serializedBody !== undefined) {
    normalized.body = serializedBody
  }

  return normalized
}

function toPlainHeaders(headers: HeadersInit): Record<string, string> {
  if (headers instanceof Headers) {
    const result: Record<string, string> = {}
    headers.forEach((value, key) => {
      result[key] = value
    })
    return result
  }

  if (Array.isArray(headers)) {
    return headers.reduce(
      (acc, [key, value]) => {
        acc[key] = value
        return acc
      },
      {} as Record<string, string>
    )
  }

  const result: Record<string, string> = {}
  Object.entries(headers).forEach(([key, value]) => {
    if (value != null) {
      result[key] = String(value)
    }
  })
  return result
}

function serializeBody(
  body: BodyInit | null | undefined
): string | undefined | null {
  if (body == null) {
    return undefined
  }

  if (typeof body === "string") {
    return body
  }

  if (body instanceof URLSearchParams) {
    return body.toString()
  }

  return null
}

function isHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch (error) {
    console.warn("Invalid URL for temp window fallback:", url, error)
    return false
  }
}

function extractDataFromApiResponseBody<T>(body: any, endpoint?: string): T {
  if (!body || typeof body !== "object") {
    throw new ApiError("响应数据格式错误", undefined, endpoint)
  }

  if (body.success === false || body.data === undefined) {
    const message = body.message || "响应数据格式错误"
    throw new ApiError(message, undefined, endpoint)
  }

  return body.data as T
}
/**
 * 从文本中提取金额及货币符号
 * @param {string} text - 输入文本
 * @param exchangeRate - （CNY per USD）
 */
export function extractAmount(
  text: string,
  exchangeRate: number
): { currencySymbol: string; amount: number } | null {
  // \p{Sc} 支持所有 Unicode 货币符号
  const regex = /([\p{Sc}])\s*([\d,]+(?:\.\d+)?)/u
  const match = text.match(regex)

  if (!match) return null

  const currencySymbol = match[1] // 货币符号，如 $、€、¥
  let amount = parseFloat(match[2].replace(/,/g, "")) // 数字金额

  // 如果是人民币
  if (currencySymbol === "¥") {
    amount = amount / exchangeRate
  }

  return { currencySymbol, amount }
}
