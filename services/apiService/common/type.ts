/**
 * API 服务 - 用于与 One API/New API 站点进行交互
 */
import type { ApiToken } from "~/types"
import type { PerCallPrice } from "~/utils/modelPricing"

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
  can_check_in?: boolean
}

export interface RefreshAccountResult {
  success: boolean
  data?: AccountData
  healthStatus: HealthCheckResult
}

export interface HealthCheckResult {
  status: "healthy" | "warning" | "error" | "unknown"
  message: string
}

export interface SiteStatusInfo {
  price?: number
  stripe_unit_price?: number
  PaymentUSDRate?: number
  system_name?: string
  check_in_enabled?: boolean
}

export interface CheckInStatus {
  can_check_in: boolean
}

// 模型列表响应类型
export interface ModelsResponse {
  data: string[]
  message: string
  success: boolean
}

// 分组信息类型
export interface UserGroupInfo {
  desc: string
  ratio: number
}

// 分组响应类型
export interface UserGroupsResponse {
  data: Record<string, UserGroupInfo>
  message: string
  success: boolean
}

// 创建令牌请求类型
export interface CreateTokenRequest {
  name: string
  remain_quota: number
  expired_time: number
  unlimited_quota: boolean
  model_limits_enabled: boolean
  model_limits: string
  allow_ips: string
  group: string
}

// 创建令牌响应类型
export interface CreateTokenResponse {
  message: string
  success: boolean
}

// 模型定价信息类型
export interface ModelPricing {
  model_name: string
  model_description?: string
  quota_type: number // 0 = 按量计费，1 = 按次计费
  model_ratio: number
  model_price: number | PerCallPrice
  owner_by?: string
  completion_ratio: number
  enable_groups: string[]
  supported_endpoint_types: string[]
}

// 模型定价响应类型
export interface PricingResponse {
  data: ModelPricing[]
  group_ratio: Record<string, number>
  success: boolean
  usable_group: Record<string, string>
}

// 分页令牌响应类型
export interface PaginatedTokenResponse {
  page: number
  page_size: number
  total: number
  items: ApiToken[]
}

// API 响应的通用格式
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
}

// 日志条目类型
export interface LogItem {
  quota?: number
  prompt_tokens?: number
  completion_tokens?: number
}

// 日志响应数据
export interface LogResponseData {
  items: LogItem[]
  total: number
}

export type BaseFetchParams = {
  baseUrl: string
  userId: number
  token: string
}

// 上游模型列表（OpenAI格式）
export type UpstreamModelItem = {
  id: string
  object: "model"
  created: number
  owned_by: string
}

export type UpstreamModelList = UpstreamModelItem[]
