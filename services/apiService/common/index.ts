import { REQUEST_CONFIG } from "~/services/apiService/common/constant"
import type {
  AccessTokenInfo,
  AccountData,
  ApiResponse,
  CreateTokenRequest,
  UserGroupInfo,
  HealthCheckResult,
  LogResponseData,
  PaginatedTokenResponse,
  PricingResponse,
  RefreshAccountResult,
  SiteStatusInfo,
  TodayUsageData,
  UserInfo
} from "~/services/apiService/common/type"
import {
  aggregateUsageData,
  apiRequestData,
  createCookieAuthRequest,
  createRequestHeaders,
  createTokenAuthRequest,
  getTodayTimestampRange
} from "~/services/apiService/common/utils"
import type { ApiToken } from "~/types"
import { joinUrl } from "~/utils/url"

// ============= 错误处理 =============
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string
  ) {
    super(message)
    this.name = "ApiError"
  }
}

// ============= 核心 API 函数 =============

/**
 * 获取用户基本信息（用于账号检测） - 使用浏览器 cookie 认证
 */
export const fetchUserInfo = async (
  baseUrl: string,
  userId?: number
): Promise<UserInfo> => {
  const url = joinUrl(baseUrl, "/api/user/self")
  const options = createCookieAuthRequest(userId)

  const userData = await apiRequestData<UserInfo>(
    url,
    options,
    "/api/user/self"
  )

  return {
    id: userData.id,
    username: userData.username,
    access_token: userData.access_token || null
  }
}

/**
 * 创建访问令牌 - 使用浏览器 cookie 认证
 */
export const createAccessToken = async (
  baseUrl: string,
  userId: number
): Promise<string> => {
  const url = joinUrl(baseUrl, "/api/user/token")
  const options = createCookieAuthRequest(userId)

  return await apiRequestData<string>(url, options, "/api/user/token")
}

/**
 * 获取站点状态信息（包含充值比例）
 */
export const fetchSiteStatus = async (
  baseUrl: string
): Promise<SiteStatusInfo | null> => {
  try {
    const url = joinUrl(baseUrl, "/api/status")
    const options = {
      method: "GET",
      headers: {
        "Content-Type": REQUEST_CONFIG.HEADERS.CONTENT_TYPE,
        Pragma: REQUEST_CONFIG.HEADERS.PRAGMA
      },
      credentials: "omit" as RequestCredentials // 明确不携带 cookies
    }

    const response = await fetch(url, options)
    if (!response.ok) {
      console.warn(`获取站点状态失败: ${response.status}`)
      return null
    }

    const data: ApiResponse<SiteStatusInfo> = await response.json()
    if (!data.success || !data.data) {
      console.warn("站点状态响应数据格式错误")
      return null
    }

    return data.data
  } catch (error) {
    console.warn("获取站点状态信息失败:", error)
    return null
  }
}

/**
 * 从站点状态信息中提取默认充值比例
 */
export const extractDefaultExchangeRate = (
  statusInfo: SiteStatusInfo | null
): number | null => {
  if (!statusInfo) {
    return null
  }

  // 优先使用 price
  if (statusInfo.price && statusInfo.price > 0) {
    return statusInfo.price
  }

  // 次选 stripe_unit_price
  if (statusInfo.stripe_unit_price && statusInfo.stripe_unit_price > 0) {
    return statusInfo.stripe_unit_price
  }

  // 兼容 done-hub 和 one-hub
  if (statusInfo.PaymentUSDRate && statusInfo.PaymentUSDRate > 0) {
    return statusInfo.PaymentUSDRate
  }
  return null
}

/**
 * 自动获取或创建访问令牌
 */
export const getOrCreateAccessToken = async (
  baseUrl: string,
  userId: number
): Promise<AccessTokenInfo> => {
  // 首先获取用户信息
  const userInfo = await fetchUserInfo(baseUrl, userId)

  let accessToken = userInfo.access_token

  // 如果没有访问令牌，则创建一个
  if (!accessToken) {
    console.log("访问令牌为空，尝试自动创建...")
    accessToken = await createAccessToken(baseUrl, userId)
    console.log("自动创建访问令牌成功")
  }

  return {
    username: userInfo.username,
    access_token: accessToken
  }
}

/**
 * 获取账号余额信息
 */
