/**
 * New API Model Sync Types
 * Types for New API model synchronization feature
 */

/**
 * Channel representation from New API
 */
export interface NewApiChannel {
  id: number
  type: number
  key: string
  name: string
  base_url: string
  models: string // Comma-separated string
  groups: string // Comma-separated string
  status?: number
  priority?: number
  weight?: number
  [key: string]: any // Allow other fields
}

/**
 * Channel list response from New API
 */
export interface NewApiChannelListResponse {
  success: boolean
  data?: NewApiChannel[]
  message?: string
}

/**
 * Fetch models response from New API
 */
export interface NewApiFetchModelsResponse {
  success: boolean
  data?: string[] // Array of model names
  message?: string
  code?: number
}

/**
 * Update channel response from New API
 */
export interface NewApiUpdateChannelResponse {
  success: boolean
  message?: string
  code?: number
}

/**
 * Error details for execution
 */
export interface ExecutionError {
  httpStatus?: number
  businessCode?: number
  message: string
}

/**
 * Single channel execution result
 */
export interface ExecutionItemResult {
  channelId: number
  channelName: string
  ok: boolean
  httpStatus?: number
  businessCode?: number
  message?: string
  attempts: number
  finishedAt: number
  oldModels?: string[]
  newModels?: string[]
}

/**
 * Execution statistics
 */
export interface ExecutionStatistics {
  total: number
  successCount: number
  failureCount: number
  durationMs: number
  startedAt: number
  endedAt: number
}

/**
 * Complete execution result with items and stats
 */
export interface ExecutionResult {
  items: ExecutionItemResult[]
  statistics: ExecutionStatistics
}

/**
 * Execution filter options
 */
export interface ExecutionFilter {
  status?: "success" | "failure" | "all"
  httpStatus?: number
  businessCode?: number
  searchKeyword?: string
}

/**
 * New API Model Sync Preferences
 */
export interface NewApiModelSyncPreferences {
  enableSync: boolean
  intervalMs: number // Default 24 hours = 86400000 ms
  concurrency: number // Default 3-5
  maxRetries: number // Default 2
}

/**
 * Default preferences
 */
export const DEFAULT_NEW_API_MODEL_SYNC_PREFERENCES: NewApiModelSyncPreferences =
  {
    enableSync: false,
    intervalMs: 24 * 60 * 60 * 1000, // 24 hours
    concurrency: 5,
    maxRetries: 2
  }

/**
 * Batch execution options
 */
export interface BatchExecutionOptions {
  concurrency: number
  maxRetries: number
  onProgress?: (payload: {
    completed: number
    total: number
    lastResult: ExecutionItemResult
  }) => void
}

/**
 * Current execution progress
 */
export interface ExecutionProgress {
  isRunning: boolean
  total: number
  completed: number
  failed: number
  lastResult?: ExecutionItemResult
  currentChannel?: string
}
