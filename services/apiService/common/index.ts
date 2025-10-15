import { UI_CONSTANTS } from "~/constants/ui.ts"
import { REQUEST_CONFIG } from "~/services/apiService/common/constant"
import { ApiError } from "~/services/apiService/common/errors"
import {
  AccessTokenInfo,
  AccountData,
  CreateTokenRequest,
  HealthCheckResult,
  LogResponseData,
  LogType,
  PaginatedTokenResponse,
  PricingResponse,
  RefreshAccountResult,
  SiteStatusInfo,
  TodayIncomeData,
  TodayUsageData,
  UpstreamModelItem,
  UpstreamModelList,
  UserGroupInfo,
  UserInfo
} from "~/services/apiService/common/type"
import {
  aggregateUsageData,
  extractAmount,
  fetchApi,
  fetchApiData,
  getTodayTimestampRange
} from "~/services/apiService/common/utils"
import { AuthTypeEnum, type ApiToken, type CheckInConfig } from "~/types"

// ============= 核心 API 函数 =============

/**
 * 获取用户基本信息（用于账号检测） - 使用浏览器 cookie 认证
 */
export const fetchUserInfo = async (
  baseUrl: string,
  userId?: number,
  _authType?: AuthTypeEnum
): Promise<UserInfo> => {
  const userData = await fetchApiData<UserInfo>({
    baseUrl,
    endpoint: "/api/user/self",
    userId,
    authType: AuthTypeEnum.Cookie
  })

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
  return await fetchApiData<string>({
    baseUrl,
    endpoint: "/api/user/token",
    userId,
    authType: AuthTypeEnum.Cookie
  })
}

/**
 * 获取站点状态信息（包含充值比例）
 */
