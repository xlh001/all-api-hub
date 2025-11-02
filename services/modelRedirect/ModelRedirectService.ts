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

/**
 * Channel candidate for a standard model
 */
interface ModelCandidate {
  channelId: number
  channelName: string
  standardModel: string
  actualModel: string
  priority: number
  weight: number
  usedQuota: number
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
   */
  static generateChannelMappings(
    channels: NewApiChannel[],
    standardModels: string[],
    preferences?: ModelRedirectPreferences
  ): Record<number, string> {
    // Step 1: Gather all candidates for each standard model across all channels
    const allCandidates: ModelCandidate[] = []

    for (const standardModel of standardModels) {
      for (const channel of channels) {
        // Skip disabled channels
        if (
          channel.status === CHANNEL_STATUS.ManuallyDisabled ||
          channel.status === CHANNEL_STATUS.AutoDisabled
        ) {
          continue
        }

        const actualModels = channel.models
          ? channel.models.split(",").map((m) => m.trim()).filter(Boolean)
          : []

        // If channel already has the exact standard model, skip (no mapping needed)
        if (actualModels.includes(standardModel)) {
          continue
        }

        // Find best matching actual model in this channel
        const bestMatch = this.findBestMatch(standardModel, actualModels)
        if (bestMatch) {
          allCandidates.push({
            channelId: channel.id,
            channelName: channel.name,
            standardModel,
            actualModel: bestMatch,
            priority: channel.priority,
            weight: channel.weight,
            usedQuota: channel.used_quota || 0
          })
        }
      }
    }

    // Step 2: For each standard model, select the best candidate using weighted scoring
    const bestCandidates = new Map<string, ModelCandidate>()
    
    for (const standardModel of standardModels) {
      const candidates = allCandidates.filter(
        (c) => c.standardModel === standardModel
      )
      if (candidates.length > 0) {
        const best = this.selectBestCandidate(candidates, preferences)
        if (best) {
          bestCandidates.set(standardModel, best)
        }
      }
    }

    // Step 3: Group by channel and build model_mapping JSON for each channel
    const result: Record<number, string> = {}

    for (const [standardModel, candidate] of bestCandidates.entries()) {
      if (!result[candidate.channelId]) {
        result[candidate.channelId] = "{}"
      }

      const mapping = JSON.parse(result[candidate.channelId]) as Record<
        string,
        string
      >
      mapping[standardModel] = candidate.actualModel
      result[candidate.channelId] = JSON.stringify(mapping)
    }

    return result
  }

  /**
   * Find best matching model from actual models for a standard model
   * Based on gpt-api-sync's similarity matching logic
   */
  private static findBestMatch(
    standardModel: string,
    actualModels: string[]
  ): string | null {
    if (actualModels.length === 0) {
      return null
    }

    // Filter out potential downgrades (e.g., prevent gpt-4o -> gpt-4o-mini)
    const eligibleModels = actualModels.filter((model) => {
      const isPotentialDowngrade =
        model.startsWith(standardModel) &&
        model.length > standardModel.length &&
        (model.endsWith("-mini") ||
          model.endsWith("-nano") ||
          model.endsWith("-lite"))
      return !isPotentialDowngrade
    })

    if (eligibleModels.length === 0) {
      return null
    }

    // For short model names (length <= 3), use stricter matching
    if (standardModel.length <= 3) {
      // 1. Exact match
      for (const model of eligibleModels) {
        if (model === standardModel) {
          return model
        }
      }

      // 2. Prefix match (shortest)
      let bestPrefix: string | null = null
      let shortestLength = Infinity
      for (const model of eligibleModels) {
        if (
          model.startsWith(standardModel + "-") ||
          model.startsWith(standardModel + "_")
        ) {
          if (model.length < shortestLength) {
            shortestLength = model.length
            bestPrefix = model
          }
        }
      }
      if (bestPrefix) return bestPrefix

      // 3. Word boundary match
      let bestWordBoundary: string | null = null
      shortestLength = Infinity
      for (const model of eligibleModels) {
        if (this.isWordBoundaryMatch(standardModel, model)) {
          if (model.length < shortestLength) {
            shortestLength = model.length
            bestWordBoundary = model
          }
        }
      }
      if (bestWordBoundary) return bestWordBoundary
    } else {
      // For longer model names, use contains matching first
      let bestContains: string | null = null
      let shortestLength = Infinity
      for (const model of eligibleModels) {
        if (model.includes(standardModel)) {
          if (model.length < shortestLength) {
            shortestLength = model.length
            bestContains = model
          }
        }
      }
      if (bestContains) return bestContains
    }

    // Fallback: Levenshtein distance
    let bestMatch: string | null = null
    let minDistance = Infinity

    for (const model of eligibleModels) {
      // Validate short target/source matches
      if (model.length <= 3 && standardModel.length > model.length * 2) {
        if (!this.isValidShortTargetMatch(standardModel, model)) {
          continue
        }
      }
      if (standardModel.length <= 3 && model.length > standardModel.length * 3) {
        if (!this.isValidShortSourceMatch(standardModel, model)) {
          continue
        }
      }

      const distance = this.calculateLevenshteinDistance(standardModel, model)
      if (distance < minDistance) {
        minDistance = distance
        bestMatch = model
      }
    }

    // If distance is too large, reject the match
    if (bestMatch && minDistance > standardModel.length / 2) {
      return null
    }

    return bestMatch
  }

