import { NEW_API, VELOERA, type ManagedSiteType } from "~/constants/siteType"
import type { UserPreferences } from "~/services/userPreferences"
import type { NewApiConfig } from "~/types/newApiConfig"
import type { VeloeraConfig } from "~/types/veloeraConfig"

export type ManagedSiteLabelKey =
  | "settings:managedSite.newApi"
  | "settings:managedSite.veloera"

/**
 * Managed site namespace key used under the `messages` i18n namespace.
 */
export type ManagedSiteMessagesKey = "newapi" | "veloera"

export interface ManagedSiteAdminConfig {
  baseUrl: string
  adminToken: string
  userId: string
}

export type ManagedSiteConfig = NewApiConfig | VeloeraConfig

/**
 * Extracts the selected managed site type and its corresponding config from a
 * given preferences snapshot.
 */
export function getManagedSiteConfigFromPreferences(
  preferences: UserPreferences,
): {
  siteType: ManagedSiteType
  config: ManagedSiteConfig
} {
  const siteType: ManagedSiteType = preferences.managedSiteType || NEW_API
  const config = siteType === VELOERA ? preferences.veloera : preferences.newApi
  return { siteType, config }
}

/**
 * Convenience wrapper for retrieving the managed site type + config.
 */
export function getManagedSiteConfig(prefs: UserPreferences): {
  siteType: ManagedSiteType
  config: ManagedSiteConfig
} {
  return getManagedSiteConfigFromPreferences(prefs)
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
 * Returns the `messages` namespace key for the selected managed site type.
 */
export function getManagedSiteMessagesKeyFromSiteType(
  siteType: ManagedSiteType,
): ManagedSiteMessagesKey {
  return siteType === VELOERA ? "veloera" : "newapi"
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
  const { config } = getManagedSiteConfigFromPreferences(preferences)

  if (!config?.baseUrl || !config?.adminToken || !config?.userId) {
    return null
  }

  return {
    baseUrl: config.baseUrl,
    adminToken: config.adminToken,
    userId: config.userId,
  }
}

/**
 * Gets the current managed site type from user preferences.
 */
export function getManagedSiteType(prefs: UserPreferences): ManagedSiteType {
  return prefs.managedSiteType || NEW_API
}

/**
 * Returns both the selected managed site type and its corresponding i18n messages key.
 */
export function getManagedSiteContext(prefs: UserPreferences): {
  siteType: ManagedSiteType
  messagesKey: ManagedSiteMessagesKey
} {
  const siteType = getManagedSiteType(prefs)
  return {
    siteType,
    messagesKey: getManagedSiteMessagesKeyFromSiteType(siteType),
  }
}

/**
 * Returns the current managed site messages key.
 */
export function getManagedSiteMessagesKey(
  prefs: UserPreferences,
): ManagedSiteMessagesKey {
  const { messagesKey } = getManagedSiteContext(prefs)
  return messagesKey
}
