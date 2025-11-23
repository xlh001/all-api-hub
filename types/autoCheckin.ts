/**
 * Auto Check-in Types
 * Types for automatic daily check-in feature
 */

/**
 * Check-in result status
 */
export type CheckinResultStatus =
  | "success"
  | "already_checked"
  | "failed"
  | "skipped"

/**
 * Reasons why an account was skipped during auto check-in
 */
export type AutoCheckinSkipReason =
  | "detection_disabled"
  | "auto_checkin_disabled"
  | "already_checked_today"
  | "no_provider"
  | "provider_not_ready"

/**
 * Single account check-in result
 */
export interface CheckinAccountResult {
  accountId: string
  accountName: string
  status: CheckinResultStatus
  message: string
  reasonCode?: AutoCheckinSkipReason
  timestamp: number
}

/**
 * Overall auto check-in execution result
 */
export type AutoCheckinRunResult = "success" | "partial" | "failed"

/**
 * Auto check-in run summary
 */
export interface AutoCheckinRunSummary {
  totalEligible: number
  executed: number
  successCount: number
  failedCount: number
  skippedCount: number
  needsRetry: boolean
}

/**
 * Auto check-in attempts tracker
 */
export interface AutoCheckinAttemptsTracker {
  date: string // YYYY-MM-DD
  attempts: number
}

/**
 * Auto check-in account snapshot
 */
export interface AutoCheckinAccountSnapshot {
  accountId: string
  accountName: string
  siteType: string
  detectionEnabled: boolean
  autoCheckinEnabled: boolean
  providerAvailable: boolean
  isCheckedInToday?: boolean
  lastCheckInDate?: string
  skipReason?: AutoCheckinSkipReason
  lastResult?: CheckinAccountResult
}

/**
 * Auto check-in status stored in local storage
 */
export interface AutoCheckinStatus {
  lastRunAt?: string // ISO timestamp
  lastRunResult?: AutoCheckinRunResult
  perAccount?: Record<string, CheckinAccountResult>
  nextScheduledAt?: string // ISO timestamp
  summary?: AutoCheckinRunSummary
  attempts?: AutoCheckinAttemptsTracker
  pendingRetry?: boolean
  accountsSnapshot?: AutoCheckinAccountSnapshot[]
}

/**
 * Auto check-in preferences (stored in UserPreferences)
 */
export type AutoCheckinScheduleMode = "random" | "deterministic"

export interface AutoCheckinRetryStrategy {
  enabled: boolean
  intervalMinutes: number
  maxAttemptsPerDay: number
}

export interface AutoCheckinPreferences {
  globalEnabled: boolean
  windowStart: string // HH:mm format (e.g., "09:00")
  windowEnd: string // HH:mm format (e.g., "18:00")
  scheduleMode: AutoCheckinScheduleMode
  deterministicTime?: string // HH:mm format for deterministic mode
  retryStrategy: AutoCheckinRetryStrategy
}