  /**
   * Select best candidate using weighted scoring
   */
  private static selectBestCandidate(
    candidates: ModelCandidate[],
    preferences?: ModelRedirectPreferences
  ): ModelCandidate | null {
    if (candidates.length === 0) return null
    if (candidates.length === 1) return candidates[0]

    const epsilonP = preferences?.scoring.epsilonP ?? 1
    const usedQuotaScale = preferences?.scoring.usedQuota.scale ?? 0.25
    const usedQuotaCap = preferences?.scoring.usedQuota.cap ?? 1.5

    const totalUsedQuota = candidates.reduce((sum, c) => sum + c.usedQuota, 0)

    const ranked = candidates.map((c) => ({
      ...c,
      weightLevel: this.toWeightLevel(c.weight),
      usedQuotaRatio: totalUsedQuota > 0 ? c.usedQuota / totalUsedQuota : 0,
      usedQuotaAdj:
        totalUsedQuota > 0
          ? Math.min(
              usedQuotaCap,
              c.usedQuota / totalUsedQuota / Math.max(usedQuotaScale, 1e-6)
            )
          : 0
    }))

    ranked.sort((a, b) => {
      // L1: Priority (with epsilon threshold)
      const priorityDiff = b.priority - a.priority
      if (Math.abs(priorityDiff) > epsilonP) {
        return priorityDiff
      }

      // L2: Weight level
      const weightDiff = b.weightLevel - a.weightLevel
      if (weightDiff !== 0) {
        return weightDiff
      }

      // L3: Used quota (lower is better)
      const quotaDiff = a.usedQuotaAdj - b.usedQuotaAdj
      if (Math.abs(quotaDiff) > 0.0001) {
        return quotaDiff
      }

      // Tie-breaker: lexicographic by actual model name
      return a.actualModel.localeCompare(b.actualModel)
    })

    return ranked[0]
  }

  private static toWeightLevel(weight: number): number {
    return Math.max(1, Math.min(5, Math.ceil(weight / 2)))
  }

  private static isWordBoundaryMatch(source: string, target: string): boolean {
    const lowerSource = source.toLowerCase()
    const lowerTarget = target.toLowerCase()

    let index = lowerTarget.indexOf(lowerSource)
    while (index !== -1) {
      const validStart =
        index === 0 || !this.isAlphaNum(lowerTarget.charAt(index - 1))
      const validEnd =
        index + lowerSource.length >= lowerTarget.length ||
        !this.isAlphaNum(lowerTarget.charAt(index + lowerSource.length))

      if (validStart && validEnd) return true
      index = lowerTarget.indexOf(lowerSource, index + 1)
    }
    return false
  }

  private static isAlphaNum(char: string): boolean {
    return /[a-z0-9]/i.test(char)
  }

  private static isValidShortTargetMatch(source: string, target: string): boolean {
    const lowerSource = source.toLowerCase()
    const lowerTarget = target.toLowerCase()

    if (this.isWordBoundaryMatch(target, source)) return true
    if (
      lowerSource.startsWith(lowerTarget + "-") ||
      lowerSource.startsWith(lowerTarget + "_")
    ) {
      return true
    }
    if (this.isVersionRelatedMatch(lowerSource, lowerTarget)) return true

    return false
  }

  private static isValidShortSourceMatch(source: string, target: string): boolean {
    const lowerSource = source.toLowerCase()
    const lowerTarget = target.toLowerCase()

    if (this.isWordBoundaryMatch(source, target)) return true
    if (
      lowerTarget.startsWith(lowerSource + "-") ||
      lowerTarget.startsWith(lowerSource + "_")
    ) {
      return true
    }
    if (this.isVersionRelatedMatch(target, source)) return true
    if (this.isReasonableAbbreviation(source, target)) return true

    return false
  }

  private static isVersionRelatedMatch(source: string, target: string): boolean {
    const sourceParts = source.split(/[-_.]/)
    const abbr: string[] = []

    for (const part of sourceParts) {
      if (part.length > 0) {
        const firstChar = part.charAt(0)
        if (this.isAlphaNum(firstChar)) {
          abbr.push(firstChar)
        }
        for (const char of part) {
          if (/\d/.test(char)) {
            abbr.push(char)
          }
        }
      }
    }

    const generated = abbr.join("").toLowerCase()
    return (
      generated === target ||
      generated.includes(target) ||
      target.includes(generated)
    )
  }

  private static isReasonableAbbreviation(source: string, target: string): boolean {
    const targetParts = target.split(/[-_.]/)
    const abbr: string[] = []

    for (const part of targetParts) {
      if (part.length > 0 && this.isAlphaNum(part.charAt(0))) {
        abbr.push(part.charAt(0))
      }
    }

    const generated = abbr.join("").toLowerCase()
    const lowerSource = source.toLowerCase()
    return generated.includes(lowerSource) || lowerSource.includes(generated)
  }

  private static calculateLevenshteinDistance(s1: string, s2: string): number {
    const lower1 = s1.toLowerCase()
    const lower2 = s2.toLowerCase()

    const shorter = lower1
    const longer = lower2

    if (longer.length < shorter.length) {
      return this.rawLevenshteinDistance(shorter, longer)
    }

    let minDistance = Infinity
    for (let i = 0; i <= longer.length - shorter.length; i++) {
      const sub = longer.substring(i, i + shorter.length)
      const distance = this.rawLevenshteinDistance(shorter, sub)
      if (distance < minDistance) {
        minDistance = distance
      }
      if (minDistance === 0) break
    }

    return minDistance
  }

  private static rawLevenshteinDistance(s1: string, s2: string): number {
    const costs = new Array(s2.length + 1)
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) {
          costs[j] = j
        } else if (j > 0) {
          let newValue = costs[j - 1]
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1
          }
          costs[j - 1] = lastValue
          lastValue = newValue
        }
      }
      if (i > 0) {
        costs[s2.length] = lastValue
      }
    }
    return costs[s2.length]
  }
}
