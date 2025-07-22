/**
 * API 服务 - 用于与 One API/New API 站点进行交互
 */

// 获取账号余额信息
export const fetchAccountQuota = async (baseUrl: string, userId: number, accessToken: string): Promise<number> => {
  const response = await fetch(`${baseUrl}/api/user/self`, {
    method: 'GET',
    headers: {
      'New-API-User': userId.toString(),
      'Authorization': `Bearer ${accessToken}`,
      'Pragma': 'no-cache',
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })

  if (!response.ok) {
    throw new ApiError(`获取账号余额失败: ${response.status}`, response.status, '/api/user/self')
  }

  const data = await response.json()
  if (!data.success || !data.data) {
    throw new ApiError('获取账号余额数据格式错误', undefined, '/api/user/self')
  }

  return data.data.quota || 0
}

// 今日使用情况数据类型
export interface TodayUsageData {
  today_quota_consumption: number
  today_prompt_tokens: number
  today_completion_tokens: number
  today_requests_count: number
}

// 获取今日使用情况
export const fetchTodayUsage = async (baseUrl: string, userId: number, accessToken: string): Promise<TodayUsageData> => {
  // 计算今日开始和结束时间戳
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const startTimestamp = Math.floor(today.getTime() / 1000)
  
  today.setHours(23, 59, 59, 999)
  const endTimestamp = Math.floor(today.getTime() / 1000)

  // 初始化统计数据
  let todayQuotaConsumption = 0
  let todayPromptTokens = 0
  let todayCompletionTokens = 0
  let todayRequestsCount = 0

  let currentPage = 1
  const pageSize = 100
  let hasMoreData = true

  // 循环获取所有分页数据
  while (hasMoreData) {
    const params = new URLSearchParams({
      p: currentPage.toString(),
      page_size: pageSize.toString(),
      type: '0',
      token_name: '',
      model_name: '',
      start_timestamp: startTimestamp.toString(),
      end_timestamp: endTimestamp.toString(),
      group: ''
    })

    const response = await fetch(`${baseUrl}/api/log/self?${params.toString()}`, {
      method: 'GET',
      headers: {
        'New-API-User': userId.toString(),
        'Authorization': `Bearer ${accessToken}`,
        'Pragma': 'no-cache',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new ApiError(`获取今日使用情况失败: ${response.status}`, response.status, '/api/log/self')
    }

    const data = await response.json()
    if (!data.success || !data.data) {
      throw new ApiError('获取今日使用情况数据格式错误', undefined, '/api/log/self')
    }

    const items = data.data.items || []
    const currentPageItemCount = items.length

    // 累加当前页数据
    items.forEach((item: any) => {
      todayQuotaConsumption += item.quota || 0
      todayPromptTokens += item.prompt_tokens || 0
      todayCompletionTokens += item.completion_tokens || 0
    })

    todayRequestsCount += currentPageItemCount

    // 检查是否还有更多数据
    const totalPages = Math.ceil((data.data.total || 0) / pageSize)
    hasMoreData = currentPage < totalPages

    currentPage++

    // 防止无限循环的安全机制
    if (currentPage > 100) {
      console.warn('达到最大分页限制(100页)，停止获取数据')
      break
    }
  }

  return {
    today_quota_consumption: todayQuotaConsumption,
    today_prompt_tokens: todayPromptTokens,
    today_completion_tokens: todayCompletionTokens,
    today_requests_count: todayRequestsCount
  }
}

// 获取完整的账号数据
export const fetchAccountData = async (baseUrl: string, userId: number, accessToken: string) => {
  const [quota, todayUsage] = await Promise.all([
    fetchAccountQuota(baseUrl, userId, accessToken),
    fetchTodayUsage(baseUrl, userId, accessToken)
  ])

  return {
    quota,
    ...todayUsage
  }
}

// 刷新单个账号数据
export const refreshAccountData = async (
  baseUrl: string, 
  userId: number, 
  accessToken: string
): Promise<{
  quota: number
  today_quota_consumption: number
  today_prompt_tokens: number
  today_completion_tokens: number
  today_requests_count: number
}> => {
  try {
    return await fetchAccountData(baseUrl, userId, accessToken)
  } catch (error) {
    console.error('刷新账号数据失败:', error)
    throw error
  }
}

// 验证账号连接性
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

// API 错误类型
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