/**
 * Model Name Utilities
 * Handles model name normalization, aliasing, and comparison
 */

import type { ModelAliases } from "~/types/modelRedirect"

/**
 * Normalize a model name by removing separators and lowercasing
 */
export function normalizeModelName(name: string): string {
  return name.toLowerCase().replace(/[-_:]/g, "")
}

/**
 * Strip vendor prefixes from model names
 * Common prefixes: openai/, anthropic/, google/, meta/, mistral/, deepseek/, qwen/
 */
export function stripVendorPrefix(name: string): string {
  const prefixes = [
    "openai/",
    "anthropic/",
    "google/",
    "meta/",
    "mistral/",
    "deepseek/",
    "qwen/",
    "meta-llama/"
  ]

  let stripped = name
  for (const prefix of prefixes) {
    if (stripped.toLowerCase().startsWith(prefix.toLowerCase())) {
      stripped = stripped.slice(prefix.length)
      break
    }
  }

  return stripped
}

/**
 * Model aliases by vendor
 */
export const MODEL_ALIASES: ModelAliases = {
  // OpenAI
  "gpt-4o": ["gpt4o", "gpt-4-o", "chatgpt-4o"],
  "gpt-4o-mini": ["gpt4omini", "gpt-4-o-mini", "gpt-4o-mini-2024-07-18"],
  "o4-mini": ["o4mini"],
  o3: ["o-3"],
  "gpt-4-turbo": ["gpt4turbo", "gpt-4-turbo-preview"],
  "gpt-3.5-turbo": ["gpt35turbo", "gpt-35-turbo"],

  // Anthropic
  "claude-3-7-sonnet": [
    "claude37sonnet",
    "claude-3.7-sonnet",
    "claude-3-sonnet-20250219"
  ],
  "claude-3-5-sonnet": [
    "claude35sonnet",
    "claude-3.5-sonnet",
    "claude-3-5-sonnet-20241022",
    "claude-3-5-sonnet-20240620"
  ],
  "claude-3-5-haiku": [
    "claude35haiku",
    "claude-3.5-haiku",
    "claude-3-5-haiku-20241022"
  ],

  // Google
  "gemini-1.5-pro": [
    "gemini15pro",
    "gemini-1.5-pro-latest",
    "gemini-1.5-pro-002"
  ],
  "gemini-1.5-flash": [
    "gemini15flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash-002"
  ],
  "gemini-2.0-flash": ["gemini20flash", "gemini-2.0-flash-exp"],

  // Meta
  "llama-3.1-8b": ["llama318b", "llama-3.1-8b-instruct", "meta-llama-3.1-8b"],
  "llama-3.1-70b": [
    "llama3170b",
    "llama-3.1-70b-instruct",
    "meta-llama-3.1-70b"
  ],
  "llama-3.3-70b": ["llama3370b", "llama-3.3-70b-instruct"],

  // Mistral
  "mistral-large": ["mistrallarge", "mistral-large-latest"],
  "mistral-small": ["mistralsmall", "mistral-small-latest"],

  // DeepSeek
  "deepseek-chat": ["deepseekchat"],
  "deepseek-r1": ["deepseekr1"],

  // Qwen
  "qwen2.5-7b": ["qwen257b", "qwen2.5-7b-instruct"],
  "qwen2.5-72b": ["qwen2572b", "qwen2.5-72b-instruct"]
}

/**
 * Get canonical model name from an alias
 */
export function getCanonicalModelName(name: string): string {
  const normalized = normalizeModelName(stripVendorPrefix(name))

  for (const [canonical, aliases] of Object.entries(MODEL_ALIASES)) {
    const normalizedCanonical = normalizeModelName(canonical)
    if (normalized === normalizedCanonical) {
      return canonical
    }

    for (const alias of aliases) {
      if (normalized === normalizeModelName(alias)) {
        return canonical
      }
    }
  }

  // Return the stripped name if no canonical found
  return stripVendorPrefix(name)
}

