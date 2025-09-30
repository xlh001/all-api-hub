import "./style.css"

import { useCallback, useEffect, useMemo, useState } from "react"
import toast, { Toaster } from "react-hot-toast"

import AccountList from "../components/AccountList"
import ActionButtons from "../components/ActionButtons"
import AddAccountDialog from "../components/AddAccountDialog"
import BalanceSection from "../components/BalanceSection"
import EditAccountDialog from "../components/EditAccountDialog"
import FirefoxAddAccountWarningDialog from "../components/FirefoxAddAccountWarningDialog"
import HeaderSection from "../components/HeaderSection"
import { UI_CONSTANTS } from "../constants/ui"
import { useAccountData } from "../hooks/useAccountData"
import { useAccountActions } from "../hooks/useAccountActions"
import { usePopupManager } from "../hooks/usePopupManager"
import {
  openFullManagerPage,
  openKeysPage,
  openModelsPage,
  openSettingsPage,
  openSidePanel,
  openUsagePage
} from "../utils/navigation"
import { useSort } from "../hooks/useSort"
import { useUserPreferences } from "../hooks/useUserPreferences"
import { accountStorage } from "../services/accountStorage"
import type { SiteAccount } from "../types"
import { isFirefox } from "../utils/browser"
import {
  calculateTotalBalance,
  calculateTotalConsumption,
  getOppositeCurrency
} from "../utils/formatters"


