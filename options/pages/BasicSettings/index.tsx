import { useEffect, useState } from "react"
import toast from "react-hot-toast"

import { useUserPreferences } from "~/hooks/useUserPreferences"
import DangerousZone from "~/options/pages/BasicSettings/DangerousZone"
import DisplaySettings from "~/options/pages/BasicSettings/DisplaySettings"
import LoadingSkeleton from "~/options/pages/BasicSettings/LoadingSkeleton"
import RefreshSettings from "~/options/pages/BasicSettings/RefreshSettings"
import SettingsHeader from "~/options/pages/BasicSettings/SettingsHeader"
import type { BalanceType, CurrencyType } from "~/types"

export default function BasicSettings() {
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
    resetToDefaults
  } = useUserPreferences()

  // 从偏好设置中获取值，或使用默认值
  const autoRefresh = preferences?.autoRefresh ?? true
  const refreshInterval = preferences?.refreshInterval ?? 360
  const minRefreshInterval = preferences?.minRefreshInterval ?? 60
  const refreshOnOpen = preferences?.refreshOnOpen ?? true

  // 本地状态用于输入框编辑
  const [intervalInput, setIntervalInput] = useState<string>(
    refreshInterval.toString()
  )
  const [minIntervalInput, setMinIntervalInput] = useState<string>(
    minRefreshInterval.toString()
  )

  // 同步刷新间隔值到输入框
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
      // 通知后台更新设置
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
    // 直接更新输入框状态，允许用户清空和编辑
    setIntervalInput(value)
  }

  const handleRefreshIntervalBlur = async () => {
    const interval = Number(intervalInput)

    // 验证输入值
    if (!intervalInput || isNaN(interval) || interval < 10) {
      toast.error("刷新间隔必须大于等于10秒")
      setIntervalInput(refreshInterval.toString()) // 恢复原值
      return
    }

    // 保存设置
    const success = await updateRefreshInterval(interval)
    if (success) {
      // 通知后台更新设置
      chrome.runtime.sendMessage({
        action: "updateAutoRefreshSettings",
        settings: { refreshInterval: interval }
      })
      toast.success(`刷新间隔已设置为 ${interval} 秒`)
    } else {
      toast.error("设置保存失败")
      setIntervalInput(refreshInterval.toString()) // 恢复原值
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

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="p-6">
      <SettingsHeader />

      <div className="space-y-6">
        <DisplaySettings
          currencyType={currencyType}
          activeTab={activeTab}
          handleCurrencyChange={handleCurrencyChange}
          handleDefaultTabChange={handleDefaultTabChange}
        />

        <RefreshSettings
          autoRefresh={autoRefresh}
          refreshOnOpen={refreshOnOpen}
          intervalInput={intervalInput}
          minIntervalInput={minIntervalInput}
          handleAutoRefreshChange={handleAutoRefreshChange}
          handleRefreshOnOpenChange={handleRefreshOnOpenChange}
          handleRefreshIntervalChange={handleRefreshIntervalChange}
          handleRefreshIntervalBlur={handleRefreshIntervalBlur}
          handleMinRefreshIntervalChange={handleMinRefreshIntervalChange}
          handleMinRefreshIntervalBlur={handleMinRefreshIntervalBlur}
        />

        <DangerousZone handleResetToDefaults={handleResetToDefaults} />
      </div>
    </div>
  )
}
