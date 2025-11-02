/**
 * Model Redirect Service
 * Generates and manages model redirect mappings based on channel configurations
 */

import {
  ALL_PRESET_STANDARD_MODELS,
  CHANNEL_STATUS,
  type ChannelCandidate,
  type GenerateMappingOptions,
  type ModelMappingEntry,
  type ModelRedirectPreferences,
  type NewApiChannel
} from "~/types"
import {
  compareDateTokens,
  filterMatchingModels,
  getCanonicalModelName,
  parseDateToken
} from "~/utils/modelName"

import { getMockChannels, getMockUsedQuota } from "./mockDataProvider"
import { NewApiModelSyncService } from "../newApiModelSync/NewApiModelSyncService"
import { getNewApiConfig } from "../newApiService"

type RankedCandidate = ChannelCandidate & {
  usedQuotaAdj: number
  usedQuotaRatio: number
}

/**
 * Model Redirect Service
 */
export class ModelRedirectService {
  private preferences: ModelRedirectPreferences

  constructor(preferences: ModelRedirectPreferences) {
    this.preferences = preferences
  }

  /**
   * Get channels data based on configuration
   */
  private async getChannelsData(): Promise<NewApiChannel[]> {
    if (this.preferences.dev.useMockData) {
      console.log("[ModelRedirect] Using mock data")
      return getMockChannels() as unknown as NewApiChannel[]
    }

    // Fetch from New API
    const config = await getNewApiConfig()
    if (!config) {
      throw new Error("New API configuration is not set")
    }

    const service = new NewApiModelSyncService(
      config.baseUrl,
      config.token,
      config.userId
    )

    const result = await service.listChannels()
    return result.items
  }

  /**
   * Get used quota for a channel
   */
  private async getUsedQuota(channelId: number): Promise<number> {
    if (this.preferences.dev.useMockData) {
      return getMockUsedQuota(channelId)
    }

    // In real implementation, this would fetch from New API
    // For now, return 0 as we don't have a direct API for this
    return 0
  }

