import { ChannelType } from "~/constants"
import { ChannelTypeNames } from "~/constants/newApi.ts"

export function getChannelTypeName(type: ChannelType): string {
  return ChannelTypeNames[type] ?? "Unknown"
}
