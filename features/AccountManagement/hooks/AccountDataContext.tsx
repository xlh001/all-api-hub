import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react"
import toast from "react-hot-toast" // 1. 定义 Context 的值类型

import { useUserPreferencesContext } from "~/contexts/UserPreferencesContext"
import { accountStorage } from "~/services/accountStorage"
import type {
  AccountStats,
  CurrencyAmount,
  CurrencyAmountMap,
  DisplaySiteData,
  SiteAccount,
  SortField,
  SortOrder
} from "~/types"
import { createDynamicSortComparator } from "~/utils/sortingPriority"

// 1. 定义 Context 的值类型
interface AccountDataContextType {
  accounts: SiteAccount[]
  displayData: DisplaySiteData[]
  sortedData: DisplaySiteData[]
  stats: AccountStats
  lastUpdateTime: Date
  isInitialLoad: boolean
  isRefreshing: boolean
  prevTotalConsumption: CurrencyAmount
  prevBalances: CurrencyAmountMap
  detectedAccount: SiteAccount | null
  isDetecting: boolean
  loadAccountData: () => Promise<void>
  handleRefresh: (
    force?: boolean
  ) => Promise<{ success: number; failed: number; latestSyncTime?: number }>
  handleSort: (field: SortField) => void
  sortField: SortField
  sortOrder: SortOrder
}

// 2. 创建 Context
const AccountDataContext = createContext<AccountDataContextType | undefined>(
  undefined
)

