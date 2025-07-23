/**
 * API 服务 - 用于与 One API/New API 站点进行交互
 */

// ============= 类型定义 =============
export interface UserInfo {
  id: number
  username: string
  access_token: string | null
}

export interface AccessTokenInfo {
  username: string
  access_token: string
}

export interface TodayUsageData {
  today_quota_consumption: number
  today_prompt_tokens: number
  today_completion_tokens: number
  today_requests_count: number
}

export interface AccountData extends TodayUsageData {
  quota: number
}

export interface RefreshAccountResult {
  success: boolean
  data?: AccountData
  healthStatus: HealthCheckResult
}

export interface HealthCheckResult {
  status: 'healthy' | 'warning' | 'error' | 'unknown'
  message: string
}

// API 响应的通用格式
interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
}

// 日志条目类型
interface LogItem {
  quota?: number
  prompt_tokens?: number
  completion_tokens?: number
}

// 日志响应数据
interface LogResponseData {
  items: LogItem[]
  total: number
}

// ============= 常量定义 =============
const REQUEST_CONFIG = {
  DEFAULT_PAGE_SIZE: 100,
  MAX_PAGES: 100,
  HEADERS: {
    CONTENT_TYPE: 'application/json',
    PRAGMA: 'no-cache'
  }
} as const

// ============= 错误处理 =============
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// ============= 工具函数 =============
/**
 * 创建请求头
 */
const createRequestHeaders = (userId: number, accessToken?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    'New-API-User': userId.toString(),
    'Content-Type': REQUEST_CONFIG.HEADERS.CONTENT_TYPE,
    'Pragma': REQUEST_CONFIG.HEADERS.PRAGMA
  }
  
  if (accessToken) {
    headers['Cookie'] = '' // 使用 Bearer token 时清空 Cookie 头
    headers['Authorization'] = `Bearer ${accessToken}`
  }
  
  return headers
}

/**
 * 通用 API 请求处理器
 */
const apiRequest = async <T>(
  url: string,
  options: RequestInit,
  endpoint: string
): Promise<T> => {
  const response = await fetch(url, options)

  if (!response.ok) {
    throw new ApiError(`请求失败: ${response.status}`, response.status, endpoint)
  }

  const data: ApiResponse<T> = await response.json()
  if (!data.success || data.data === undefined) {
    throw new ApiError('响应数据格式错误', undefined, endpoint)
  }

  return data.data
}

/**
 * 创建带 cookie 认证的请求
 */
const createCookieAuthRequest = (userId: number): RequestInit => ({
  method: 'GET',
  headers: createRequestHeaders(userId),
  credentials: 'include'
})

/**
 * 创建带 Bearer token 认证的请求
 */
const createTokenAuthRequest = (userId: number, accessToken: string): RequestInit => ({
  method: 'GET',
  headers: createRequestHeaders(userId, accessToken)
})

/**
 * 计算今日时间戳范围
 */