export const fetchAccountQuota = async (
  baseUrl: string,
  userId: number,
  accessToken: string
): Promise<number> => {
  const url = joinUrl(baseUrl, "/api/user/self")
  const options = createTokenAuthRequest(userId, accessToken)

  const userData = await apiRequestData<{ quota?: number }>(
    url,
    options,
    "/api/user/self"
  )

  return userData.quota || 0
}

/**
 * 获取签到状态
 */
export const fetchCheckInStatus = async (
  baseUrl: string,
  userId: number,
  accessToken: string
): Promise<boolean | undefined> => {
  const url = joinUrl(baseUrl, "/api/user/check_in_status")
  const options = createTokenAuthRequest(userId, accessToken)

  try {
    const checkInData = await apiRequestData<{ can_check_in?: boolean }>(
      url,
      options,
      "/api/user/check_in_status"
    )
    // 仅当 can_check_in 明确为 true 或 false 时才返回，否则返回 undefined
    if (typeof checkInData.can_check_in === "boolean") {
      return checkInData.can_check_in
    }
    return undefined
  } catch (error) {
    // 如果接口不存在或返回错误（如 404 Not Found），则认为不支持签到功能
    if (
      error instanceof ApiError &&
      (error.statusCode === 404 || error.statusCode === 500)
    ) {
      return undefined
    }
    console.warn("获取签到状态失败:", error)
    return undefined // 其他错误也视为不支持
  }
}

/**
 * 检查是否支持签到功能
 * @param baseUrl
 */
export const fetchSupportCheckIn = async (
  baseUrl: string
): Promise<boolean> => {
  const siteStatus = await fetchSiteStatus(baseUrl)
  return siteStatus?.check_in_enabled
}

/**
 * 获取今日使用情况
 */
export const fetchTodayUsage = async (
  baseUrl: string,
  userId: number,
  accessToken: string
): Promise<TodayUsageData> => {
  const { start: startTimestamp, end: endTimestamp } = getTodayTimestampRange()

  let currentPage = 1
  let totalRequestsCount = 0
  let aggregatedData = {
    today_quota_consumption: 0,
    today_prompt_tokens: 0,
    today_completion_tokens: 0
  }

  // 循环获取所有分页数据
  while (currentPage <= REQUEST_CONFIG.MAX_PAGES) {
    const params = new URLSearchParams({
      p: currentPage.toString(),
      page_size: REQUEST_CONFIG.DEFAULT_PAGE_SIZE.toString(),
      type: "0",
      token_name: "",
      model_name: "",
      start_timestamp: startTimestamp.toString(),
      end_timestamp: endTimestamp.toString(),
      group: ""
    })

    const url = joinUrl(baseUrl, `/api/log/self?${params.toString()}`)
    const options = createTokenAuthRequest(userId, accessToken)

    const logData = await apiRequestData<LogResponseData>(
      url,
      options,
      "/api/log/self"
    )

    const items = logData.items || []
    const currentPageItemCount = items.length

    // 聚合当前页数据
    const pageData = aggregateUsageData(items)
    aggregatedData.today_quota_consumption += pageData.today_quota_consumption
    aggregatedData.today_prompt_tokens += pageData.today_prompt_tokens
    aggregatedData.today_completion_tokens += pageData.today_completion_tokens

    totalRequestsCount += currentPageItemCount

    // 检查是否还有更多数据
    const totalPages = Math.ceil(
      (logData.total || 0) / REQUEST_CONFIG.DEFAULT_PAGE_SIZE
    )
    if (currentPage >= totalPages) {
      break
    }

    currentPage++
  }

  if (currentPage > REQUEST_CONFIG.MAX_PAGES) {
    console.warn(
      `达到最大分页限制(${REQUEST_CONFIG.MAX_PAGES}页)，停止获取数据`
    )
  }

  return {
    ...aggregatedData,
    today_requests_count: totalRequestsCount
  }
}

/**
 * 获取完整的账号数据
 */
