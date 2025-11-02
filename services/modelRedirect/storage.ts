/**
 * Model Redirect Storage Service
 * Manages persistence of model redirect configuration and mappings
 */

import { Storage } from "@plasmohq/storage"

import {
  DEFAULT_MODEL_REDIRECT_PREFERENCES,
  type ModelMapping,
  type ModelRedirectPreferences
} from "~/types"

import { userPreferences } from "../userPreferences"

/**
 * Storage keys for Model Redirect
 */
const STORAGE_KEYS = {
  MODEL_MAPPING: "modelRedirect_mapping"
} as const

/**
 * Storage service for Model Redirect
 */
class ModelRedirectStorage {
  private storage: Storage

  constructor() {
    this.storage = new Storage({
      area: "local"
    })
  }

  /**
   * Get model redirect preferences from userPreferences
   */
  async getPreferences(): Promise<ModelRedirectPreferences> {
    try {
      const prefs = await userPreferences.getPreferences()
      const config =
        prefs.modelRedirect ?? DEFAULT_MODEL_REDIRECT_PREFERENCES
      return config
    } catch (error) {
      console.error("[ModelRedirect] Failed to get preferences:", error)
      return DEFAULT_MODEL_REDIRECT_PREFERENCES
    }
  }

  /**
   * Save model redirect preferences to userPreferences
   */
  async savePreferences(
    preferences: Partial<ModelRedirectPreferences>
  ): Promise<boolean> {
    try {
      const prefs = await userPreferences.getPreferences()
      const current = prefs.modelRedirect ?? DEFAULT_MODEL_REDIRECT_PREFERENCES

      const updated: ModelRedirectPreferences = {
        enabled: preferences.enabled ?? current.enabled,
        standardModels: preferences.standardModels ?? current.standardModels,
        autoGenerateMapping:
          preferences.autoGenerateMapping ?? current.autoGenerateMapping,
        scoring: preferences.scoring
          ? {
              ...current.scoring,
              ...preferences.scoring,
              usedQuota: preferences.scoring.usedQuota
                ? {
                    ...current.scoring.usedQuota,
                    ...preferences.scoring.usedQuota
                  }
                : current.scoring.usedQuota
            }
          : current.scoring,
        dev: preferences.dev
          ? { ...current.dev, ...preferences.dev }
          : current.dev,
        version: preferences.version ?? current.version
      }

      await userPreferences.savePreferences({ modelRedirect: updated })
      console.log("[ModelRedirect] Preferences saved:", updated)
      return true
    } catch (error) {
      console.error("[ModelRedirect] Failed to save preferences:", error)
      return false
    }
  }

  /**
   * Get model mapping
   */
  async getMapping(): Promise<ModelMapping | null> {
    try {
      const stored = (await this.storage.get(
        STORAGE_KEYS.MODEL_MAPPING
      )) as ModelMapping | undefined

      return stored || null
    } catch (error) {
      console.error("[ModelRedirect] Failed to get mapping:", error)
      return null
    }
  }

  /**
   * Save model mapping
   */
  async saveMapping(mapping: ModelMapping): Promise<boolean> {
    try {
      await this.storage.set(STORAGE_KEYS.MODEL_MAPPING, mapping)
      console.log("[ModelRedirect] Mapping saved")
      return true
    } catch (error) {
      console.error("[ModelRedirect] Failed to save mapping:", error)
      return false
    }
  }

  /**
   * Clear model mapping
   */
  async clearMapping(): Promise<boolean> {
    try {
      await this.storage.remove(STORAGE_KEYS.MODEL_MAPPING)
      console.log("[ModelRedirect] Mapping cleared")
      return true
    } catch (error) {
      console.error("[ModelRedirect] Failed to clear mapping:", error)
      return false
    }
  }
}

// Create singleton instance
export const modelRedirectStorage = new ModelRedirectStorage()
