import merge from "lodash-es/merge"
import type { ReactNode } from "react"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react"

import { DATA_TYPE_CONSUMPTION } from "~/constants"
import { UI_CONSTANTS } from "~/constants/ui"
import {
  userPreferences,
  type UserPreferences
} from "~/services/userPreferences"
import type { BalanceType, CurrencyType, SortField, SortOrder } from "~/types"
import type { AutoCheckinPreferences } from "~/types/autoCheckin"
import type { ModelRedirectPreferences } from "~/types/modelRedirect"
import type { SortingPriorityConfig } from "~/types/sorting"
import type { ThemeMode } from "~/types/theme"
import { sendRuntimeMessage } from "~/utils/browserApi"
import { DEFAULT_SORTING_PRIORITY_CONFIG } from "~/utils/sortingPriority"

type UserNewApiModelSyncConfig = NonNullable<UserPreferences["newApiModelSync"]>

// 1. 定义 Context 的值类型
interface UserPreferencesContextType {
  preferences: UserPreferences | null
  isLoading: boolean
  activeTab: BalanceType
  currencyType: CurrencyType
  sortingPriorityConfig: SortingPriorityConfig
  sortField: SortField
  sortOrder: SortOrder
  autoRefresh: boolean
  refreshInterval: number
  minRefreshInterval: number
  refreshOnOpen: boolean
  newApiBaseUrl: string
  newApiAdminToken: string
  newApiUserId: string
  themeMode: ThemeMode

  updateActiveTab: (activeTab: BalanceType) => Promise<boolean>
  updateDefaultTab: (activeTab: BalanceType) => Promise<boolean>
  updateCurrencyType: (currencyType: CurrencyType) => Promise<boolean>
  updateSortConfig: (
    sortField: SortField,
    sortOrder: SortOrder
  ) => Promise<boolean>
  updateSortingPriorityConfig: (
    sortingPriority: SortingPriorityConfig
  ) => Promise<boolean>
  updateAutoRefresh: (enabled: boolean) => Promise<boolean>
  updateRefreshInterval: (interval: number) => Promise<boolean>
  updateMinRefreshInterval: (interval: number) => Promise<boolean>
  updateRefreshOnOpen: (enabled: boolean) => Promise<boolean>
  updateNewApiBaseUrl: (url: string) => Promise<boolean>
  updateNewApiAdminToken: (token: string) => Promise<boolean>
  updateNewApiUserId: (userId: string) => Promise<boolean>
  updateThemeMode: (themeMode: ThemeMode) => Promise<boolean>
  updateAutoCheckin: (
    updates: Partial<AutoCheckinPreferences>
  ) => Promise<boolean>
  updateNewApiModelSync: (
    updates: Partial<UserNewApiModelSyncConfig>
  ) => Promise<boolean>
  updateModelRedirect: (
    updates: Partial<ModelRedirectPreferences>
  ) => Promise<boolean>
  resetToDefaults: () => Promise<boolean>
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

