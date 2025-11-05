/**
 * Centralized preferences migration system
 * Handles version-based migrations for UserPreferences configurations
 */

import type { UserPreferences } from "../../userPreferences.ts"
import { migrateSortingConfig } from "./sortingConfigMigration.ts"
import { DEFAULT_WEBDAV_SETTINGS } from "~/types/webdav"

// Current version of the preferences schema
export const CURRENT_PREFERENCES_VERSION = 3

/**
 * Migration function type
 * Takes preferences at version N and returns it at version N+1
 */
type PreferencesMigrationFunction = (prefs: UserPreferences) => UserPreferences

/**
 * Registry of migration functions
 * Key: target version number
 * Value: migration function to upgrade to that version
 */
const migrations: Record<number, PreferencesMigrationFunction> = {
  // Version 0 -> 1: Migrate sorting priority configuration
  1: (prefs: UserPreferences): UserPreferences => {
    console.log(
      "[PreferencesMigration] Migrating preferences from v0 to v1 (sorting config migration)"
    )

    // Migrate sorting priority config
    const migratedSortingConfig = migrateSortingConfig(
      prefs.sortingPriorityConfig
    )

    return {
      ...prefs,
      sortingPriorityConfig: migratedSortingConfig,
      preferencesVersion: 1
    }
  },

  // Version 1 -> 2: Add PINNED sorting criterion
  2: (prefs: UserPreferences): UserPreferences => {
    console.log(
      "[PreferencesMigration] Migrating preferences from v1 to v2 (add PINNED criterion)"
    )

    // Migrate sorting priority config to add PINNED criterion
    const migratedSortingConfig = migrateSortingConfig(
      prefs.sortingPriorityConfig
    )

    return {
      ...prefs,
      sortingPriorityConfig: migratedSortingConfig,
      preferencesVersion: 2
    }
  },

  // Version 2 -> 3: Migrate flat WebDAV fields to nested webdav object
  3: (prefs: UserPreferences): UserPreferences => {
    console.log(
      "[PreferencesMigration] Migrating preferences from v2 to v3 (WebDAV settings migration)"
    )

    // Check if any old WebDAV fields exist
    const hasOldWebdavFields = 
      'webdavUrl' in prefs ||
      'webdavUsername' in prefs ||
      'webdavPassword' in prefs ||
      'webdavAutoSync' in prefs ||
      'webdavSyncInterval' in prefs ||
      'webdavSyncStrategy' in prefs

    let webdavSettings = { ...DEFAULT_WEBDAV_SETTINGS }

    if (hasOldWebdavFields) {
      // Migrate old flat fields to nested object
      webdavSettings = {
        url: prefs.webdavUrl ?? DEFAULT_WEBDAV_SETTINGS.url,
        username: prefs.webdavUsername ?? DEFAULT_WEBDAV_SETTINGS.username,
        password: prefs.webdavPassword ?? DEFAULT_WEBDAV_SETTINGS.password,
        autoSync: prefs.webdavAutoSync ?? DEFAULT_WEBDAV_SETTINGS.autoSync,
        syncInterval: prefs.webdavSyncInterval ?? DEFAULT_WEBDAV_SETTINGS.syncInterval,
        syncStrategy: prefs.webdavSyncStrategy === "download_only" ? "merge" : (prefs.webdavSyncStrategy === "upload_only" ? "overwrite" : "merge")
      }

      console.log("[PreferencesMigration] Migrated WebDAV settings:", {
        url: webdavSettings.url ? "***" : "empty",
        username: webdavSettings.username ? "***" : "empty",
        password: webdavSettings.password ? "***" : "empty",
        autoSync: webdavSettings.autoSync,
        syncInterval: webdavSettings.syncInterval,
        syncStrategy: webdavSettings.syncStrategy
      })
    }

    // Create new preferences object with nested webdav
    const { 
      webdavUrl, 
      webdavUsername, 
      webdavPassword, 
      webdavAutoSync, 
      webdavSyncInterval, 
      webdavSyncStrategy,
      ...restOfPrefs 
    } = prefs

    return {
      ...restOfPrefs,
      webdav: webdavSettings,
      preferencesVersion: 3
    }
  }
}

/**
 * Check if preferences need migration
 */
export function needsPreferencesMigration(
  prefs: UserPreferences | undefined
): boolean {
  if (!prefs) return false
  const currentVersion = prefs.preferencesVersion ?? 0
  return currentVersion < CURRENT_PREFERENCES_VERSION
}

/**
 * Get the version of preferences
 */
export function getPreferencesVersion(
  prefs: UserPreferences | undefined
): number {
  return prefs?.preferencesVersion ?? 0
}

/**
 * Migrate preferences to the latest version
 * Applies all necessary migrations sequentially
 */
export function migratePreferences(
  migratedPrefs: UserPreferences
): UserPreferences {
  let currentVersion = getPreferencesVersion(migratedPrefs)

  // Apply migrations sequentially until we reach current version
  while (needsPreferencesMigration(migratedPrefs)) {
    const nextVersion = currentVersion + 1
    const migrationFn = migrations[nextVersion]

    if (!migrationFn) {
      console.error(
        `[PreferencesMigration] No migration defined for version ${nextVersion}`
      )
      break
    }

    console.log(
      `[PreferencesMigration] Migrating preferences from v${currentVersion} to v${nextVersion}`
    )
    migratedPrefs = migrationFn(migratedPrefs)
    currentVersion = nextVersion
  }

  return migratedPrefs
}
