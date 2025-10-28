import {
  ExecutionProgress,
  ExecutionResult,
  NewApiChannel
} from "~/types/newApiModelSync"
import { getErrorMessage } from "~/utils/error"

import { userPreferences } from "../userPreferences"
import { NewApiModelSyncService } from "./NewApiModelSyncService"
import { newApiModelSyncStorage } from "./storage"

/**
 * Scheduler service for New API Model Sync
 * Handles periodic execution using chrome.alarms
 */
class NewApiModelSyncScheduler {
  private static readonly ALARM_NAME = "newApiModelSync"
  private isInitialized = false
  private currentProgress: ExecutionProgress | null = null

  private async createService(): Promise<NewApiModelSyncService> {
    const userPrefs = await userPreferences.getPreferences()
    const { newApiBaseUrl, newApiAdminToken, newApiUserId } = userPrefs

    if (!newApiBaseUrl || !newApiAdminToken) {
      throw new Error("New API configuration is missing")
    }

    return new NewApiModelSyncService(
      newApiBaseUrl,
      newApiAdminToken,
      newApiUserId
    )
  }

  /**
   * Initialize the scheduler
   */
  async initialize() {
    if (this.isInitialized) {
      console.log("[NewApiModelSync] Scheduler already initialized")
      return
    }

    try {
      // Set up alarm listener
      browser.alarms.onAlarm.addListener((alarm) => {
        if (alarm.name === NewApiModelSyncScheduler.ALARM_NAME) {
          this.executeSync().catch((error) => {
            console.error(
              "[NewApiModelSync] Scheduled execution failed:",
              error
            )
          })
        }
      })

      // Setup initial alarm based on preferences
      await this.setupAlarm()

      this.isInitialized = true
      console.log("[NewApiModelSync] Scheduler initialized")
    } catch (error) {
      console.error("[NewApiModelSync] Failed to initialize scheduler:", error)
    }
  }

  /**
   * Setup or update the alarm based on current preferences
   */
  async setupAlarm() {
    const prefs = await newApiModelSyncStorage.getPreferences()

    // Clear existing alarm
    await browser.alarms.clear(NewApiModelSyncScheduler.ALARM_NAME)

    if (!prefs.enableSync) {
      console.log("[NewApiModelSync] Auto-sync disabled, alarm cleared")
      return
    }

    // Create new alarm
    const intervalInMinutes = prefs.intervalMs / 1000 / 60
    await browser.alarms.create(NewApiModelSyncScheduler.ALARM_NAME, {
      periodInMinutes: intervalInMinutes
    })

    console.log(
      `[NewApiModelSync] Alarm set, interval: ${intervalInMinutes} minutes`
    )
  }

  async listChannels() {
    const service = await this.createService()
    return service.listChannels()
  }

  /**
   * Execute model sync for all channels
   */
  async executeSync(channelIds?: number[]): Promise<ExecutionResult> {
    console.log("[NewApiModelSync] Starting execution")

    // Initialize service
    const service = await this.createService()

    // Get preferences
    const prefs = await newApiModelSyncStorage.getPreferences()

    // List channels
    const newApiChannelListResponse = await service.listChannels()
    const allChannels = newApiChannelListResponse.items

    // Filter channels if specific IDs provided
    let channels: NewApiChannel[]
    if (channelIds && channelIds.length > 0) {
      channels = allChannels.filter((c) => channelIds.includes(c.id))
    } else {
      channels = allChannels
    }

    if (channels.length === 0) {
      throw new Error("No channels to sync")
    }

    // Update progress
    this.currentProgress = {
      isRunning: true,
      total: channels.length,
      completed: 0,
      failed: 0
    }

    let failureCount = 0

    // Execute batch sync
    const result = await service.runBatch(channels, {
      concurrency: prefs.concurrency,
      maxRetries: prefs.maxRetries,
      onProgress: (payload) => {
        if (!payload.lastResult.ok) {
          failureCount += 1
        }

        if (this.currentProgress) {
          this.currentProgress.completed = payload.completed
          this.currentProgress.lastResult = payload.lastResult
          this.currentProgress.currentChannel = payload.lastResult.channelName
          this.currentProgress.failed = failureCount
        }
        this.notifyProgress()
      }
    })

    // Save execution result
    await newApiModelSyncStorage.saveLastExecution(result)

    // Clear progress
    this.currentProgress = null
    this.notifyProgress()

    console.log(
      `[NewApiModelSync] Execution completed: ${result.statistics.successCount}/${result.statistics.total} succeeded`
    )

    return result
  }

