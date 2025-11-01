/**
 * Channel Type enumeration
 * Based on https://github.com/QuantumNous/new-api/blob/00782aae88c3ae6a3623ca557f6af17c4a28b8b9/constant/channel.go#L3
 */
export enum ChannelType {
  ChannelTypeUnknown = 0,
  ChannelTypeOpenAI = 1,
  ChannelTypeMidjourney = 2,
  ChannelTypeAzure = 3,
  ChannelTypeOllama = 4,
  ChannelTypeMidjourneyPlus = 5,
  ChannelTypeOpenAIMax = 6,
  ChannelTypeOhMyGPT = 7,
  ChannelTypeCustom = 8,
  ChannelTypeAILS = 9,
  ChannelTypeAIProxy = 10,
  ChannelTypePaLM = 11,
  ChannelTypeAPI2GPT = 12,
  ChannelTypeAIGC2D = 13,
  ChannelTypeAnthropic = 14,
  ChannelTypeBaidu = 15,
  ChannelTypeZhipu = 16,
  ChannelTypeAli = 17,
  ChannelTypeXunfei = 18,
  ChannelType360 = 19,
  ChannelTypeOpenRouter = 20,
  ChannelTypeAIProxyLibrary = 21,
  ChannelTypeFastGPT = 22,
  ChannelTypeTencent = 23,
  ChannelTypeGemini = 24,
  ChannelTypeMoonshot = 25,
  ChannelTypeZhipu_v4 = 26,
  ChannelTypePerplexity = 27,
  ChannelTypeLingYiWanWu = 31,
  ChannelTypeAws = 33,
  ChannelTypeCohere = 34,
  ChannelTypeMiniMax = 35,
  ChannelTypeSunoAPI = 36,
  ChannelTypeDify = 37,
  ChannelTypeJina = 38,
  ChannelCloudflare = 39,
  ChannelTypeSiliconFlow = 40,
  ChannelTypeVertexAi = 41,
  ChannelTypeMistral = 42,
  ChannelTypeDeepSeek = 43,
  ChannelTypeMokaAI = 44,
  ChannelTypeVolcEngine = 45,
  ChannelTypeBaiduV2 = 46,
  ChannelTypeXinference = 47,
  ChannelTypeXai = 48,
  ChannelTypeCoze = 49,
  ChannelTypeKling = 50,
  ChannelTypeJimeng = 51,
  ChannelTypeVidu = 52,
  ChannelTypeSubmodel = 53,
  ChannelTypeDoubaoVideo = 54,
  ChannelTypeSora = 55
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

/**
 * Channel status constants
 */
export const CHANNEL_STATUS = {
  ENABLED: 1,
  DISABLED: 2
} as const

export type ChannelStatus = (typeof CHANNEL_STATUS)[keyof typeof CHANNEL_STATUS]

/**
 * Channel mode constants
 */
export const CHANNEL_MODE = {
  SINGLE: "single",
  BATCH: "batch"
} as const

export type ChannelMode = (typeof CHANNEL_MODE)[keyof typeof CHANNEL_MODE]

/**
 * Channel default field values
 */
export interface ChannelDefaults {
  mode: ChannelMode
  status: ChannelStatus
  priority: number
  weight: number
  groups: string[]
  models: string[]
  type: ChannelType
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
