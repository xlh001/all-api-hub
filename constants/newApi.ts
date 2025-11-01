import { ChannelDefaults, ChannelType } from "~/types"

/**
 * Default field values for all channels
 */
export const DEFAULT_CHANNEL_FIELDS: ChannelDefaults = {
  mode: "single",
  status: 1,
  priority: 0,
  weight: 0,
  groups: ["default"],
  models: [],
  type: ChannelType.ChannelTypeOpenAI
}
