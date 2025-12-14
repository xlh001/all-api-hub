import { NEW_API, VELOERA, type ManagedSiteType } from "~/constants/siteType"
import type { UserPreferences } from "~/services/userPreferences"

export type ManagedSiteLabelKey =
  | "settings:managedSite.newApi"
  | "settings:managedSite.veloera"

export interface ManagedSiteAdminConfig {
  baseUrl: string
  adminToken: string
  userId: string
}

/**
 * Returns the i18n key for the managed site label shown in UI.
 */
export function getManagedSiteLabelKey(
  siteType: ManagedSiteType,
): ManagedSiteLabelKey {
  return siteType === VELOERA
    ? "settings:managedSite.veloera"
    : "settings:managedSite.newApi"
}

/**
 * Extracts the current managed site admin config from user preferences.
 *
 * Note: this intentionally reads `preferences.managedSiteType` to ensure the
 * returned config always matches the real selected managed site type.
 */
export function getManagedSiteAdminConfig(
  preferences: UserPreferences,
): ManagedSiteAdminConfig | null {
  const siteType: ManagedSiteType = preferences.managedSiteType || NEW_API
  const config = siteType === VELOERA ? preferences.veloera : preferences.newApi

  if (!config?.baseUrl || !config?.adminToken || !config?.userId) {
    return null
  }

  return {
    baseUrl: config.baseUrl,
    adminToken: config.adminToken,
    userId: config.userId,
  }
}
