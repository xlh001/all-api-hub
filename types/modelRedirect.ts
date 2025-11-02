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
 * Development/testing configuration
 */
export interface ModelRedirectDevConfig {
  useMockData: boolean
}

/**
 * Model redirect preferences
 */
export interface ModelRedirectPreferences {
  enabled: boolean
  standardModels: string[]
  autoGenerateMapping: boolean
  scoring: ModelRedirectScoring
  dev: ModelRedirectDevConfig
  version: number
}

/**
 * Rank factors for a candidate channel
 */
export interface RankFactors {
  priority: number
  weightLevel: 1 | 2 | 3 | 4 | 5
  usedQuotaRatio: number
  usedQuotaAdj: number
}

/**
 * Model mapping entry
 */
export interface ModelMappingEntry {
  targetModel: string
  channelId: string
  rankFactors: RankFactors
  reason: string
  decidedAt: string
}

/**
 * Mapping metadata
 */
export interface MappingMetadata {
  updatedAt: string
  trigger: "manual" | "sync" | "mock"
}

/**
 * Model mapping storage structure
 */
export interface ModelMapping {
  [standardModel: string]: ModelMappingEntry
  _meta?: MappingMetadata
}

/**
 * Channel candidate for model redirect
 */
export interface ChannelCandidate {
  channelId: number
  channelName: string
  model: string
  priority: number
  weight: number
  weightLevel: 1 | 2 | 3 | 4 | 5
  usedQuota: number
  status: number
  dateToken?: string // Extracted date from model name (yyyymmdd or yyyymm)
}

/**
 * Mapping generation trigger
 */
export type MappingGenerationTrigger = "manual" | "sync" | "mock"

/**
 * Mapping generation options
 */
export interface GenerateMappingOptions {
  trigger: MappingGenerationTrigger
}

/**
 * Mock channel data for testing
 */
export interface MockChannelData {
  id: number
  name: string
  models: string
  priority: number
  weight: number
  status: number
  base_url: string
  type: number
  key: string
  groups: string
}

/**
 * Mock data provider response
 */
export interface MockDataProviderResponse {
  channels: MockChannelData[]
}

/**
 * Model name aliases by vendor
 */
export interface ModelAliases {
  [key: string]: string[] // Canonical name -> aliases
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
 * Default model redirect preferences
 */
export const DEFAULT_MODEL_REDIRECT_PREFERENCES: ModelRedirectPreferences = {
  enabled: false,
  standardModels: [],
  autoGenerateMapping: false,
  scoring: DEFAULT_MODEL_REDIRECT_SCORING,
  dev: {
    useMockData: false
  },
  version: 1
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
