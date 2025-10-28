import { Storage } from "@plasmohq/storage"

import type {
  ExecutionResult,
  NewApiModelSyncPreferences
} from "~/types/newApiModelSync"
import { DEFAULT_NEW_API_MODEL_SYNC_PREFERENCES } from "~/types/newApiModelSync"

/**
 * Storage keys for New API Model Sync
 */
const STORAGE_KEYS = {
  PREFERENCES: "newApiModelSync_preferences",
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
   * Get sync preferences
   */
  async getPreferences(): Promise<NewApiModelSyncPreferences> {
    try {
      const stored = (await this.storage.get(STORAGE_KEYS.PREFERENCES)) as
        | Partial<NewApiModelSyncPreferences>
        | undefined

      if (!stored) {
        return this.getDefaultPreferences()
      }

      return {
        ...this.getDefaultPreferences(),
        ...stored
      }
    } catch (error) {
      console.error("[NewApiModelSync] Failed to get preferences:", error)
      return this.getDefaultPreferences()
    }
  }

  /**
   * Save sync preferences
   */
  async savePreferences(
    preferences: Partial<NewApiModelSyncPreferences>
  ): Promise<boolean> {
    try {
      const current = await this.getPreferences()
      const updated = {
        ...current,
        ...preferences
      }
      await this.storage.set(STORAGE_KEYS.PREFERENCES, updated)
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