  const updateDefaultTab = useCallback(async (activeTab: BalanceType) => {
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

  const updateSortingPriorityConfig = useCallback(
    async (sortingPriority: SortingPriorityConfig) => {
      const success =
        await userPreferences.setSortingPriorityConfig(sortingPriority)
      if (success) {
        setPreferences((prev) =>
          prev
            ? {
                ...prev,
                sortingPriorityConfig: sortingPriority
              }
            : null
        )
      }
      return success
    },
    []
  )

  const updateAutoRefresh = useCallback(async (enabled: boolean) => {
    const success = await userPreferences.updateAutoRefresh(enabled)
    if (success) {
      setPreferences((prev) =>
        prev ? { ...prev, autoRefresh: enabled } : null
      )
      sendRuntimeMessage({
        action: "updateAutoRefreshSettings",
        settings: { autoRefresh: enabled }
      })
    }
    return success
  }, [])

  const updateRefreshInterval = useCallback(async (interval: number) => {
    const success = await userPreferences.updateRefreshInterval(interval)
    if (success) {
      setPreferences((prev) =>
        prev ? { ...prev, refreshInterval: interval } : null
      )
      sendRuntimeMessage({
        action: "updateAutoRefreshSettings",
        settings: { refreshInterval: interval }
      })
    }
    return success
  }, [])

  const updateMinRefreshInterval = useCallback(async (interval: number) => {
    const success = await userPreferences.updateMinRefreshInterval(interval)
    if (success) {
      setPreferences((prev) =>
        prev ? { ...prev, minRefreshInterval: interval } : null
      )
    }
    return success
  }, [])

  const updateRefreshOnOpen = useCallback(async (enabled: boolean) => {
    const success = await userPreferences.updateRefreshOnOpen(enabled)
    if (success) {
      setPreferences((prev) =>
        prev ? { ...prev, refreshOnOpen: enabled } : null
      )
    }
    return success
  }, [])

  const updateNewApiBaseUrl = useCallback(async (url: string) => {
    const success = await userPreferences.updateNewApiBaseUrl(url)
    if (success) {
      setPreferences((prev) => (prev ? { ...prev, newApiBaseUrl: url } : null))
    }
    return success
  }, [])

  const updateNewApiAdminToken = useCallback(async (token: string) => {
    const success = await userPreferences.updateNewApiAdminToken(token)
    if (success) {
      setPreferences((prev) =>
        prev ? { ...prev, newApiAdminToken: token } : null
      )
    }
    return success
  }, [])

  const updateNewApiUserId = useCallback(async (userId: string) => {
    const success = await userPreferences.updateNewApiUserId(userId)
    if (success) {
      setPreferences((prev) =>
        prev ? { ...prev, newApiUserId: userId } : null
      )
    }
    return success
  }, [])

  const updateThemeMode = useCallback(async (themeMode: ThemeMode) => {
    const success = await userPreferences.savePreferences({ themeMode })
    if (success) {
      setPreferences((prev) => (prev ? { ...prev, themeMode } : null))
    }
    return success
  }, [])

  const updateAutoCheckin = useCallback(
    async (updates: Partial<AutoCheckinPreferences>) => {
      const success = await userPreferences.savePreferences({
        autoCheckin: updates
      })

      if (success) {
        setPreferences((prev) => {
          if (!prev) return null
          const merged = merge({}, prev.autoCheckin ?? {}, updates)
          return {
            ...prev,
            autoCheckin: merged
          }
        })

        // Notify background to update alarm
        await sendRuntimeMessage({
          action: "autoCheckin:updateSettings",
          settings: updates
        })
      }
      return success
    },
    []
  )

  const updateNewApiModelSync = useCallback(
    async (updates: Partial<UserNewApiModelSyncConfig>) => {
      const success = await userPreferences.savePreferences({
        newApiModelSync: updates
      })
      if (success) {
        setPreferences((prev) => {
          if (!prev) return null
          const merged = merge({}, prev.newApiModelSync ?? {}, updates)
          return {
            ...prev,
            newApiModelSync: merged
          }
        })

        // Notify background to update alarm
        await sendRuntimeMessage({
          action: "newApiModelSync:updateSettings",
          settings: updates
        })
      }
      return success
    },
    []
  )

  const updateModelRedirect = useCallback(
    async (updates: Partial<ModelRedirectPreferences>) => {
      const success = await userPreferences.savePreferences({
        modelRedirect: updates
      })
      if (success) {
        setPreferences((prev) => {
          if (!prev) return null
          const merged = merge({}, prev.modelRedirect ?? {}, updates)
          return {
            ...prev,
            modelRedirect: merged
          }
        })
      }
      return success
    },
    []
  )

  const resetToDefaults = useCallback(async () => {
    const success = await userPreferences.resetToDefaults()
    if (success) {
      await loadPreferences()
    }
    return success
  }, [loadPreferences])

  const value = useMemo(
    () => ({
      preferences,
      isLoading,
      activeTab: preferences?.activeTab || DATA_TYPE_CONSUMPTION,
      currencyType: preferences?.currencyType || "USD",
      sortField: preferences?.sortField || UI_CONSTANTS.SORT.DEFAULT_FIELD,
      sortOrder: preferences?.sortOrder || UI_CONSTANTS.SORT.DEFAULT_ORDER,
      sortingPriorityConfig:
        preferences?.sortingPriorityConfig || DEFAULT_SORTING_PRIORITY_CONFIG,
      autoRefresh: preferences?.autoRefresh ?? true,
      refreshInterval: preferences?.refreshInterval ?? 360,
      minRefreshInterval: preferences?.minRefreshInterval ?? 60,
      refreshOnOpen: preferences?.refreshOnOpen ?? true,
      newApiBaseUrl: preferences?.newApiBaseUrl || "",
      newApiAdminToken: preferences?.newApiAdminToken || "",
      newApiUserId: preferences?.newApiUserId || "",
      themeMode: preferences?.themeMode || "system",
      updateActiveTab,
      updateDefaultTab,
      updateCurrencyType,
      updateSortConfig,
      updateSortingPriorityConfig,
      updateAutoRefresh,
      updateRefreshInterval,
      updateMinRefreshInterval,
      updateRefreshOnOpen,
      updateNewApiBaseUrl,
      updateNewApiAdminToken,
      updateNewApiUserId,
      updateThemeMode,
      updateAutoCheckin,
      updateNewApiModelSync,
      updateModelRedirect,
      resetToDefaults,
      loadPreferences
    }),
    [
      preferences,
      isLoading,
      updateActiveTab,
      updateDefaultTab,
      updateCurrencyType,
      updateSortConfig,
      updateSortingPriorityConfig,
      updateAutoRefresh,
      updateRefreshInterval,
      updateMinRefreshInterval,
      updateRefreshOnOpen,
      updateNewApiBaseUrl,
      updateNewApiAdminToken,
      updateNewApiUserId,
      updateThemeMode,
      updateAutoCheckin,
      updateNewApiModelSync,
      updateModelRedirect,
      resetToDefaults,
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
    !context.updateSortConfig ||
    !context.updateAutoRefresh ||
    !context.updateRefreshInterval ||
    !context.updateMinRefreshInterval ||
    !context.updateRefreshOnOpen ||
    !context.updateNewApiBaseUrl ||
    !context.updateNewApiAdminToken ||
    !context.updateNewApiUserId ||
    !context.updateThemeMode ||
    !context.updateAutoCheckin ||
    !context.updateNewApiModelSync ||
    !context.resetToDefaults
  ) {
    throw new Error(
      "useUserPreferencesContext 必须在 UserPreferencesProvider 中使用，并且必须提供所有必需的函数"
    )
  }
  return context
}
