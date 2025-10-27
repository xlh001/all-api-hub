/**
 * Centralized preferences migration system
 * Handles version-based migrations for UserPreferences configurations
 */

import type { UserPreferences } from "../userPreferences"
import { migrateSortingConfig } from "./sortingConfigMigration"

// Current version of the preferences schema
export const CURRENT_PREFERENCES_VERSION = 1

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
  }

  // Future migrations will be added here:
  // 2: (prefs: UserPreferences): UserPreferences => { ... },
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
