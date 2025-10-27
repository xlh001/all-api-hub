/**
 * Sorting configuration migration system
 * Handles version-based migrations for sorting priority configurations
 */

import type { SortingPriorityConfig } from "~/types/sorting"
import { DEFAULT_SORTING_PRIORITY_CONFIG } from "~/utils/sortingPriority"

/**
 * Check if a sorting config needs migration
 */
export function needsSortingConfigMigration(
  config: SortingPriorityConfig | undefined
): boolean {
  if (!config) return true
  const src = new Set(config.criteria.map((c) => c.id))
  const dst = new Set(DEFAULT_SORTING_PRIORITY_CONFIG.criteria.map((c) => c.id))
  if (src.size !== dst.size) return true
  for (const id of dst) if (!src.has(id)) return true
  return false
}

/**
 * Migrate sorting config to include new criteria
 * New criteria are added at the end with enabled: false by default
 */
export function migrateSortingConfig(
  config: SortingPriorityConfig | undefined
): SortingPriorityConfig {
  // If no config exists, return default
  if (!config) {
    return {
      ...DEFAULT_SORTING_PRIORITY_CONFIG,
      criteria: DEFAULT_SORTING_PRIORITY_CONFIG.criteria.map((c) => ({ ...c })),
      lastModified: Date.now()
    }
  }
  // If no migration is needed, return the config as is
  if (!needsSortingConfigMigration(config)) {
    return config
  }

  const existingIds = new Set(config.criteria.map((c) => c.id))
  const allIds = new Set(
    DEFAULT_SORTING_PRIORITY_CONFIG.criteria.map((c) => c.id)
  )

  // Check if any new criteria are missing
  const missingIds = [...allIds].filter((id) => !existingIds.has(id))

  if (missingIds.length === 0) {
    return config
  }

  // Add missing criteria with default values
  const newCriteria = [...config.criteria]
  const maxPriority = Math.max(...newCriteria.map((c) => c.priority), -1)

  missingIds.forEach((id, index) => {
    const defaultCriterion = DEFAULT_SORTING_PRIORITY_CONFIG.criteria.find(
      (c) => c.id === id
    )
    if (defaultCriterion) {
      newCriteria.push({
        ...defaultCriterion,
        priority: maxPriority + index + 1,
        enabled: false // Disable new criteria by default
      })
      console.log(
        `[SortingConfigMigration] Adding new criterion: ${id} with priority ${maxPriority + index + 1}, enabled: false`
      )
    }
  })

  const migratedConfig: SortingPriorityConfig = {
    ...config,
    criteria: newCriteria,
    lastModified: Date.now()
  }

  console.log(
    `[SortingConfigMigration] Migrated sorting config, added ${missingIds.length} new criteria`
  )

  return migratedConfig
}
