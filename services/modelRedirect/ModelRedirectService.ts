/**
 * Model Redirect Service
 * Generates model redirect mappings based on channel configurations
 * Based on gpt-api-sync logic with enhancements for weighted channel selection
 */

import {
  ALL_PRESET_STANDARD_MODELS,
  CHANNEL_STATUS,
  DEFAULT_MODEL_REDIRECT_PREFERENCES,
  type ModelRedirectPreferences,
  type NewApiChannel
} from "~/types"
import { userPreferences } from "../userPreferences"
import { hasValidNewApiConfig } from "../newApiService"
import { NewApiModelSyncService } from "../newApiModelSync/NewApiModelSyncService"
import {
  compareDateTokens,
  filterMatchingModels,
  parseDateToken
} from "~/utils/modelName"

/**
 * Channel candidate for model redirect
 */
interface ChannelCandidate {
  channelId: number
  channelName: string
  model: string
  priority: number
  weight: number
  usedQuota: number
  dateToken?: string
}

/**
 * Candidate with computed ranking metrics
 */
interface RankedCandidate extends ChannelCandidate {
  weightLevel: number
  usedQuotaRatio: number
  usedQuotaAdj: number
}

/**
 * Model Redirect Service
 * Core algorithm for generating model redirect mappings
 */
export class ModelRedirectService {
  /**
   * Run model redirect generation and apply mappings directly
   */
  static async applyModelRedirect(): Promise<{
    success: boolean
    updatedChannels: number
    errors: string[]
    message?: string
  }> {
    try {
      const prefs = await userPreferences.getPreferences()

      if (!hasValidNewApiConfig(prefs)) {
        return {
          success: false,
          updatedChannels: 0,
          errors: ["New API configuration is missing"],
          message: "New API configuration is missing"
        }
      }

      const modelRedirectPrefs = Object.assign(
        {},
        DEFAULT_MODEL_REDIRECT_PREFERENCES,
        prefs.modelRedirect
      )

      if (!modelRedirectPrefs.enabled) {
        return {
          success: false,
          updatedChannels: 0,
          errors: ["Model redirect feature is disabled"],
          message: "Model redirect feature is disabled"
        }
      }

      const standardModels = modelRedirectPrefs.standardModels.length
        ? modelRedirectPrefs.standardModels
        : ALL_PRESET_STANDARD_MODELS

      const service = new NewApiModelSyncService(
        prefs.newApiBaseUrl,
        prefs.newApiAdminToken,
        prefs.newApiUserId
      )

      const channelList = await service.listChannels()
      const mappings = ModelRedirectService.generateChannelMappings(
        channelList.items,
        standardModels,
        modelRedirectPrefs
      )

      let successCount = 0
      const errors: string[] = []

      for (const [channelIdStr, mapping] of Object.entries(mappings)) {
        try {
          await service.updateChannelModelMapping(Number(channelIdStr), mapping)
          successCount += 1
        } catch (error) {
          errors.push(
            `Channel ${channelIdStr}: ${(error as Error).message || "Unknown error"}`
          )
        }
      }

      return {
        success: errors.length === 0,
        updatedChannels: successCount,
        errors
      }
    } catch (error) {
      console.error("[ModelRedirect] Failed to apply redirect:", error)
      return {
        success: false,
        updatedChannels: 0,
        errors: [
          error instanceof Error ? error.message : "Failed to apply redirect"
        ]
      }
    }
  }

