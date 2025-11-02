/**
 * Model Redirect Configuration and Types
 */

/**
 * Used quota adjustment mode
 */
export type UsedQuotaMode = "ratio"

/**
 * Used quota scoring configuration
 */
export interface UsedQuotaScoring {
  mode: UsedQuotaMode
  scale: number // Divisor for ratio calculation (default: 0.25)
  cap: number // Maximum adjustment value (default: 1.5)
}

/**
 * Scoring configuration for model redirect
 */
export interface ModelRedirectScoring {
  epsilonP: number // Near-equal threshold for priority (default: 1)
  usedQuota: UsedQuotaScoring
}

/**
 * Model redirect preferences
 */
export interface ModelRedirectPreferences {
  enabled: boolean
  standardModels: string[]
  scoring: ModelRedirectScoring
  version: number
}

/**
 * Default scoring configuration
 */
export const DEFAULT_MODEL_REDIRECT_SCORING: ModelRedirectScoring = {
  epsilonP: 1,
  usedQuota: {
    mode: "ratio",
    scale: 0.25,
    cap: 1.5
  }
}

/**
 * Preset standard models by vendor
 */
export const PRESET_STANDARD_MODELS = {
  OpenAI: ["gpt-4o", "gpt-4o-mini", "o4-mini", "o3"],
  Anthropic: ["claude-3-7-sonnet", "claude-3-5-haiku"],
  Google: ["gemini-1.5-pro", "gemini-1.5-flash"],
  Meta: ["llama-3.1-8b", "llama-3.1-70b"],
  Mistral: ["mistral-large", "mistral-small"],
  DeepSeek: ["deepseek-chat", "deepseek-r1"],
  Qwen: ["qwen2.5-7b", "qwen2.5-72b"]
}

/**
 * All preset standard models (flattened)
 */
export const ALL_PRESET_STANDARD_MODELS = Object.values(
  PRESET_STANDARD_MODELS
).flat()

/**
 * Default model redirect preferences
 */
export const DEFAULT_MODEL_REDIRECT_PREFERENCES: ModelRedirectPreferences = {
  enabled: false,
  standardModels: [...ALL_PRESET_STANDARD_MODELS],
  scoring: { ...DEFAULT_MODEL_REDIRECT_SCORING },
  version: 1
}
