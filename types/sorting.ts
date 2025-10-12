// types/sorting.ts

// Enum for sorting criteria identifiers
export enum SortingCriteriaType {
  CURRENT_SITE = "current_site",
  HEALTH_STATUS = "health_status",
  CHECK_IN_REQUIREMENT = "check_in_requirement",
  USER_SORT_FIELD = "user_sort_field"
}

// Interface for sorting field configuration.
// This contains only the data required for sorting logic.
export interface SortingFieldConfig {
  id: SortingCriteriaType
  enabled: boolean
  priority: number // 0-3, lower = higher priority
}

// Complete sorting configuration
export interface SortingPriorityConfig {
  version: number // For future migrations (currently 1)
  criteria: SortingFieldConfig[]
  lastModified: number // Timestamp
}