export const fetchAccountData = async (
  baseUrl: string,
  userId: number,
  accessToken: string,
  checkSupport: boolean
): Promise<AccountData> => {
  const promises: (
    | Promise<number>
    | Promise<TodayUsageData>
    | Promise<boolean | undefined>
  )[] = [
    fetchAccountQuota(baseUrl, userId, accessToken),
    fetchTodayUsage(baseUrl, userId, accessToken)
  ]

  if (checkSupport) {
    promises.push(fetchCheckInStatus(baseUrl, userId, accessToken))
  }

  const [quota, todayUsage, canCheckIn] = await Promise.all(promises)

  return {
    quota,
    ...todayUsage,
    can_check_in: canCheckIn
  }
}

/**
 * 刷新单个账号数据
 */
export const refreshAccountData = async (
  baseUrl: string,
  userId: number,
  accessToken: string,
  checkSupport: boolean
): Promise<RefreshAccountResult> => {
  try {
    const data = await fetchAccountData(
      baseUrl,
      userId,
      accessToken,
      checkSupport
    )
    return {
      success: true,
      data,
      healthStatus: {
        status: "healthy",
        message: "账号状态正常"
      }
    }
  } catch (error) {
    console.error("刷新账号数据失败:", error)
    return {
      success: false,
      healthStatus: determineHealthStatus(error)
    }
  }
}

/**
 * 验证账号连接性
 */
export const validateAccountConnection = async (
  baseUrl: string,
  userId: number,
  accessToken: string
): Promise<boolean> => {
  try {
    await fetchAccountQuota(baseUrl, userId, accessToken)
    return true
  } catch (error) {
    console.error("账号连接验证失败:", error)
    return false
  }
}

/**
 * 获取账号令牌列表
 */
export const fetchAccountTokens = async (
  { baseUrl, userId, token: accessToken },
  page: number = 0,
  size: number = 100
): Promise<ApiToken[]> => {
  const params = new URLSearchParams({
    p: page.toString(),
    size: size.toString()
  })

  const url = joinUrl(baseUrl, `/api/token/?${params.toString()}`)
  const options = createTokenAuthRequest(userId, accessToken)

  try {
    // 尝试获取响应数据，可能是直接的数组或者分页对象
    const tokensData = await apiRequestData<
      ApiToken[] | PaginatedTokenResponse
    >(url, options, "/api/token")

    // 处理不同的响应格式
    if (Array.isArray(tokensData)) {
      // 直接返回数组格式
      return tokensData
    } else if (
      tokensData &&
      typeof tokensData === "object" &&
      "items" in tokensData
    ) {
      // 分页格式，返回 items 数组
      return tokensData.items || []
    } else {
      // 其他情况，返回空数组
      console.warn("Unexpected token response format:", tokensData)
      return []
    }
  } catch (error) {
    console.error("获取令牌列表失败:", error)
    throw error
  }
}

/**
 * 获取可用模型列表
 */
export const fetchAvailableModels = async (
  baseUrl: string,
  userId: number,
  accessToken: string
): Promise<string[]> => {
  const url = joinUrl(baseUrl, "/api/user/models")
  const options = createTokenAuthRequest(userId, accessToken)

  try {
    const response = await apiRequestData<string[]>(
      url,
      options,
      "/api/user/models"
    )
    return response
  } catch (error) {
    console.error("获取模型列表失败:", error)
    throw error
  }
}

/**
 * 获取用户分组信息
 */
export const fetchUserGroups = async (
  baseUrl: string,
  userId: number,
  accessToken: string
): Promise<Record<string, UserGroupInfo>> => {
  const url = joinUrl(baseUrl, "/api/user/self/groups")
  const options = createTokenAuthRequest(userId, accessToken)

  try {
    const response = await apiRequestData<Record<string, UserGroupInfo>>(
      url,
      options,
      "/api/user/self/groups"
    )
    return response
  } catch (error) {
    console.error("获取分组信息失败:", error)
    throw error
  }
}

/**
 * 创建新的API令牌
 */
export const createApiToken = async (
  baseUrl: string,
  userId: number,
  accessToken: string,
  tokenData: CreateTokenRequest
): Promise<boolean> => {
  const url = joinUrl(baseUrl, "/api/token/")
  const options = {
    method: "POST",
    headers: createRequestHeaders(userId, accessToken),
    credentials: "omit" as RequestCredentials,
    body: JSON.stringify(tokenData)
  }

  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      throw new ApiError(
        `请求失败: ${response.status}`,
        response.status,
        "/api/token"
      )
    }

    const data: ApiResponse<any> = await response.json()

    // 对于创建令牌的响应，只检查success字段，不要求data字段存在
    if (!data.success) {
      throw new ApiError(
        data.message || "创建令牌失败",
        undefined,
        "/api/token"
      )
    }

    return true
  } catch (error) {
    console.error("创建令牌失败:", error)
    throw error
  }
}

