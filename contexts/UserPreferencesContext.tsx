import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react"

import { DATA_TYPE_CONSUMPTION } from "~/constants/ui"
import {
  userPreferences,
  type UserPreferences
} from "~/services/userPreferences"
import type { BalanceType, CurrencyType, SortField, SortOrder } from "~/types"

// 1. 定义 Context 的值类型
interface UserPreferencesContextType {
  preferences: UserPreferences | null
  isLoading: boolean
  activeTab: BalanceType
  currencyType: CurrencyType
  sortField: SortField
  sortOrder: SortOrder
  updateActiveTab: (activeTab: BalanceType) => Promise<boolean>
  updateCurrencyType: (currencyType: CurrencyType) => Promise<boolean>
  updateSortConfig: (
    sortField: SortField,
    sortOrder: SortOrder
  ) => Promise<boolean>
  loadPreferences: () => Promise<void>
}

// 2. 创建 Context
const UserPreferencesContext = createContext<
  UserPreferencesContextType | undefined
>(undefined)

// 3. 创建 Provider 组件
export const UserPreferencesProvider = ({
  children
}: {
  children: ReactNode
}) => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadPreferences = useCallback(async () => {
    try {
      setIsLoading(true)
      const prefs = await userPreferences.getPreferences()
      setPreferences(prefs)
    } catch (error) {
      console.error("加载用户偏好设置失败:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPreferences()
  }, [loadPreferences])

  const updateActiveTab = useCallback(async (activeTab: BalanceType) => {
    const success = await userPreferences.updateActiveTab(activeTab)
    if (success) {
      setPreferences((prev) => (prev ? { ...prev, activeTab } : null))
    }
    return success
  }, [])

  const updateCurrencyType = useCallback(async (currencyType: CurrencyType) => {
    const success = await userPreferences.updateCurrencyType(currencyType)
    if (success) {
      setPreferences((prev) => (prev ? { ...prev, currencyType } : null))
    }
    return success
  }, [])

  const updateSortConfig = useCallback(
    async (sortField: SortField, sortOrder: SortOrder) => {
      const success = await userPreferences.updateSortConfig(
        sortField,
        sortOrder
      )
      if (success) {
        setPreferences((prev) =>
          prev ? { ...prev, sortField, sortOrder } : null
        )
      }
      return success
    },
    []
  )

  const value = useMemo(
    () => ({
      preferences,
      isLoading,
      activeTab: preferences?.activeTab || DATA_TYPE_CONSUMPTION,
      currencyType: preferences?.currencyType || "USD",
      sortField: preferences?.sortField || "name",
      sortOrder: preferences?.sortOrder || "asc",
      updateActiveTab,
      updateCurrencyType,
      updateSortConfig,
      loadPreferences
    }),
    [
      preferences,
      isLoading,
      updateActiveTab,
      updateCurrencyType,
      updateSortConfig,
      loadPreferences
    ]
  )

  if (isLoading) {
    return null
  }

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  )
}

// 4. 创建自定义 Hook
export const useUserPreferencesContext = () => {
  const context = useContext(UserPreferencesContext)
  if (
    context === undefined ||
    !context.updateActiveTab ||
    !context.updateCurrencyType ||
    !context.updateSortConfig
  ) {
    throw new Error(
      "useUserPreferencesContext 必须在 UserPreferencesProvider 中使用，并且必须提供所有必需的函数"
    )
  }
  return context
}
