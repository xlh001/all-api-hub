import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react"
import toast from "react-hot-toast"

import { useUserPreferences } from "~/hooks/useUserPreferences"
import type { UserPreferences } from "~/services/userPreferences"
import type { BalanceType, CurrencyType } from "~/types"

interface BasicSettingsContextType {
  preferences: UserPreferences | null
  isLoading: boolean
  currencyType: CurrencyType
  activeTab: BalanceType
  autoRefresh: boolean
  refreshOnOpen: boolean
  refreshInterval: number
  minRefreshInterval: number
  intervalInput: string
  minIntervalInput: string
  setIntervalInput: (value: string) => void
  setMinIntervalInput: (value: string) => void
  handleCurrencyChange: (currency: CurrencyType) => Promise<void>
  handleDefaultTabChange: (tab: BalanceType) => Promise<void>
  handleAutoRefreshChange: (enabled: boolean) => Promise<void>
  handleRefreshIntervalChange: (value: string) => Promise<void>
  handleRefreshIntervalBlur: () => Promise<void>
  handleRefreshOnOpenChange: (enabled: boolean) => Promise<void>
  handleMinRefreshIntervalChange: (value: string) => Promise<void>
  handleMinRefreshIntervalBlur: () => Promise<void>
  handleNewApiBaseUrlChange: (value: string) => Promise<void>
  handleNewApiAdminTokenChange: (value: string) => Promise<void>
  handleNewApiUserIdChange: (value: string) => Promise<void>
  handleResetToDefaults: () => Promise<void>
}

const BasicSettingsContext = createContext<
  BasicSettingsContextType | undefined
>(undefined)