function IndexPopup({ inSidePanel = false }) {
  // 用户偏好设置管理
  const {
    preferences,
    isLoading: preferencesLoading,
    activeTab,
    currencyType,
    sortField,
    sortOrder,
    updateActiveTab,
    updateCurrencyType,
    updateSortConfig
  } = useUserPreferences()

  const [detectedAccount, setDetectedAccount] = useState<SiteAccount | null>(null)

  // 核心数据管理
  const {
    accounts,
    displayData,
    stats,
    lastUpdateTime,
    isInitialLoad,
    isRefreshing,
    prevTotalConsumption,
    prevBalances,
    loadAccountData,
    handleRefresh
  } = useAccountData()

  // 弹窗与模态框管理
  const {
    isAddAccountOpen,
    isEditAccountOpen,
    isFirefoxWarningOpen,
    editingAccount,
    openAddAccount,
    closeAddAccount,
    openEditAccount,
    closeEditAccount,
    openFirefoxWarning,
    closeFirefoxWarning
  } = usePopupManager(loadAccountData)

  // 账号操作逻辑
  const {
    refreshingAccountId,
    handleRefreshAccount,
    handleDeleteAccount,
    handleCopyUrl
  } = useAccountActions(loadAccountData)


  // 排序管理
  const {
    sortField: currentSortField,
    sortOrder: currentSortOrder,
    sortedData,
    handleSort
  } = useSort(
    displayData,
    currencyType,
    sortField,
    sortOrder,
    updateSortConfig,
    detectedAccount?.id
  )

  // 计算数据 - 使用 useMemo 缓存
  const totalConsumption = useMemo(
    () => calculateTotalConsumption(stats, accounts),
    [stats, accounts]
  )

  const totalBalance = useMemo(
    () => calculateTotalBalance(displayData),
    [displayData]
  )

  const todayTokens = useMemo(
    () => ({
      upload: stats.today_total_prompt_tokens,
      download: stats.today_total_completion_tokens
    }),
    [stats.today_total_prompt_tokens, stats.today_total_completion_tokens]
  )

  // 事件处理 - 使用 useCallback 优化
  const handleCurrencyToggle = useCallback(async () => {
    const newCurrency = getOppositeCurrency(currencyType)
    await updateCurrencyType(newCurrency)
  }, [currencyType, updateCurrencyType])

  const handleTabChange = useCallback(
    async (index: number) => {
      const newTab = index === 0 ? "consumption" : "balance"
      await updateActiveTab(newTab)
    },
    [updateActiveTab]
  )

  const handleAddAccount = useCallback(() => {
    if (isFirefox() && !inSidePanel) {
      openFirefoxWarning()
    } else {
      openAddAccount()
    }
  }, [inSidePanel, openFirefoxWarning, openAddAccount])

  const handleGlobalRefresh = useCallback(async () => {
    try {
      await toast.promise(handleRefresh(), {
        loading: "正在刷新所有账号...",
        success: (result) => {
          if (result.failed > 0) {
            return `刷新完成：${result.success} 个成功，${result.failed} 个失败`
          }
          return "所有账号刷新成功!"
        },
        error: "刷新失败，请稍后重试"
      })
    } catch (error) {
      console.error("刷新时出错:", error)
    }
  }, [handleRefresh])

  // 处理打开插件时自动刷新
  useEffect(() => {
    let hasTriggered = false // 防止重复触发

    const handleRefreshOnOpen = async () => {
      // 等待偏好设置加载完成
      if (preferencesLoading || !preferences || hasTriggered) {
        return
      }

      // 检查是否启用了打开插件时自动刷新
      if (preferences.refreshOnOpen) {
        hasTriggered = true
        console.log("[Popup] 打开插件时自动刷新已启用，开始刷新")
        try {
          await handleRefresh()
          console.log("[Popup] 打开插件时自动刷新完成")
        } catch (error) {
          console.error("[Popup] 打开插件时自动刷新失败:", error)
        }
      }
    }

    handleRefreshOnOpen()
  }, [preferencesLoading, preferences?.refreshOnOpen]) // 只依赖必要的属性

  // 监听后台自动刷新的更新通知
  useEffect(() => {
    const handleBackgroundRefreshUpdate = (message: any) => {
      if (message.type === "AUTO_REFRESH_UPDATE") {
        const { type, data } = message.payload

        if (type === "refresh_completed") {
          console.log("[Popup] 后台刷新完成，重新加载数据")
          loadAccountData() // 重新加载数据以更新UI
        } else if (type === "refresh_error") {
          console.error("[Popup] 后台刷新失败:", data.error)
        }
      }
    }

    chrome.runtime.onMessage.addListener(handleBackgroundRefreshUpdate)

    return () => {
      chrome.runtime.onMessage.removeListener(handleBackgroundRefreshUpdate)
    }
  }, [loadAccountData])

  // 当 popup 打开时，自动检测当前 URL 是否已添加
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]?.url) {
        try {
          const existingAccount = await accountStorage.checkUrlExists(tabs[0].url);
          if (existingAccount) {
            setDetectedAccount(existingAccount);
            console.log('检测到已存在的账号:', existingAccount.site_name);
          }
        } catch (error) {
          console.error('检测已存在账号时出错:', error);
        }
      }
    });
  }, []);

  return (
    <div
      className={`${!inSidePanel && UI_CONSTANTS.POPUP.WIDTH} bg-white flex flex-col ${!inSidePanel && UI_CONSTANTS.POPUP.HEIGHT}`}>
      {/* 顶部导航栏 */}
      <HeaderSection
        isRefreshing={isRefreshing}
        onRefresh={handleGlobalRefresh}
        onOpenTab={openFullManagerPage}
        onOpenSettings={openSettingsPage}
      />

      {/* 滚动内容区域 */}
      <div className="flex-1 overflow-y-auto">
        {/* 基本信息展示 */}
        {!preferencesLoading && (
          <BalanceSection
            totalConsumption={totalConsumption}
            totalBalance={totalBalance}
            todayTokens={todayTokens}
            currencyType={currencyType}
            activeTab={activeTab}
            isInitialLoad={isInitialLoad}
            lastUpdateTime={lastUpdateTime}
            prevTotalConsumption={prevTotalConsumption}
            detectedAccountName={detectedAccount?.site_name}
            onCurrencyToggle={handleCurrencyToggle}
            onTabChange={handleTabChange}
          />
        )}

        {/* 操作按钮组 */}
        <ActionButtons
          onAddAccount={handleAddAccount}
          onViewKeys={() => openKeysPage()}
          onViewModels={() => openModelsPage()}
        />

        {/* 站点账号列表 */}
        <AccountList
          sites={sortedData}
          currencyType={currencyType}
          sortField={currentSortField}
          sortOrder={currentSortOrder}
          isInitialLoad={isInitialLoad}
          prevBalances={prevBalances}
          refreshingAccountId={refreshingAccountId}
          detectedAccountId={detectedAccount?.id}
          onSort={handleSort}
          onAddAccount={handleAddAccount}
          onRefreshAccount={handleRefreshAccount}
          onCopyUrl={handleCopyUrl}
          onViewKeys={openKeysPage}
          onViewModels={openModelsPage}
          onViewUsage={openUsagePage}
          onEditAccount={openEditAccount}
          onDeleteAccount={handleDeleteAccount}
        />
      </div>

      {/* 新增账号弹窗 */}
      <AddAccountDialog
        isOpen={isAddAccountOpen}
        onClose={closeAddAccount}
        isCurrentSiteAdded={!!detectedAccount}
        onEditAccount={openEditAccount}
        detectedAccount={displayData.find(acc => acc.id === detectedAccount?.id) ?? null}
      />

      {/* 编辑账号弹窗 */}
      <EditAccountDialog
        isOpen={isEditAccountOpen}
        onClose={closeEditAccount}
        account={editingAccount}
      />

      {/* Firefox 警告弹窗 */}
      <FirefoxAddAccountWarningDialog
        isOpen={isFirefoxWarningOpen}
        onClose={closeFirefoxWarning}
        onConfirm={openSidePanel}
      />

      {/* Toast通知组件 */}
      <Toaster position="bottom-center" reverseOrder={true} />
    </div>
  )
}

export default IndexPopup