/**
 * 获取单个API令牌详情
 */
export const fetchTokenById = async (
  baseUrl: string,
  userId: number,
  accessToken: string,
  tokenId: number
): Promise<ApiToken> => {
  const url = joinUrl(baseUrl, `/api/token/${tokenId}`)
  const options = createTokenAuthRequest(userId, accessToken)

  try {
    const response = await apiRequestData<ApiToken>(
      url,
      options,
      `/api/token/${tokenId}`
    )
    return response
  } catch (error) {
    console.error("获取令牌详情失败:", error)
    throw error
  }
}

/**
 * 更新API令牌
 */
export const updateApiToken = async (
  baseUrl: string,
  userId: number,
  accessToken: string,
  tokenId: number,
  tokenData: CreateTokenRequest
): Promise<boolean> => {
  const url = joinUrl(baseUrl, "/api/token/")
  const options = {
    method: "PUT",
    headers: createRequestHeaders(userId, accessToken),
    credentials: "omit" as RequestCredentials,
    body: JSON.stringify({ ...tokenData, id: tokenId })
  }

  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      throw new ApiError(
        `请求失败: ${response.status}`,
        response.status,
        "/api/token"
      )
    }

    const data: ApiResponse<any> = await response.json()

    if (!data.success) {
      throw new ApiError(
        data.message || "更新令牌失败",
        undefined,
        "/api/token"
      )
    }

    return true
  } catch (error) {
    console.error("更新令牌失败:", error)
    throw error
  }
}

/**
 * 删除API令牌
 */
export const deleteApiToken = async (
  baseUrl: string,
  userId: number,
  accessToken: string,
  tokenId: number
): Promise<boolean> => {
  const url = joinUrl(baseUrl, `/api/token/${tokenId}`)
  const options = {
    method: "DELETE",
    headers: createRequestHeaders(userId, accessToken),
    credentials: "omit" as RequestCredentials
  }

  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      throw new ApiError(
        `请求失败: ${response.status}`,
        response.status,
        `/api/token/${tokenId}`
      )
    }

    const data: ApiResponse<any> = await response.json()

    if (!data.success) {
      throw new ApiError(
        data.message || "删除令牌失败",
        undefined,
        `/api/token/${tokenId}`
      )
    }

    return true
  } catch (error) {
    console.error("删除令牌失败:", error)
    throw error
  }
}

/**
 * 获取模型定价信息
 */
export const fetchModelPricing = async ({
  baseUrl,
  userId,
  token: accessToken
}): Promise<PricingResponse> => {
  const url = joinUrl(baseUrl, "/api/pricing")
  const options = createTokenAuthRequest(userId, accessToken)

  try {
    // /api/pricing 接口直接返回 PricingResponse 格式，不需要通过 apiRequestData 包装
    const response = await fetch(url, options)

    if (!response.ok) {
      throw new ApiError(
        `请求失败: ${response.status}`,
        response.status,
        "/api/pricing"
      )
    }

    const data: PricingResponse = await response.json()

    if (!data.success) {
      throw new ApiError("获取定价信息失败", undefined, "/api/pricing")
    }

    return data
  } catch (error) {
    console.error("获取模型定价失败:", error)
    throw error
  }
}

// ============= 健康状态判断 =============

/**
 * 根据错误判断健康状态
 */
export const determineHealthStatus = (error: any): HealthCheckResult => {
  if (error instanceof ApiError) {
    // HTTP响应码不为200的情况
    if (error.statusCode) {
      return {
        status: "warning",
        message: `HTTP ${error.statusCode}: ${error.message}`
      }
    }
    // 其他API错误（数据格式错误等）
    return {
      status: "unknown",
      message: error.message
    }
  }

  // 网络连接失败、超时等HTTP请求失败的情况
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return {
      status: "error",
      message: "网络连接失败"
    }
  }

  // 其他未知错误
  return {
    status: "unknown",
    message: error?.message || "未知错误"
  }
}