export const BasicSettingsProvider = ({
  children
}: {
  children: ReactNode
}) => {
  const {
    preferences,
    isLoading,
    currencyType,
    activeTab,
    updateCurrencyType,
    updateActiveTab,
    updateAutoRefresh,
    updateRefreshInterval,
    updateMinRefreshInterval,
    updateRefreshOnOpen,
    resetToDefaults,
    updateNewApiBaseUrl,
    updateNewApiAdminToken,
    updateNewApiUserId
  } = useUserPreferences()

  const autoRefresh = preferences?.autoRefresh ?? true
  const refreshInterval = preferences?.refreshInterval ?? 360
  const minRefreshInterval = preferences?.minRefreshInterval ?? 60
  const refreshOnOpen = preferences?.refreshOnOpen ?? true

  const [intervalInput, setIntervalInput] = useState<string>(
    refreshInterval.toString()
  )
  const [minIntervalInput, setMinIntervalInput] = useState<string>(
    minRefreshInterval.toString()
  )

  useEffect(() => {
    setIntervalInput(refreshInterval.toString())
    setMinIntervalInput(minRefreshInterval.toString())
  }, [refreshInterval, minRefreshInterval])

  const handleCurrencyChange = async (currency: CurrencyType) => {
    const success = await updateCurrencyType(currency)
    if (success) {
      toast.success(
        `货币单位已切换到 ${currency === "USD" ? "美元" : "人民币"}`
      )
    } else {
      toast.error("设置保存失败")
    }
  }

  const handleDefaultTabChange = async (tab: BalanceType) => {
    const success = await updateActiveTab(tab)
    if (success) {
      toast.success(
        `默认标签页已设置为 ${tab === "consumption" ? "今日消耗" : "总余额"}`
      )
    } else {
      toast.error("设置保存失败")
    }
  }

  const handleAutoRefreshChange = async (enabled: boolean) => {
    const success = await updateAutoRefresh(enabled)
    if (success) {
      chrome.runtime.sendMessage({
        action: "updateAutoRefreshSettings",
        settings: { autoRefresh: enabled }
      })
      toast.success(`自动刷新已${enabled ? "启用" : "关闭"}`)
    } else {
      toast.error("设置保存失败")
    }
  }

  const handleRefreshIntervalChange = async (value: string) => {
    setIntervalInput(value)
  }

  const handleRefreshIntervalBlur = async () => {
    const interval = Number(intervalInput)
    if (!intervalInput || isNaN(interval) || interval < 10) {
      toast.error("刷新间隔必须大于等于10秒")
      setIntervalInput(refreshInterval.toString())
      return
    }

    const success = await updateRefreshInterval(interval)
    if (success) {
      chrome.runtime.sendMessage({
        action: "updateAutoRefreshSettings",
        settings: { refreshInterval: interval }
      })
      toast.success(`刷新间隔已设置为 ${interval} 秒`)
    } else {
      toast.error("设置保存失败")
      setIntervalInput(refreshInterval.toString())
    }
  }

  const handleRefreshOnOpenChange = async (enabled: boolean) => {
    const success = await updateRefreshOnOpen(enabled)
    if (success) {
      toast.success(`打开插件时自动刷新已${enabled ? "启用" : "关闭"}`)
    } else {
      toast.error("设置保存失败")
    }
  }

  const handleMinRefreshIntervalChange = async (value: string) => {
    setMinIntervalInput(value)
  }

  const handleMinRefreshIntervalBlur = async () => {
    const interval = Number(minIntervalInput)
    if (!minIntervalInput || isNaN(interval) || interval < 0) {
      toast.error("最小刷新间隔必须大于等于0秒")
      setMinIntervalInput(minRefreshInterval.toString())
      return
    }

    const success = await updateMinRefreshInterval(interval)
    if (success) {
      toast.success(`最小刷新间隔已设置为 ${interval} 秒`)
    } else {
      toast.error("设置保存失败")
      setMinIntervalInput(minRefreshInterval.toString())
    }
  }

  const handleNewApiBaseUrlChange = async (value: string) => {
    const success = await updateNewApiBaseUrl(value)
    if (success) {
      toast.success("New API Base URL 已更新")
    } else {
      toast.error("设置保存失败")
    }
  }

  const handleNewApiAdminTokenChange = async (value: string) => {
    const success = await updateNewApiAdminToken(value)
    if (success) {
      toast.success("New API Admin Token 已更新")
    } else {
      toast.error("设置保存失败")
    }
  }

  const handleNewApiUserIdChange = async (value: string) => {
    const success = await updateNewApiUserId(value)
    if (success) {
      toast.success("New API User ID 已更新")
    } else {
      toast.error("设置保存失败")
    }
  }

  const handleResetToDefaults = async () => {
    if (window.confirm("确定要重置所有设置到默认值吗？此操作不可撤销。")) {
      const success = await resetToDefaults()
      if (success) {
        toast.success("所有设置已重置为默认值")
      } else {
        toast.error("重置失败")
      }
    }
  }

  const value = {
    preferences,
    isLoading,
    currencyType,
    activeTab,
    autoRefresh,
    refreshOnOpen,
    refreshInterval,
    minRefreshInterval,
    intervalInput,
    minIntervalInput,
    setIntervalInput,
    setMinIntervalInput,
    handleCurrencyChange,
    handleDefaultTabChange,
    handleAutoRefreshChange,
    handleRefreshIntervalChange,
    handleRefreshIntervalBlur,
    handleRefreshOnOpenChange,
    handleMinRefreshIntervalChange,
    handleMinRefreshIntervalBlur,
    handleNewApiBaseUrlChange,
    handleNewApiAdminTokenChange,
    handleNewApiUserIdChange,
    handleResetToDefaults
  }

  return (
    <BasicSettingsContext.Provider value={value}>
      {children}
    </BasicSettingsContext.Provider>
  )
}

export const useBasicSettings = () => {
  const context = useContext(BasicSettingsContext)
  if (context === undefined) {
    throw new Error(
      "useBasicSettings must be used within a BasicSettingsProvider"
    )
  }
  return context
}
