import { useState, useMemo, useCallback } from "react"
import { UI_CONSTANTS } from "../constants/ui"
import { createSortComparator } from "../utils/formatters"
import type { DisplaySiteData } from "../types"

type SortField = 'name' | 'balance' | 'consumption'
type SortOrder = 'asc' | 'desc'

interface UseSortResult {
  sortField: SortField
  sortOrder: SortOrder
  sortedData: DisplaySiteData[]
  handleSort: (field: SortField) => void
}

export const useSort = (
  data: DisplaySiteData[],
  currencyType: 'USD' | 'CNY'
): UseSortResult => {
  const [sortField, setSortField] = useState<SortField>(UI_CONSTANTS.SORT.DEFAULT_FIELD)
  const [sortOrder, setSortOrder] = useState<SortOrder>(UI_CONSTANTS.SORT.DEFAULT_ORDER)

  // 处理排序
  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }, [sortField, sortOrder])

  // 排序数据
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      let aValue: string | number, bValue: string | number
      
      switch (sortField) {
        case 'name':
          aValue = a.name
          bValue = b.name
          break
        case 'balance':
          aValue = a.balance[currencyType]
          bValue = b.balance[currencyType]
          break
        case 'consumption':
          aValue = a.todayConsumption[currencyType]
          bValue = b.todayConsumption[currencyType]
          break
        default:
          return 0
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
  }, [data, sortField, sortOrder, currencyType])

  return {
    sortField,
    sortOrder,
    sortedData,
    handleSort
  }
}