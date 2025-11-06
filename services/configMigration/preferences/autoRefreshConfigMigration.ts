/**
 * Migration for auto-refresh configuration
 * Converts flat auto-refresh fields to nested object structure
 */

import type { UserPreferences } from "../../userPreferences.ts"

export function migrateAutoRefreshConfig(
  prefs: UserPreferences
): UserPreferences {
  // If already using new structure and no old fields, no migration needed
  if (prefs.accountAutoRefresh && !prefs.autoRefresh && !prefs.refreshInterval && !prefs.minRefreshInterval && !prefs.refreshOnOpen) {
    return prefs
  }

  // Get values from old fields or use existing nested values as fallback
  const enabled = prefs.autoRefresh ?? prefs.accountAutoRefresh?.enabled ?? true
  const interval = prefs.refreshInterval ?? prefs.accountAutoRefresh?.interval ?? 360
  const minInterval = prefs.minRefreshInterval ?? prefs.accountAutoRefresh?.minInterval ?? 60
  const refreshOnOpen = prefs.refreshOnOpen ?? prefs.accountAutoRefresh?.refreshOnOpen ?? true

  // Create new structure and keep old fields for backward compatibility
  const migratedPrefs: UserPreferences = {
    ...prefs,
    accountAutoRefresh: {
      enabled,
      interval,
      minInterval,
      refreshOnOpen
    },
    // Keep old fields for backward compatibility with code that might still access them
    autoRefresh: enabled,
    refreshInterval: interval,
    minRefreshInterval: minInterval,
    refreshOnOpen: refreshOnOpen
  }

  return migratedPrefs
}
