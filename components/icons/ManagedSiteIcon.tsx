import { NewAPI } from "@lobehub/icons"

import { VeloeraIcon } from "~/components/icons/VeloeraIcon"
import type { ManagedSiteType } from "~/constants/siteType"
import { VELOERA } from "~/constants/siteType"

type ManagedSiteIconSize = "sm" | "md" | "lg"

interface ManagedSiteIconProps {
  siteType: ManagedSiteType
  size?: ManagedSiteIconSize
}

const NEW_API_ICON_CLASSNAME: Record<ManagedSiteIconSize, string> = {
  sm: "h-4 w-4 text-blue-500",
  md: "h-6 w-6 text-blue-500",
  lg: "h-8 w-8 text-blue-500",
}

/**
 * ManagedSiteIcon renders the correct brand icon for the selected managed site type.
 */
export function ManagedSiteIcon({
  siteType,
  size = "sm",
}: ManagedSiteIconProps) {
  if (siteType === VELOERA) {
    return <VeloeraIcon size={size} />
  }

  return <NewAPI className={NEW_API_ICON_CLASSNAME[size]} />
}
