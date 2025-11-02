/**
 * Model Redirect Service
 * Generates model redirect mappings based on channel configurations
 * Based on gpt-api-sync logic with enhancements for weighted channel selection
 */

import {
  CHANNEL_STATUS,
  type ModelRedirectPreferences,
  type NewApiChannel
} from "~/types"
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
 * Weighted score for candidate selection
 */
interface WeightedCandidate extends ChannelCandidate {
  score: number
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
      const prefs = await import("../userPreferences").then((module) =>
        module.userPreferences.getPreferences()
      )

      const { hasValidNewApiConfig } = await import("../newApiService")
      if (!hasValidNewApiConfig(prefs)) {
        return {
          success: false,
          updatedChannels: 0,
          errors: ["New API configuration is missing"],
          message: "New API configuration is missing"
        }
      }

      const { ModelRedirectService } = await import("./ModelRedirectService")
      const { NewApiModelSyncService } = await import(
        "../newApiModelSync/NewApiModelSyncService"
      )
      const {
        DEFAULT_MODEL_REDIRECT_PREFERENCES,
        ALL_PRESET_STANDARD_MODELS
      } = await import("~/types")

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

    // Calculate scores
    const scored = candidates.map((c) => {
      const score = this.calculateScore(c, candidates, preferences)
      return { ...c, score } as WeightedCandidate
    })

    // Sort by score (descending), then by date (newer first), then lexicographic
    scored.sort((a, b) => {
      // Higher score is better
      if (Math.abs(b.score - a.score) > 0.001) {
        return b.score - a.score
      }

      // Tie-breaker: Newer date
      const dateCmp = compareDateTokens(b.dateToken, a.dateToken)
      if (dateCmp !== 0) {
        return dateCmp
      }

      // Final tie-breaker: Lexicographic by model name
      return a.model.localeCompare(b.model)
    })

    return scored[0]
  }

  /**
   * Calculate weighted score for a candidate
   * Formula: score = priority_weight + weight_weight - used_quota_penalty
   *
   * Importance: priority > weight > used_quota
   */
  private static calculateScore(
    candidate: ChannelCandidate,
    allCandidates: ChannelCandidate[],
    preferences?: ModelRedirectPreferences
  ): number {
    const epsilonP = preferences?.scoring.epsilonP ?? 1
    const usedQuotaScale = preferences?.scoring.usedQuota.scale ?? 0.25
    const usedQuotaCap = preferences?.scoring.usedQuota.cap ?? 1.5

    // Priority component (most important)
    // Normalize priority relative to max, with epsilon threshold
    const maxPriority = Math.max(...allCandidates.map((c) => c.priority))
    const priorityWeight = maxPriority > 0 ? (candidate.priority / maxPriority) * 100 : 0

    // Weight component (secondary)
    // Normalize weight (0-10 range typically)
    const maxWeight = Math.max(...allCandidates.map((c) => c.weight), 1)
    const weightWeight = (candidate.weight / maxWeight) * 10

    // Used quota penalty (tertiary, inverse)
    // Lower used_quota is better
    const totalUsedQuota = allCandidates.reduce((sum, c) => sum + c.usedQuota, 0)
    let usedQuotaPenalty = 0
    if (totalUsedQuota > 0) {
      const ratio = candidate.usedQuota / totalUsedQuota
      usedQuotaPenalty = Math.min(usedQuotaCap, ratio / usedQuotaScale)
    }

    return priorityWeight + weightWeight - usedQuotaPenalty
  }
}
