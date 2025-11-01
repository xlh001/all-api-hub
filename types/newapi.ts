/**
 * Channel Type enumeration
 * Based on New API documentation: https://www.newapi.ai/api/fei-channel-management/#_12
 */
export enum ChannelType {
  OpenAI = 1,
  Anthropic = 8,
  GoogleGemini = 14,
  Azure = 3,
  Cohere = 22,
  BaiChuan = 15,
  ZhipuAI = 18,
  AlibabaQwen = 17,
  Xunfei = 20,
  DeepSeek = 29,
  Moonshot = 19,
  Ollama = 21,
  VertexAI = 24,
  AWS = 23,
  Cloudflare = 26,
  Groq = 30,
  Midjourney = 33,
  Suno = 36,
  Custom = 0
}

/**
 * Group data from New API
 */
export interface ChannelGroup {
  id: string
  name: string
}

/**
 * Model data from New API or model suggestion
 */
export interface ChannelModel {
  id: string
  name: string
  provider?: string
  description?: string
  tags?: string[]
}

export type ChannelMode = "single" | "batch"

/**
 * Channel default field values
 */
export interface ChannelDefaults {
  mode: ChannelMode
  status: number
  priority: number
  weight: number
  groups: string[]
  models: string[]
  type: ChannelType
}

/**
 * Type-specific channel configuration overrides
 */
export interface ChannelTypeConfig {
  type: ChannelType
  baseUrlPlaceholder?: string
  keyPlaceholder?: string
  defaultPriority?: number
  defaultWeight?: number
  requiresBaseUrl?: boolean
  supportsModelsAutoFetch?: boolean
}

/**
 * Channel creation/edit form data
 */
export interface ChannelFormData {
  name: string
  type: ChannelType
  key: string
  base_url?: string
  models: string[]
  groups: string[]
  priority: number
  weight: number
  status: number
}

/**
 * Channel creation payload for New API
 */
export interface ChannelCreationPayload {
  mode: ChannelMode
  channel: {
    name: string
    type: number
    key: string
    base_url?: string
    models: string
    groups: string[]
    priority: number
    weight: number
    status: number
  }
}