  /**
   * Execute sync for failed channels only
   */
  async executeFailedOnly(): Promise<ExecutionResult> {
    const lastExecution = await newApiModelSyncStorage.getLastExecution()
    if (!lastExecution) {
      throw new Error("No previous execution found")
    }

    const failedChannelIds = lastExecution.items
      .filter((item) => !item.ok)
      .map((item) => item.channelId)

    if (failedChannelIds.length === 0) {
      throw new Error("No failed channels to retry")
    }

    return this.executeSync(failedChannelIds)
  }

  /**
   * Get current execution progress
   */
  getProgress(): ExecutionProgress | null {
    return this.currentProgress
  }

  /**
   * Update sync settings and reschedule alarm
   */
  async updateSettings(settings: {
    enableSync?: boolean
    intervalMs?: number
    concurrency?: number
    maxRetries?: number
  }) {
    await newApiModelSyncStorage.savePreferences(settings)
    await this.setupAlarm()
    console.log("[NewApiModelSync] Settings updated:", settings)
  }

  /**
   * Notify frontend about progress
   */
  private notifyProgress() {
    try {
      browser.runtime
        .sendMessage({
          type: "NEW_API_MODEL_SYNC_PROGRESS",
          payload: this.currentProgress
        })
        .catch(() => {
          // Silent: frontend might not be open
        })
    } catch {
      // Silent: frontend might not be open
    }
  }
}

// Create singleton instance
export const newApiModelSyncScheduler = new NewApiModelSyncScheduler()

/**
 * Message handler for New API Model Sync
 */
export const handleNewApiModelSyncMessage = async (
  request: any,
  sendResponse: (response: any) => void
) => {
  try {
    switch (request.action) {
      case "newApiModelSync:triggerAll":
        const resultAll = await newApiModelSyncScheduler.executeSync()
        sendResponse({ success: true, data: resultAll })
        break

      case "newApiModelSync:triggerSelected":
        const resultSelected = await newApiModelSyncScheduler.executeSync(
          request.channelIds
        )
        sendResponse({ success: true, data: resultSelected })
        break

      case "newApiModelSync:triggerFailedOnly":
        const resultFailed = await newApiModelSyncScheduler.executeFailedOnly()
        sendResponse({ success: true, data: resultFailed })
        break

      case "newApiModelSync:getLastExecution":
        const lastExecution = await newApiModelSyncStorage.getLastExecution()
        sendResponse({ success: true, data: lastExecution })
        break

      case "newApiModelSync:getProgress":
        const progress = newApiModelSyncScheduler.getProgress()
        sendResponse({ success: true, data: progress })
        break

      case "newApiModelSync:updateSettings":
        await newApiModelSyncScheduler.updateSettings(request.settings)
        sendResponse({ success: true })
        break

      case "newApiModelSync:getPreferences":
        const prefs = await newApiModelSyncStorage.getPreferences()
        sendResponse({ success: true, data: prefs })
        break

      case "newApiModelSync:listChannels":
        const channels = await newApiModelSyncScheduler.listChannels()
        sendResponse({ success: true, data: channels })
        break

      default:
        sendResponse({ success: false, error: "Unknown action" })
    }
  } catch (error) {
    console.error("[NewApiModelSync] Message handling failed:", error)
    sendResponse({ success: false, error: getErrorMessage(error) })
  }
}
