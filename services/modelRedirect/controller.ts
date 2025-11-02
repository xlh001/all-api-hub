/**
 * Model Redirect Controller
 * Coordinates background interactions, including regeneration scheduling
 */

import merge from "lodash-es/merge"

import {
  ALL_PRESET_STANDARD_MODELS,
  DEFAULT_MODEL_REDIRECT_PREFERENCES,
  type MappingGenerationTrigger,
  type ModelMappingEntry,
  type ModelRedirectPreferences
} from "~/types"
import { getErrorMessage } from "~/utils/error"

import { createModelRedirectService } from "./ModelRedirectService"
import { userPreferences } from "../userPreferences"

const AUTO_REGENERATE_DELAY_MS = 2000

function triggerPriority(trigger: MappingGenerationTrigger): number {
  switch (trigger) {
    case "manual":
      return 3
    case "sync":
      return 2
    case "mock":
      return 1
    default:
      return 0
  }
}

class ModelRedirectController {
  private isGenerating = false
  private queuedTrigger: MappingGenerationTrigger | null = null
  private debounceTimer: ReturnType<typeof setTimeout> | null = null

  async regenerate(
    trigger: MappingGenerationTrigger
  ): Promise<{ success: boolean; data?: Record<number, ModelMappingEntry[]>; error?: string }> {
    if (this.isGenerating) {
      this.queueTrigger(trigger)
      return {
        success: false,
        error: "Model redirect generation already in progress, request queued"
      }
    }

    const preferences = await this.getPreferences()
    if (!preferences.enabled) {
      return {
        success: false,
        error: "Model redirect feature is disabled"
      }
    }

    const effectivePrefs = this.buildEffectivePreferences(preferences)

    if (effectivePrefs.standardModels.length === 0) {
      return {
        success: false,
        error: "No standard models configured for mapping"
      }
    }

    this.isGenerating = true

    try {
      const service = createModelRedirectService(effectivePrefs)
      const mapping = await service.generateModelMapping({ trigger })

      // Apply mappings to channels
      const applyResult = await this.applyMappingsToChannels(mapping)

      if (!applyResult.success) {
        const errorMessage = `Failed to update some channels: ${applyResult.errors.join("; ")}`
        await this.emitEvent("MODEL_REDIRECT_MAPPING_FAILED", {
          trigger,
          error: errorMessage,
          updatedChannels: applyResult.updatedChannels
        })

        return {
          success: false,
          error: errorMessage,
          data: mapping
        }
      }

      await this.emitEvent("MODEL_REDIRECT_MAPPING_UPDATED", {
        trigger,
        mapping,
        updatedChannels: applyResult.updatedChannels
      })

      return {
        success: true,
        data: mapping
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      console.error("[ModelRedirect] Generation failed:", error)

      await this.emitEvent("MODEL_REDIRECT_MAPPING_FAILED", {
        trigger,
        error: errorMessage
      })

      return {
        success: false,
        error: errorMessage
      }
    } finally {
      this.isGenerating = false
      const queued = this.queuedTrigger
      this.queuedTrigger = null

      if (queued) {
        setTimeout(() => {
          this.regenerate(queued).catch((queuedError) => {
            console.error(
              "[ModelRedirect] Queued regeneration failed:",
              queuedError
            )
          })
        }, 0)
      }
    }
  }

  async autoRegenerateIfEnabled(trigger: MappingGenerationTrigger): Promise<boolean> {
    const preferences = await this.getPreferences()
    if (!preferences.enabled) {
      return false
    }

    this.scheduleAutoRegenerate(trigger)
    return true
  }

  scheduleAutoRegenerate(trigger: MappingGenerationTrigger) {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }

    this.debounceTimer = setTimeout(() => {
      this.debounceTimer = null
      this.regenerate(trigger).catch((error) => {
        console.error("[ModelRedirect] Auto regeneration failed:", error)
      })
    }, AUTO_REGENERATE_DELAY_MS)
  }

  /**
   * Apply model mappings to channels
   * Returns the mapping result for verification
   */
  async applyMappingsToChannels(
    channelMappings: Record<number, ModelMappingEntry[]>
  ): Promise<{ success: boolean; updatedChannels: number[]; errors: string[] }> {
    const updatedChannels: number[] = []
    const errors: string[] = []

    for (const [channelIdStr, mappings] of Object.entries(channelMappings)) {
      const channelId = Number(channelIdStr)
      try {
        // Convert mappings to New API model_mapping format
        const modelMappingObj: Record<string, string> = {}
        for (const entry of mappings) {
          modelMappingObj[entry.standardModel] = entry.targetModel
        }
        const modelMappingJson = JSON.stringify(modelMappingObj)

        // Update channel via New API service
        const { getNewApiConfig, updateChannel } = await import("../newApiService")
        const config = await getNewApiConfig()
        if (!config) {
          errors.push(`Channel ${channelId}: New API config not set`)
          continue
        }

        await updateChannel(config.baseUrl, config.token, config.userId, {
          id: channelId,
          model_mapping: modelMappingJson
        })

        updatedChannels.push(channelId)
        console.log(`[ModelRedirect] Updated channel ${channelId} with ${mappings.length} mappings`)
      } catch (error) {
        const errorMsg = getErrorMessage(error)
        errors.push(`Channel ${channelId}: ${errorMsg}`)
        console.error(`[ModelRedirect] Failed to update channel ${channelId}:`, error)
      }
    }

    return {
      success: errors.length === 0,
      updatedChannels,
      errors
    }
  }

  async getPreferences(): Promise<ModelRedirectPreferences> {
    const prefs = await userPreferences.getPreferences()
    return merge({}, DEFAULT_MODEL_REDIRECT_PREFERENCES, prefs.modelRedirect)
  }

  async updatePreferences(
    updates: Partial<ModelRedirectPreferences>
  ): Promise<boolean> {
    return userPreferences.savePreferences({ modelRedirect: updates })
  }

  async getSuggestions(): Promise<string[]> {
    const prefs = await this.getPreferences()
    const service = createModelRedirectService(prefs)
    return service.getStandardModelSuggestions()
  }

  private buildEffectivePreferences(
    prefs: ModelRedirectPreferences
  ): ModelRedirectPreferences {
    const standardModels =
      prefs.standardModels.length > 0
        ? Array.from(
            new Set(prefs.standardModels.map((model) => model.trim()).filter(Boolean))
          )
        : [...ALL_PRESET_STANDARD_MODELS]

    return merge({}, prefs, { standardModels })
  }

  private queueTrigger(trigger: MappingGenerationTrigger) {
    if (!this.queuedTrigger) {
      this.queuedTrigger = trigger
      return
    }

    const currentPriority = triggerPriority(this.queuedTrigger)
    const incomingPriority = triggerPriority(trigger)

    if (incomingPriority > currentPriority) {
      this.queuedTrigger = trigger
    }
  }

  private async emitEvent(eventType: string, payload: unknown) {
    try {
      await browser.runtime.sendMessage({
        type: eventType,
        payload
      })
    } catch {
      // Silent failure - frontend listeners might not be available
    }
  }
}

export const modelRedirectController = new ModelRedirectController()
