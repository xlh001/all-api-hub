import { DATA_TYPE_BALANCE, DATA_TYPE_CONSUMPTION } from "~/constants/ui"
import type {
  CurrencyType,
  DisplaySiteData,
  SiteAccount,
  SortField
} from "~/types"
import {
  SortingCriteriaType,
  type SortingPriorityConfig
} from "~/types/sorting"

/**
 * This constant defines the default sorting priority configuration.
 * It contains the data-only configuration for sorting criteria, without UI text.
 */
export const DEFAULT_SORTING_PRIORITY_CONFIG: SortingPriorityConfig = {
  version: 1,
  criteria: [
    {
      id: SortingCriteriaType.CURRENT_SITE,
      enabled: true,
      priority: 0
    },
    {
      id: SortingCriteriaType.HEALTH_STATUS,
      enabled: true,
      priority: 1
    },
    {
      id: SortingCriteriaType.CHECK_IN_REQUIREMENT,
      enabled: true,
      priority: 2
    },
    {
      id: SortingCriteriaType.USER_SORT_FIELD,
      enabled: true,
      priority: 3
    }
  ],
  lastModified: Date.now()
}

function compareByUserSortField(
  a: DisplaySiteData,
  b: DisplaySiteData,
  sortField: SortField,
  currencyType: CurrencyType,
  sortOrder: "asc" | "desc"
) {
  switch (sortField) {
    case "name":
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    case DATA_TYPE_BALANCE:
      return sortOrder === "asc"
        ? a.balance[currencyType] - b.balance[currencyType]
        : b.balance[currencyType] - a.balance[currencyType]
    case DATA_TYPE_CONSUMPTION:
      return sortOrder === "asc"
        ? a.todayConsumption[currencyType] - b.todayConsumption[currencyType]
        : b.todayConsumption[currencyType] - a.todayConsumption[currencyType]
    default:
      return 0
  }
}
function applySortingCriteria(
  a: DisplaySiteData,
  b: DisplaySiteData,
  criteriaId: SortingCriteriaType,
  detectedAccount: SiteAccount | null,
  userSortField: SortField,
  currencyType: CurrencyType,
  sortOrder: "asc" | "desc"
): number {
  switch (criteriaId) {
    case SortingCriteriaType.CURRENT_SITE:
      if (a.id === detectedAccount?.id) return -1
      if (b.id === detectedAccount?.id) return 1
      return 0

    case SortingCriteriaType.HEALTH_STATUS:
      const healthPriority = { error: 1, warning: 2, unknown: 3, healthy: 4 }
      const healthA = healthPriority[a.health?.status] || 4
      const healthB = healthPriority[b.health?.status] || 4
      return healthA - healthB

    case SortingCriteriaType.CHECK_IN_REQUIREMENT:
      const checkInA = a.can_check_in ? 1 : 0
      const checkInB = b.can_check_in ? 1 : 0
      return checkInB - checkInA

    case SortingCriteriaType.USER_SORT_FIELD:
      return compareByUserSortField(
        a,
        b,
        userSortField,
        currencyType,
        sortOrder
      )

    default:
      return 0
  }
}
/**
 * Creates a dynamic comparator function for sorting site data based on a data-only configuration.
 *
 * @param config The sorting priority configuration containing data-only fields.
 * @param detectedAccount The currently detected site account, used for 'current_site' priority.
 * @param userSortField The field selected by the user for sorting ('name', 'balance', 'consumption').
 * @param currencyType The currency type to use for sorting balance or consumption.
 * @param sortOrder The sort order ('asc' or 'desc').
 * @returns A comparator function for `Array.prototype.sort()`.
 */
export function createDynamicSortComparator(
  config: SortingPriorityConfig,
  detectedAccount: SiteAccount | null,
  userSortField: SortField,
  currencyType: CurrencyType,
  sortOrder: "asc" | "desc"
) {
  return (a: DisplaySiteData, b: DisplaySiteData): number => {
    const enabledCriteria = config.criteria
      .filter((c) => c.enabled)
      .sort((c1, c2) => c1.priority - c2.priority)

    for (const criteria of enabledCriteria) {
      const comparison = applySortingCriteria(
        a,
        b,
        criteria.id,
        detectedAccount,
        userSortField,
        currencyType,
        sortOrder
      )
      if (comparison !== 0) return comparison
    }
    return 0
  }
}
