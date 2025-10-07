import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react"

import {
  DATA_TYPE_BALANCE,
  DATA_TYPE_CONSUMPTION,
  UI_CONSTANTS
} from "~/constants/ui"
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

import { useUserPreferencesContext } from "./UserPreferencesContext"

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
  handleRefresh: () => Promise<{ success: number; failed: number }>
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
    updateSortConfig
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
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date())
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [prevTotalConsumption, setPrevTotalConsumption] =
    useState<CurrencyAmount>({ USD: 0, CNY: 0 })
  const [prevBalances, setPrevBalances] = useState<CurrencyAmountMap>({})
  const [sortField, setSortField] = useState<SortField>(
    initialSortField || UI_CONSTANTS.SORT.DEFAULT_FIELD
  )
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    initialSortOrder || UI_CONSTANTS.SORT.DEFAULT_ORDER
  )
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
      const allAccounts = await accountStorage.getAllAccounts()
      const accountStats = await accountStorage.getAccountStats()
      const displaySiteData = accountStorage.convertToDisplayData(allAccounts)

      if (!isInitialLoad) {
        setPrevTotalConsumption((stats) => ({
          USD: stats.today_total_consumption,
          CNY: stats.today_total_consumption
        }))
        setPrevBalances(
          displayData.reduce((acc, site) => {
            acc[site.id] = site.balance
            return acc
          }, {})
        )
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
  }, [isInitialLoad, displayData])

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const refreshResult = await accountStorage.refreshAllAccounts()
      await loadAccountData()
      setLastUpdateTime(new Date())
      return refreshResult
    } catch (error) {
      console.error("Failed to refresh data:", error)
      await loadAccountData()
      throw error
    } finally {
      setIsRefreshing(false)
    }
  }, [loadAccountData])

  useEffect(() => {
    loadAccountData()
    checkCurrentTab()
  }, [loadAccountData, checkCurrentTab])

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
    return [...displayData].sort((a, b) => {
      if (detectedAccount?.id) {
        if (a.id === detectedAccount.id) return -1
        if (b.id === detectedAccount.id) return 1
      }
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
            ? a.todayConsumption[currencyType] -
                b.todayConsumption[currencyType]
            : b.todayConsumption[currencyType] -
                a.todayConsumption[currencyType]
        default:
          return 0
      }
    })
  }, [displayData, sortField, sortOrder, currencyType, detectedAccount])

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
