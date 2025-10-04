import { REQUEST_CONFIG } from "~/services/apiService/common/constant"
import { ApiError } from "~/services/apiService/common/index"
import type {
  ApiResponse,
  LogItem,
  TodayUsageData
} from "~/services/apiService/common/type"

/**
 * 创建请求头
 */
export const createRequestHeaders = (
  userId?: number,
  accessToken?: string
): Record<string, string> => {
  const baseHeaders = {
    "Content-Type": REQUEST_CONFIG.HEADERS.CONTENT_TYPE,
    Pragma: REQUEST_CONFIG.HEADERS.PRAGMA
  }

  const userHeaders =
    userId != null
      ? {
          "New-API-User": userId.toString(),
          "Veloera-User": userId.toString(),
          "voapi-user": userId.toString(),
          "User-id": userId.toString()
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
 * 创建带 cookie 认证的请求
 */
export const createCookieAuthRequest = (userId?: number): RequestInit => ({
  method: "GET",
  headers: createRequestHeaders(userId),
  credentials: "include"
})

/**
 * 创建带 Bearer token 认证的请求
 */
export const createTokenAuthRequest = (
  userId: number,
  accessToken: string
): RequestInit => ({
  method: "GET",
  headers: createRequestHeaders(userId, accessToken),
  credentials: "omit" // 明确不携带 cookies
})

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
 */
export const apiRequestData = async <T>(
  url: string,
  options?: RequestInit,
  endpoint?: string
): Promise<T> => {
  const res = await apiRequest<T>(url, options, endpoint)

  if (!res.success || res.data === undefined) {
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
 */
export const apiRequest = async <T>(
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
