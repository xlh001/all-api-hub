// 站点的token 密钥信息(API 密钥)
interface ApiToken {
  id: number
  user_id: number
  key: string
  status: number
  name: string
  created_time: number
  accessed_time: number
  expired_time: number
  remain_quota: number
  unlimited_quota: boolean
  used_quota: number
  group?: string

  setting?: {
    heartbeat?: {
      enabled: boolean
      timeout_seconds: number
    }
  }
}

export interface PaginatedTokenDate {
  data: ApiToken[]
  page: number
  size: number
  total_count: number
}

// 分页令牌响应类型
export interface PaginatedTokenResponse {
  data: PaginatedTokenDate
  message: string
  success: boolean
}