/**
 * Remove date suffixes from model names
 * Supports various date formats:
 * - yyyymmdd: -20240101, -20250722, _20240101
 * - yyyy-mm-dd: -2024-01-01, -2025-07-22
 * - yyyymm: -202401, -202507
 * - mm-yyyy: -01-2024, -07-2025
 * - mmdd: -0101, -0722
 */
export function removeDateSuffix(modelName: string): string {
  let result = modelName

  const patterns = [
    // yyyy-mm-dd or yyyy_mm_dd
    /[-_](?:19|20)\d{2}[-_]\d{2}[-_]\d{2}$/i,
    // mm-yyyy or mm_yyyy
    /[-_]\d{2}[-_](?:19|20)\d{2}$/i,
    // yyyyMMdd or yyyyMM (with separator)
    /[-_](?:19|20)\d{6}$/i,
    /[-_](?:19|20)\d{4}$/i,
    // mmdd
    /[-_]\d{4}$/i
  ]

  let prev = ""
  while (prev !== result) {
    prev = result
    for (const pattern of patterns) {
      if (pattern.test(result)) {
        result = result.replace(pattern, "")
        break
      }
    }
  }

  return result
}

/**
 * Parse date token from model name
 * Supports formats: yyyymmdd (20240101) or yyyymm (202401)
 */
export function parseDateToken(modelName: string): string | undefined {
  // Match 8-digit date (yyyymmdd)
  const dateMatch = modelName.match(/(\d{8})/)
  if (dateMatch) {
    return dateMatch[1]
  }

  // Match 6-digit date (yyyymm)
  const monthMatch = modelName.match(/(\d{6})/)
  if (monthMatch) {
    return monthMatch[1]
  }

  return undefined
}

/**
 * Compare two date tokens
 * Returns:
 * - positive if date1 > date2 (date1 is newer)
 * - negative if date1 < date2 (date2 is newer)
 * - 0 if equal
 */
export function compareDateTokens(
  date1: string | undefined,
  date2: string | undefined
): number {
  if (!date1 && !date2) return 0
  if (!date1) return -1
  if (!date2) return 1

  return date1.localeCompare(date2)
}

/**
 * Compare versions from model names
 * e.g., "claude-3.5-sonnet" vs "claude-3.7-sonnet"
 */
export function compareVersions(name1: string, name2: string): number {
  const versionRegex = /(\d+)\.(\d+)/g
  const versions1 = [...name1.matchAll(versionRegex)]
  const versions2 = [...name2.matchAll(versionRegex)]

  for (let i = 0; i < Math.max(versions1.length, versions2.length); i++) {
    const v1 = versions1[i]
    const v2 = versions2[i]

    if (!v1 && v2) return -1
    if (v1 && !v2) return 1
    if (!v1 && !v2) return 0

    const major1 = parseInt(v1[1], 10)
    const major2 = parseInt(v2[1], 10)

    if (major1 !== major2) {
      return major1 - major2
    }

    const minor1 = parseInt(v1[2], 10)
    const minor2 = parseInt(v2[2], 10)

    if (minor1 !== minor2) {
      return minor1 - minor2
    }
  }

  return 0
}

/**
 * Match a standard model to channel models
 * Returns true if any channel model matches (canonical or alias)
 */
export function matchesStandardModel(
  standardModel: string,
  channelModel: string
): boolean {
  const normalizedStandard = normalizeModelName(standardModel)
  const normalizedChannel = normalizeModelName(stripVendorPrefix(channelModel))

  // Direct match
  if (normalizedStandard === normalizedChannel) {
    return true
  }

  // Check if channelModel is an alias of standardModel
  const canonical = getCanonicalModelName(channelModel)
  if (normalizeModelName(canonical) === normalizedStandard) {
    return true
  }

  // Check if standardModel has aliases that match channelModel
  const aliases = MODEL_ALIASES[standardModel] || []
  for (const alias of aliases) {
    if (normalizeModelName(alias) === normalizedChannel) {
      return true
    }
  }

  return false
}

/**
 * Filter channels by standard model
 * Returns models from the channel that match the standard model
 */
export function filterMatchingModels(
  standardModel: string,
  channelModels: string[]
): string[] {
  return channelModels.filter((channelModel) =>
    matchesStandardModel(standardModel, channelModel)
  )
}