// 3. 创建 Provider 组件
export const AccountDataProvider = ({ children }: { children: ReactNode }) => {
  const {
    currencyType,
    sortField: initialSortField,
    sortOrder: initialSortOrder,
    updateSortConfig,
    sortingPriorityConfig,
    preferences
  } = useUserPreferencesContext()
  const [accounts, setAccounts] = useState<SiteAccount[]>([])
  const [displayData, setDisplayData] = useState<DisplaySiteData[]>([])
  const [stats, setStats] = useState<AccountStats>({
    total_quota: 0,
    today_total_consumption: 0,
    today_total_requests: 0,
    today_total_prompt_tokens: 0,
    today_total_completion_tokens: 0
  })
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>()
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [prevTotalConsumption, setPrevTotalConsumption] =
    useState<CurrencyAmount>({ USD: 0, CNY: 0 })
  const [prevBalances, setPrevBalances] = useState<CurrencyAmountMap>({})
  const [sortField, setSortField] = useState<SortField>(initialSortField)
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialSortOrder)
  const [detectedAccount, setDetectedAccount] = useState<SiteAccount | null>(
    null
  )
  const [isDetecting, setIsDetecting] = useState(true)

  const checkCurrentTab = useCallback(async () => {
    setIsDetecting(true)
    try {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true
      })
      if (tabs[0]?.url) {
        const existingAccount = await accountStorage.checkUrlExists(tabs[0].url)
        setDetectedAccount(existingAccount)
      } else {
        setDetectedAccount(null)
      }
    } catch (error) {
      console.error("Error detecting current tab account:", error)
      setDetectedAccount(null)
    } finally {
      setIsDetecting(false)
    }
  }, [])

  const loadAccountData = useCallback(async () => {
    try {
      console.log("[AccountContext] Loading account data...")
      const allAccounts = await accountStorage.getAllAccounts()
      const accountStats = await accountStorage.getAccountStats()
      const displaySiteData = accountStorage.convertToDisplayData(
        allAccounts
      ) as DisplaySiteData[]

      if (!isInitialLoad) {
        setPrevTotalConsumption(prevTotalConsumption)
        setPrevBalances(prevBalances)
      }

      setAccounts(allAccounts)
      setStats(accountStats)
      setDisplayData(displaySiteData)

      if (allAccounts.length > 0) {
        const latestSyncTime = Math.max(
          ...allAccounts.map((acc) => acc.last_sync_time)
        )
        if (latestSyncTime > 0) {
          setLastUpdateTime(new Date(latestSyncTime))
        }
      }

      if (isInitialLoad) {
        setIsInitialLoad(false)
      }
    } catch (error) {
      console.error("Failed to load account data:", error)
    }
  }, [])

  const handleRefresh = useCallback(
    async (force: boolean = false) => {
      setIsRefreshing(true)
      try {
        const refreshResult = await accountStorage.refreshAllAccounts(force)
        await loadAccountData()
        if (refreshResult.latestSyncTime > 0) {
          setLastUpdateTime(new Date(refreshResult.latestSyncTime))
        }
        return refreshResult
      } catch (error) {
        console.error("Failed to refresh data:", error)
        await loadAccountData()
        throw error
      } finally {
        setIsRefreshing(false)
      }
    },
    [loadAccountData]
  )

  const hasRefreshedOnOpen = useRef(false)

  // 处理打开插件时自动刷新
  useEffect(() => {
    const handleRefreshOnOpen = async () => {
      // 如果已经执行过，直接返回
      if (hasRefreshedOnOpen.current) {
        return
      }

      // 检查是否启用了打开插件时自动刷新
      if (preferences?.refreshOnOpen) {
        hasRefreshedOnOpen.current = true // 标记已执行
        console.log("[Popup] 打开插件时自动刷新已启用，开始刷新")
        try {
          if (toast) {
            await toast.promise(handleRefresh(false), {
              loading: "正在自动刷新所有账号...",
              success: (result) => {
                if (result.failed > 0) {
                  return `自动刷新完成: ${result.success} 成功, ${result.failed} 失败`
                }
                const sum = result.success + result.failed
                const refreshedCount = result.refreshedCount
                if (refreshedCount < sum) {
                  return `自动刷新完成：${refreshedCount} 个账号刷新成功，${sum - refreshedCount}个因刷新间隔未到未刷新`
                }
                console.log("[Popup] 打开插件时自动刷新完成")
                return "所有账号自动刷新成功！"
              },
              error: "自动刷新失败，请稍后重试"
            })
          } else {
            await handleRefresh(false)
          }
        } catch (error) {
          console.error("[Popup] 打开插件时自动刷新失败:", error)
        }
      }
    }

    handleRefreshOnOpen()
  }, [handleRefresh, preferences?.refreshOnOpen])

  useEffect(() => {
    loadAccountData()
  }, [])

  useEffect(() => {
    // 打开 popup 时立即检测一次
    checkCurrentTab()

    // Tab 激活变化时检测
    const onActivated = () => {
      checkCurrentTab()
    }
    chrome.tabs.onActivated.addListener(onActivated)

    // Tab URL 或状态更新时检测（只对当前 tab）
    const onUpdated = (tabId, changeInfo, tab) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id === tabId) {
          checkCurrentTab()
        }
      })
    }
    chrome.tabs.onUpdated.addListener(onUpdated)

    // 清理监听器
    return () => {
      chrome.tabs.onActivated.removeListener(onActivated)
      chrome.tabs.onUpdated.removeListener(onUpdated)
    }
  }, [accounts, checkCurrentTab])

  // 监听后台自动刷新的更新通知
  useEffect(() => {
    const handleBackgroundRefreshUpdate = (message: any) => {
      if (
        message.type === "AUTO_REFRESH_UPDATE" &&
        message.payload.type === "refresh_completed"
      ) {
        console.log(
          "[AccountContext] Background refresh completed, reloading data."
        )
        loadAccountData()
      }
    }

    chrome.runtime.onMessage.addListener(handleBackgroundRefreshUpdate)

    return () => {
      chrome.runtime.onMessage.removeListener(handleBackgroundRefreshUpdate)
    }
  }, [loadAccountData])

  const handleSort = useCallback(
    (field: SortField) => {
      let newOrder: SortOrder
      if (sortField === field) {
        newOrder = sortOrder === "asc" ? "desc" : "asc"
        setSortOrder(newOrder)
      } else {
        newOrder = "asc"
        setSortField(field)
        setSortOrder(newOrder)
      }
      updateSortConfig(field, newOrder)
    },
    [sortField, sortOrder, updateSortConfig]
  )

  const sortedData = useMemo(() => {
    const comparator = createDynamicSortComparator(
      sortingPriorityConfig,
      detectedAccount,
      sortField,
      currencyType,
      sortOrder
    )
    return [...displayData].sort(comparator)
  }, [
    displayData,
    sortingPriorityConfig,
    detectedAccount,
    sortField,
    currencyType,
    sortOrder
  ])

  const value = useMemo(
    () => ({
      accounts,
      displayData,
      sortedData,
      stats,
      lastUpdateTime,
      isInitialLoad,
      isRefreshing,
      prevTotalConsumption,
      prevBalances,
      detectedAccount,
      isDetecting,
      loadAccountData,
      handleRefresh,
      handleSort,
      sortField,
      sortOrder
    }),
    [
      accounts,
      displayData,
      sortedData,
      stats,
      lastUpdateTime,
      isInitialLoad,
      isRefreshing,
      prevTotalConsumption,
      prevBalances,
      detectedAccount,
      isDetecting,
      loadAccountData,
      handleRefresh,
      handleSort,
      sortField,
      sortOrder
    ]
  )

  return (
    <AccountDataContext.Provider value={value}>
      {children}
    </AccountDataContext.Provider>
  )
}

// 4. 创建自定义 Hook
export const useAccountDataContext = () => {
  const context = useContext(AccountDataContext)
  if (
    context === undefined ||
    !context.loadAccountData ||
    !context.handleRefresh ||
    !context.handleSort
  ) {
    throw new Error(
      "useAccountDataContext must be used within a AccountDataProvider and have all required functions"
    )
  }
  return context
}
