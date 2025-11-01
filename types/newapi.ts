import { ChannelType } from "~/constants"

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
  base_url: string
  models: string[]
  groups: string[]
  priority: number
  weight: number
  status: ChannelStatus
}

/**
 * Channel creation payload for New API
 */
export interface ChannelCreationPayload {
  mode: ChannelMode
  channel: {
    name: string
    type: ChannelType
    key: string
    base_url: string
    models: string
    groups: string[]
    /**
     * 渠道可用用户分组
     * 其实就是groups.join(",")而来，但现行API只认这个不认groups
     */
    group?: string
    priority: number
    weight: number
    status: number
  }
}

/**
 * New API Channel data
 */
export interface NewApiChannel {
  id: number
  type: ChannelType
  key: string
  name: string
  base_url: string
  // models 是逗号分隔的字符串,示例: "gpt-3.5-turbo,gpt-4"
  models: string
  // groups 是逗号分隔的字符串,示例: "default,group1"
  groups: string
  status: ChannelStatus
  weight: number
  priority: number
}

/**
 * All New API Channel data
 */
export interface NewApiChannelListData {
  items: NewApiChannel[]
  total: number
  type_counts: Record<string, number>
}
