import { Storage } from "@plasmohq/storage"

import type {
  ExecutionResult,
  NewApiModelSyncPreferences
} from "~/types/newApiModelSync"
import { DEFAULT_NEW_API_MODEL_SYNC_PREFERENCES } from "~/types/newApiModelSync"

import { userPreferences } from "../userPreferences"

/**
 * Storage keys for New API Model Sync
 */
const STORAGE_KEYS = {
  LAST_EXECUTION: "newApiModelSync_lastExecution"
} as const

/**
 * Storage service for New API Model Sync
 */
class NewApiModelSyncStorage {
  private storage: Storage

  constructor() {
    this.storage = new Storage({
      area: "local"
    })
  }

  /**
   * Get sync preferences from userPreferences
   */
  async getPreferences(): Promise<NewApiModelSyncPreferences> {
    try {
      const prefs = await userPreferences.getPreferences()
      const config = prefs.newApiModelSync ?? {
        enabled: false,
        interval: 24 * 60 * 60 * 1000,
        concurrency: 5,
        maxRetries: 2
      }
      return {
        enableSync: config.enabled,
        intervalMs: config.interval,
        concurrency: config.concurrency,
        maxRetries: config.maxRetries
      }
    } catch (error) {
      console.error("[NewApiModelSync] Failed to get preferences:", error)
      return this.getDefaultPreferences()
    }
  }

  /**
   * Save sync preferences to userPreferences
   */
  async savePreferences(
    preferences: Partial<NewApiModelSyncPreferences>
  ): Promise<boolean> {
    try {
      const prefs = await userPreferences.getPreferences()
      const current = prefs.newApiModelSync ?? {
        enabled: false,
        interval: 24 * 60 * 60 * 1000,
        concurrency: 5,
        maxRetries: 2
      }

      const updated = {
        enabled:
          preferences.enableSync !== undefined
            ? preferences.enableSync
            : current.enabled,
        interval:
          preferences.intervalMs !== undefined
            ? preferences.intervalMs
            : current.interval,
        concurrency:
          preferences.concurrency !== undefined
            ? preferences.concurrency
            : current.concurrency,
        maxRetries:
          preferences.maxRetries !== undefined
            ? preferences.maxRetries
            : current.maxRetries
      }

      await userPreferences.savePreferences({ newApiModelSync: updated })
      console.log("[NewApiModelSync] Preferences saved:", updated)
      return true
    } catch (error) {
      console.error("[NewApiModelSync] Failed to save preferences:", error)
      return false
    }
  }

  /**
   * Get last execution result
   */
  async getLastExecution(): Promise<ExecutionResult | null> {
    try {
      const stored = (await this.storage.get(STORAGE_KEYS.LAST_EXECUTION)) as
        | ExecutionResult
        | undefined

      return stored || null
    } catch (error) {
      console.error("[NewApiModelSync] Failed to get last execution:", error)
      return null
    }
  }

  /**
   * Save execution result
   */
  async saveLastExecution(result: ExecutionResult): Promise<boolean> {
    try {
      await this.storage.set(STORAGE_KEYS.LAST_EXECUTION, result)
      console.log("[NewApiModelSync] Execution result saved")
      return true
    } catch (error) {
      console.error("[NewApiModelSync] Failed to save execution result:", error)
      return false
    }
  }

  /**
   * Clear last execution result
   */
  async clearLastExecution(): Promise<boolean> {
    try {
      await this.storage.remove(STORAGE_KEYS.LAST_EXECUTION)
      console.log("[NewApiModelSync] Last execution cleared")
      return true
    } catch (error) {
      console.error("[NewApiModelSync] Failed to clear last execution:", error)
      return false
    }
  }

  /**
   * Get default preferences
   */
  private getDefaultPreferences(): NewApiModelSyncPreferences {
    return { ...DEFAULT_NEW_API_MODEL_SYNC_PREFERENCES }
  }
}

// Create singleton instance
export const newApiModelSyncStorage = new NewApiModelSyncStorage()