  /**
   * Generate model_mapping for each channel
   * Returns a map of channelId -> model_mapping JSON string
   *
   * @param channels All channels from New API
   * @param standardModels Standard model names to redirect
   * @param preferences Scoring preferences
   */
  static generateChannelMappings(
    channels: NewApiChannel[],
    standardModels: string[],
    preferences?: ModelRedirectPreferences
  ): Record<number, string> {
    const result: Record<number, string> = {}

    // Build global mapping: standardModel -> best candidate
    const globalMapping: Record<string, ChannelCandidate> = {}

    for (const standardModel of standardModels) {
      const candidates = this.gatherCandidates(standardModel, channels)
      if (candidates.length === 0) {
        continue
      }

      const winner = this.selectBestCandidate(candidates, preferences)
      if (winner) {
        globalMapping[standardModel] = winner
      }
    }

    // Group by channel and build model_mapping for each channel
    for (const [standardModel, candidate] of Object.entries(globalMapping)) {
      if (!result[candidate.channelId]) {
        result[candidate.channelId] = JSON.stringify({})
      }

      const mapping = JSON.parse(result[candidate.channelId]) as Record<
        string,
        string
      >
      mapping[standardModel] = candidate.model
      result[candidate.channelId] = JSON.stringify(mapping)
    }

    return result
  }

  /**
   * Gather candidate channels for a standard model
   */
  private static gatherCandidates(
    standardModel: string,
    channels: NewApiChannel[]
  ): ChannelCandidate[] {
    const candidates: ChannelCandidate[] = []

    for (const channel of channels) {
      // Skip disabled channels
      if (
        channel.status === CHANNEL_STATUS.ManuallyDisabled ||
        channel.status === CHANNEL_STATUS.AutoDisabled
      ) {
        continue
      }

      const models = channel.models ? channel.models.split(",").map((m) => m.trim()) : []
      const matchingModels = filterMatchingModels(standardModel, models)

      if (matchingModels.length === 0) {
        continue
      }

      for (const model of matchingModels) {
        const dateToken = parseDateToken(model)

        candidates.push({
          channelId: channel.id,
          channelName: channel.name,
          model,
          priority: channel.priority,
          weight: channel.weight,
          usedQuota: channel.used_quota || 0,
          dateToken
        })
      }
    }

    return candidates
  }

  /**
   * Select best candidate using weighted scoring
   * Priority: priority > weight > used_quota (inverse)
   */
  private static selectBestCandidate(
    candidates: ChannelCandidate[],
    preferences?: ModelRedirectPreferences
  ): ChannelCandidate | null {
    if (candidates.length === 0) {
      return null
    }

    const epsilonP = preferences?.scoring.epsilonP ?? 1
    const usedQuotaScale = preferences?.scoring.usedQuota.scale ?? 0.25
    const usedQuotaCap = preferences?.scoring.usedQuota.cap ?? 1.5

    const totalUsedQuota = candidates.reduce((sum, c) => sum + c.usedQuota, 0)

    const ranked: RankedCandidate[] = candidates.map((candidate) => {
      const weightLevel = this.toWeightLevel(candidate.weight)
      const ratio = totalUsedQuota > 0 ? candidate.usedQuota / totalUsedQuota : 0
      const usedQuotaAdj =
        totalUsedQuota > 0 ? Math.min(usedQuotaCap, ratio / Math.max(usedQuotaScale, 1e-6)) : 0

      return {
        ...candidate,
        weightLevel,
        usedQuotaRatio: ratio,
        usedQuotaAdj
      }
    })

    ranked.sort((a, b) => {
      const priorityDiff = b.priority - a.priority
      if (Math.abs(priorityDiff) > epsilonP) {
        return priorityDiff
      }

      const weightDiff = b.weightLevel - a.weightLevel
      if (weightDiff !== 0) {
        return weightDiff
      }

      const usedQuotaDiff = a.usedQuotaAdj - b.usedQuotaAdj
      if (Math.abs(usedQuotaDiff) > 0.0001) {
        return usedQuotaDiff
      }

      const dateCmp = compareDateTokens(b.dateToken, a.dateToken)
      if (dateCmp !== 0) {
        return dateCmp
      }

      return a.model.localeCompare(b.model)
    })

    return ranked[0]
  }

  private static toWeightLevel(weight: number): number {
    const level = Math.ceil(weight / 2)
    return Math.max(1, Math.min(5, level))
  }
}