const getTodayTimestampRange = (): { start: number; end: number } => {
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
const aggregateUsageData = (items: LogItem[]): Omit<TodayUsageData, 'today_requests_count'> => {
  return items.reduce(
    (acc, item) => ({
      today_quota_consumption: acc.today_quota_consumption + (item.quota || 0),
      today_prompt_tokens: acc.today_prompt_tokens + (item.prompt_tokens || 0),
      today_completion_tokens: acc.today_completion_tokens + (item.completion_tokens || 0)
    }),
    {
      today_quota_consumption: 0,
      today_prompt_tokens: 0,
      today_completion_tokens: 0
    }
  )
}

// ============= 核心 API 函数 =============

/**
 * 获取用户基本信息（用于账号检测） - 使用浏览器 cookie 认证
 */
export const fetchUserInfo = async (baseUrl: string, userId: number): Promise<UserInfo> => {
  const url = `${baseUrl}/api/user/self`
  const options = createCookieAuthRequest(userId)
  
  const userData = await apiRequest<UserInfo>(url, options, '/api/user/self')
  
  return {
    id: userData.id,
    username: userData.username,
    access_token: userData.access_token || null
  }
}

/**
 * 创建访问令牌 - 使用浏览器 cookie 认证
 */
export const createAccessToken = async (baseUrl: string, userId: number): Promise<string> => {
  const url = `${baseUrl}/api/user/token`
  const options = createCookieAuthRequest(userId)
  
  return await apiRequest<string>(url, options, '/api/user/token')
}

/**
 * 自动获取或创建访问令牌
 */
export const getOrCreateAccessToken = async (baseUrl: string, userId: number): Promise<AccessTokenInfo> => {
  // 首先获取用户信息
  const userInfo = await fetchUserInfo(baseUrl, userId)
  
  let accessToken = userInfo.access_token
  
  // 如果没有访问令牌，则创建一个
  if (!accessToken) {
    console.log('访问令牌为空，尝试自动创建...')
    accessToken = await createAccessToken(baseUrl, userId)
    console.log('自动创建访问令牌成功')
  }
  
  return {
    username: userInfo.username,
    access_token: accessToken
  }
}

/**
 * 获取账号余额信息
 */
export const fetchAccountQuota = async (baseUrl: string, userId: number, accessToken: string): Promise<number> => {
  const url = `${baseUrl}/api/user/self`
  const options = createTokenAuthRequest(userId, accessToken)
  
  const userData = await apiRequest<{ quota?: number }>(url, options, '/api/user/self')
  
  return userData.quota || 0
}

/**
 * 获取今日使用情况
 */
export const fetchTodayUsage = async (baseUrl: string, userId: number, accessToken: string): Promise<TodayUsageData> => {
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
      type: '0',
      token_name: '',
      model_name: '',
      start_timestamp: startTimestamp.toString(),
      end_timestamp: endTimestamp.toString(),
      group: ''
    })

    const url = `${baseUrl}/api/log/self?${params.toString()}`
    const options = createTokenAuthRequest(userId, accessToken)
    
    const logData = await apiRequest<LogResponseData>(url, options, '/api/log/self')
    
    const items = logData.items || []
    const currentPageItemCount = items.length

    // 聚合当前页数据
    const pageData = aggregateUsageData(items)
    aggregatedData.today_quota_consumption += pageData.today_quota_consumption
    aggregatedData.today_prompt_tokens += pageData.today_prompt_tokens
    aggregatedData.today_completion_tokens += pageData.today_completion_tokens
    
    totalRequestsCount += currentPageItemCount

    // 检查是否还有更多数据
    const totalPages = Math.ceil((logData.total || 0) / REQUEST_CONFIG.DEFAULT_PAGE_SIZE)
    if (currentPage >= totalPages) {
      break
    }

    currentPage++
  }

  if (currentPage > REQUEST_CONFIG.MAX_PAGES) {
    console.warn(`达到最大分页限制(${REQUEST_CONFIG.MAX_PAGES}页)，停止获取数据`)
  }

  return {
    ...aggregatedData,
    today_requests_count: totalRequestsCount
  }
}

/**
 * 获取完整的账号数据
 */
export const fetchAccountData = async (baseUrl: string, userId: number, accessToken: string): Promise<AccountData> => {
  const [quota, todayUsage] = await Promise.all([
    fetchAccountQuota(baseUrl, userId, accessToken),
    fetchTodayUsage(baseUrl, userId, accessToken)
  ])

  return {
    quota,
    ...todayUsage
  }
}

/**
 * 刷新单个账号数据
 */
export const refreshAccountData = async (
  baseUrl: string, 
  userId: number, 
  accessToken: string
): Promise<RefreshAccountResult> => {
  try {
    const data = await fetchAccountData(baseUrl, userId, accessToken)
    return {
      success: true,
      data,
      healthStatus: {
        status: 'healthy',
        message: '账号状态正常'
      }
    }
  } catch (error) {
    console.error('刷新账号数据失败:', error)
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
    console.error('账号连接验证失败:', error)
    return false
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
        status: 'warning',
        message: `HTTP ${error.statusCode}: ${error.message}`
      }
    }
    // 其他API错误（数据格式错误等）
    return {
      status: 'unknown',
      message: error.message
    }
  }
  
  // 网络连接失败、超时等HTTP请求失败的情况
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      status: 'error',
      message: '网络连接失败'
    }
  }
  
  // 其他未知错误
  return {
    status: 'unknown',
    message: error?.message || '未知错误'
  }
}