  /**
   * Parse models string to array
   */
  private parseModels(modelsString: string): string[] {
    return modelsString
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean)
  }

  /**
   * Convert weight to discrete level 1-5
   */
  private toWeightLevel(weight: number): 1 | 2 | 3 | 4 | 5 {
    const level = Math.ceil(weight / 2)
    return Math.max(1, Math.min(5, level)) as 1 | 2 | 3 | 4 | 5
  }

  /**
   * Gather candidates for a standard model
   */
  private async gatherCandidates(
    standardModel: string,
    channels: NewApiChannel[]
  ): Promise<ChannelCandidate[]> {
    const candidates: ChannelCandidate[] = []

    for (const channel of channels) {
      // Skip disabled channels
      if (
        channel.status === CHANNEL_STATUS.ManuallyDisabled ||
        channel.status === CHANNEL_STATUS.AutoDisabled
      ) {
        continue
      }

      const models = this.parseModels(channel.models)
      const matchingModels = filterMatchingModels(standardModel, models)

      if (matchingModels.length === 0) {
        continue
      }

      const usedQuota = await this.getUsedQuota(channel.id)
      const weightLevel = this.toWeightLevel(channel.weight)

      for (const model of matchingModels) {
        const dateToken = parseDateToken(model)

        candidates.push({
          channelId: channel.id,
          channelName: channel.name,
          model,
          priority: channel.priority,
          weight: channel.weight,
          weightLevel,
          usedQuota,
          status: channel.status,
          dateToken
        })
      }
    }

    return candidates
  }

  /**
   * Calculate used quota adjustment
   */
  private calculateUsedQuotaAdj(
    usedQuota: number,
    enabledCandidates: ChannelCandidate[]
  ): number {
    const totalUsedQuota = enabledCandidates.reduce(
      (sum, c) => sum + c.usedQuota,
      0
    )

    if (totalUsedQuota === 0) {
      return 0
    }

    const ratio = usedQuota / totalUsedQuota
    const { scale, cap } = this.preferences.scoring.usedQuota

    return Math.min(cap, ratio / scale)
  }

  /**
   * Rank candidates using layered approach
   * L1: Priority (with epsilon threshold)
   * L2: Weight level (discrete 1-5)
   * L3: Used quota adjustment (light penalty)
   * Ties: Newer date > lexicographic
   */
  private rankCandidates(candidates: ChannelCandidate[]): RankedCandidate[] {
    if (candidates.length === 0) {
      return []
    }

    const totalUsedQuota = candidates.reduce((sum, c) => sum + c.usedQuota, 0)
    const { scale, cap } = this.preferences.scoring.usedQuota
    const safeScale = scale > 0 ? scale : 1

    // Calculate used quota adjustments
    const candidatesWithAdj: RankedCandidate[] = candidates.map((c) => {
      const ratio = totalUsedQuota > 0 ? c.usedQuota / totalUsedQuota : 0
      const usedQuotaAdj =
        totalUsedQuota > 0 ? Math.min(cap, ratio / safeScale) : 0

      return {
        ...c,
        usedQuotaRatio: ratio,
        usedQuotaAdj
      }
    })

    // Sort using layered ranking
    const sorted = candidatesWithAdj.sort((a, b) => {
      const epsilonP = this.preferences.scoring.epsilonP

      // L1: Priority (near-equal threshold)
      const priorityDiff = b.priority - a.priority
      if (Math.abs(priorityDiff) > epsilonP) {
        return priorityDiff
      }

      // L2: Weight level (discrete, non-overriding)
      const weightDiff = b.weightLevel - a.weightLevel
      if (weightDiff !== 0) {
        return weightDiff
      }

      // L3: Used quota (lower is better)
      const usedQuotaDiff = a.usedQuotaAdj - b.usedQuotaAdj
      if (Math.abs(usedQuotaDiff) > 0.001) {
        return usedQuotaDiff
      }

      // Tie-breaker: Newer date
      const dateCmp = compareDateTokens(b.dateToken, a.dateToken)
      if (dateCmp !== 0) {
        return dateCmp
      }

      // Final tie-breaker: Lexicographic by model name
      return a.model.localeCompare(b.model)
    })

    return sorted
  }

  /**
   * Build decision reason string
   */
  private buildReason(candidate: ChannelCandidate, rank: number): string {
    const parts = [
      `Rank ${rank}`,
      `P:${candidate.priority}`,
      `W:${candidate.weight}`,
      `UQ:${candidate.usedQuota}`
    ]

    if (candidate.dateToken) {
      parts.push(`Date:${candidate.dateToken}`)
    }

    return parts.join(" | ")
  }

  /**
   * Generate model mapping grouped by channel
   * Returns a map of channelId -> array of model mappings for that channel
   */
  async generateModelMapping(
    options: GenerateMappingOptions
  ): Promise<Record<number, ModelMappingEntry[]>> {
    console.log("[ModelRedirect] Generating mapping with trigger:", options.trigger)

    const channels = await this.getChannelsData()
    console.log(`[ModelRedirect] Found ${channels.length} channels`)

    const mapping: Record<number, ModelMappingEntry[]> = {}

    for (const standardModel of this.preferences.standardModels) {
      const candidates = await this.gatherCandidates(standardModel, channels)
      console.log(
        `[ModelRedirect] ${standardModel}: ${candidates.length} candidates`
      )

      if (candidates.length === 0) {
        continue
      }

      const ranked = this.rankCandidates(candidates)
      const winner = ranked[0]

      const entry: ModelMappingEntry = {
        standardModel,
        targetModel: winner.model,
        channelId: winner.channelId,
        priority: winner.priority,
        weightLevel: winner.weightLevel,
        usedQuotaRatio: winner.usedQuotaRatio,
        usedQuotaAdj: winner.usedQuotaAdj,
        reason: this.buildReason(winner, 1),
        decidedAt: new Date().toISOString()
      }

      if (!mapping[winner.channelId]) {
        mapping[winner.channelId] = []
      }
      mapping[winner.channelId].push(entry)
    }

    console.log(
      `[ModelRedirect] Generated mapping for ${Object.keys(mapping).length} channels`
    )

    return mapping
  }

  /**
   * Get standard model suggestions
   * Returns all preset models + any currently configured
   */
  getStandardModelSuggestions(): string[] {
    const suggestions = new Set([
      ...ALL_PRESET_STANDARD_MODELS,
      ...this.preferences.standardModels
    ])
    return Array.from(suggestions).sort()
  }
}

/**
 * Create a model redirect service instance
 */
export function createModelRedirectService(
  preferences: ModelRedirectPreferences
): ModelRedirectService {
  return new ModelRedirectService(preferences)
}
