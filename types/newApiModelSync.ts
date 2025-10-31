/**
 * New API Model Sync Types
 * Types for New API model synchronization feature
 */

import { ApiResponse } from "~/types"

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

export interface NewApiChannelListData {
  items: NewApiChannel[]
  total: number
  type_counts: Record<string, number>
}

/**
 * Channel list response from New API
 */
export type NewApiChannelListResponse = ApiResponse<NewApiChannelListData>

/**
 * Single channel execution result
 */
export interface ExecutionItemResult {
  channelId: number
  channelName: string
  ok: boolean
  httpStatus?: number
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
  searchKeyword?: string
}

/**
 * New API Model Sync Preferences
 */
export interface NewApiModelSyncPreferences {
  enableSync: boolean
  intervalMs: number
  concurrency: number
  maxRetries: number
  rateLimit: {
    requestsPerMinute: number
    burst: number
  }
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