export const fetchSiteStatus = async (
  baseUrl: string,
  authType?: AuthTypeEnum
): Promise<SiteStatusInfo | null> => {
  try {
    return await fetchApiData({
      baseUrl,
      endpoint: "/api/status",
      authType: authType || AuthTypeEnum.None
    })
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
  accessToken: string,
  authType?: AuthTypeEnum
): Promise<number> => {
  const userData = await fetchApiData<{ quota?: number }>({
    baseUrl,
    endpoint: "/api/user/self",
    userId,
    token: accessToken,
    authType
  })

  return userData.quota || 0
}

/**
 * 获取签到状态
 */
export const fetchCheckInStatus = async (
  baseUrl: string,
  userId: number,
  accessToken: string,
  authType?: AuthTypeEnum
): Promise<boolean | undefined> => {
  try {
    const checkInData = await fetchApiData<{ can_check_in?: boolean }>({
      baseUrl,
      endpoint: "/api/user/check_in_status",
      userId,
      token: accessToken,
      authType
    })
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
  accessToken: string,
  authType?: AuthTypeEnum
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
      type: String(LogType.Consume),
      token_name: "",
      model_name: "",
      start_timestamp: startTimestamp.toString(),
      end_timestamp: endTimestamp.toString(),
      group: ""
    })

    const logData = await fetchApiData<LogResponseData>({
      baseUrl,
      endpoint: `/api/log/self?${params.toString()}`,
      userId,
      token: accessToken,
      authType
    })

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
 * 获取今日收入情况
 */
export const fetchTodayIncome = async (
  baseUrl: string,
  userId: number,
  accessToken: string,
  authType?: AuthTypeEnum
): Promise<TodayIncomeData> => {
  const { start: startTimestamp, end: endTimestamp } = getTodayTimestampRange()

  let totalIncome = 0
  let maxPageReached = false

  // 获取充值记录 (type=1)
  try {
    let currentPage = 1
    while (currentPage <= REQUEST_CONFIG.MAX_PAGES) {
      const params = new URLSearchParams({
        p: currentPage.toString(),
        page_size: REQUEST_CONFIG.DEFAULT_PAGE_SIZE.toString(),
        type: String(LogType.Recharge),
        token_name: "",
        model_name: "",
        start_timestamp: startTimestamp.toString(),
        end_timestamp: endTimestamp.toString(),
        group: ""
      })

      const logData = await fetchApiData<LogResponseData>({
        baseUrl,
        endpoint: `/api/log/self?${params.toString()}`,
        userId,
        token: accessToken,
        authType
      })

      const items = logData.items || []

      // 聚合充值数据
      totalIncome += items.reduce(
        (sum, item) =>
          sum +
          (item.quota ||
            UI_CONSTANTS.EXCHANGE_RATE.CONVERSION_FACTOR *
              (extractAmount(item.content)?.amount ?? 0)),
        0
      )

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
      maxPageReached = true
    }
  } catch (error) {
    console.warn("获取充值记录失败:", error)
  }

  // 获取签到记录 (type=5)
  try {
    let currentPage = 1
    while (currentPage <= REQUEST_CONFIG.MAX_PAGES) {
      const params = new URLSearchParams({
        p: currentPage.toString(),
        page_size: REQUEST_CONFIG.DEFAULT_PAGE_SIZE.toString(),
        type: String(LogType.System),
        token_name: "",
        model_name: "",
        start_timestamp: startTimestamp.toString(),
        end_timestamp: endTimestamp.toString(),
        group: ""
      })

      const logData = await fetchApiData<LogResponseData>({
        baseUrl,
        endpoint: `/api/log/self?${params.toString()}`,
        userId,
        token: accessToken,
        authType
      })

      const items = logData.items || []

      // 聚合签到数据
      totalIncome += items.reduce(
        (sum, item) =>
          sum +
          (item.quota ||
            UI_CONSTANTS.EXCHANGE_RATE.CONVERSION_FACTOR *
              (extractAmount(item.content)?.amount ?? 0)),
        0
      )

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
      maxPageReached = true
    }
  } catch (error) {
    console.warn("获取签到记录失败:", error)
  }

  if (maxPageReached) {
    console.warn(
      `达到最大分页限制(${REQUEST_CONFIG.MAX_PAGES}页)，停止获取收入数据`
    )
  }

  return { today_income: totalIncome }
}

/**
 * 获取完整的账号数据
 */
export const fetchAccountData = async (
  baseUrl: string,
  userId: number,
  accessToken: string,
  checkin: CheckInConfig,
  authType?: AuthTypeEnum
): Promise<AccountData> => {
  const promises: Promise<any>[] = [
    fetchAccountQuota(baseUrl, userId, accessToken, authType),
    fetchTodayUsage(baseUrl, userId, accessToken, authType),
    fetchTodayIncome(baseUrl, userId, accessToken, authType)
  ]

  if (checkin?.enableDetection && !checkin.customCheckInUrl) {
    promises.push(fetchCheckInStatus(baseUrl, userId, accessToken, authType))
  }

  const [quota, todayUsage, todayIncome, canCheckIn] = (await Promise.all(
    promises
  )) as [number, TodayUsageData, TodayIncomeData, boolean | undefined]

  return {
    quota,
    ...todayUsage,
    ...todayIncome,
    checkIn: {
      ...checkin,
      isCheckedInToday: canCheckIn
    }
  }
}

/**
 * 刷新单个账号数据
 */
export const refreshAccountData = async (
  baseUrl: string,
  userId: number,
  accessToken: string,
  checkIn: CheckInConfig,
  authType?: AuthTypeEnum
): Promise<RefreshAccountResult> => {
  try {
    const data = await fetchAccountData(
      baseUrl,
      userId,
      accessToken,
      checkIn,
      authType
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
  accessToken: string,
  authType?: AuthTypeEnum
): Promise<boolean> => {
  try {
    await fetchAccountQuota(baseUrl, userId, accessToken, authType)
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
  { baseUrl, userId, token: accessToken, authType },
  page: number = 0,
  size: number = 100
): Promise<ApiToken[]> => {
  const params = new URLSearchParams({
    p: page.toString(),
    size: size.toString()
  })

  try {
    // 尝试获取响应数据，可能是直接的数组或者分页对象
    const tokensData = await fetchApiData<ApiToken[] | PaginatedTokenResponse>({
      baseUrl,
      endpoint: `/api/token/?${params.toString()}`,
      userId,
      token: accessToken,
      authType
    })

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
export const fetchAvailableModels = async ({
  baseUrl,
  userId,
  token: accessToken,
  authType
}): Promise<string[]> => {
  try {
    return await fetchApiData<string[]>({
      baseUrl,
      endpoint: "/api/user/models",
      userId,
      token: accessToken,
      authType
    })
  } catch (error) {
    console.error("获取模型列表失败:", error)
    throw error
  }
}

/**
 * 获取上游模型列表
 * @param baseUrl
 * @param accessToken
 */
export const fetchUpstreamModels = async ({
  baseUrl,
  token: accessToken,
  authType
}) => {
  try {
    return await fetchApiData<UpstreamModelList>({
      baseUrl,
      endpoint: "/v1/models",
      token: accessToken,
      authType
    })
  } catch (error) {
    console.error("获取上游模型列表失败:", error)
    throw error
  }
}

export const fetchUpstreamModelsNameList = async ({
  baseUrl,
  token: accessToken,
  authType
}) => {
  const upstreamModels = await fetchUpstreamModels({
    baseUrl: baseUrl,
    token: accessToken,
    authType
  })
  return upstreamModels.map((item: UpstreamModelItem) => item.id)
}

/**
 * 获取用户分组信息
 */
export const fetchUserGroups = async ({
  baseUrl,
  userId,
  token: accessToken,
  authType
}): Promise<Record<string, UserGroupInfo>> => {
  try {
    return await fetchApiData<Record<string, UserGroupInfo>>({
      baseUrl,
      endpoint: "/api/user/self/groups",
      userId,
      token: accessToken,
      authType
    })
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
  tokenData: CreateTokenRequest,
  authType?: AuthTypeEnum
): Promise<boolean> => {
  try {
    const response = await fetchApi<any>({
      baseUrl,
      endpoint: "/api/token/",
      userId,
      token: accessToken,
      authType,
      options: {
        method: "POST",
        body: JSON.stringify(tokenData)
      }
    })

    // 对于创建令牌的响应，只检查success字段，不要求data字段存在
    if (!response.success) {
      throw new ApiError(
        response.message || "创建令牌失败",
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
  tokenId: number,
  authType?: AuthTypeEnum
): Promise<ApiToken> => {
  try {
    return await fetchApiData<ApiToken>({
      baseUrl,
      endpoint: `/api/token/${tokenId}`,
      userId,
      token: accessToken,
      authType
    })
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
  tokenData: CreateTokenRequest,
  authType?: AuthTypeEnum
): Promise<boolean> => {
  try {
    const response = await fetchApi<any>({
      baseUrl,
      endpoint: "/api/token/",
      userId,
      token: accessToken,
      authType,
      options: {
        method: "PUT",
        body: JSON.stringify({ ...tokenData, id: tokenId })
      }
    })

    if (!response.success) {
      throw new ApiError(
        response.message || "更新令牌失败",
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
  tokenId: number,
  authType?: AuthTypeEnum
): Promise<boolean> => {
  try {
    const response = await fetchApi<any>({
      baseUrl,
      endpoint: `/api/token/${tokenId}`,
      userId,
      token: accessToken,
      authType,
      options: {
        method: "DELETE"
      }
    })

    if (!response.success) {
      throw new ApiError(
        response.message || "删除令牌失败",
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
  token: accessToken,
  authType
}): Promise<PricingResponse> => {
  try {
    // /api/pricing 接口直接返回 PricingResponse 格式，不需要通过 apiRequestData 包装
    const data = await fetchApi<PricingResponse["data"]>({
      baseUrl,
      endpoint: "/api/pricing",
      userId,
      token: accessToken,
      authType
    })

    if (!data.success) {
      throw new ApiError("获取定价信息失败", undefined, "/api/pricing")
    }

    return data as PricingResponse
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
