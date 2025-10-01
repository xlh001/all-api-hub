import { UserIcon } from "@heroicons/react/24/outline"
import { useCallback, useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"

import AccountList from "~/components/AccountList"
import AddAccountDialog from "~/components/AddAccountDialog"
import EditAccountDialog from "~/components/EditAccountDialog"
import { showFirefoxWarningDialog } from "~/components/FirefoxAddAccountWarningDialog/showFirefoxWarningDialog"
import { useAccountActions } from "~/hooks/useAccountActions"
import { useAccountData } from "~/hooks/useAccountData"
import { usePopupManager } from "~/hooks/usePopupManager"
import { useSort } from "~/hooks/useSort"
import { useUserPreferences } from "~/hooks/useUserPreferences"
import { accountStorage } from "~/services/accountStorage"
import type { SiteAccount } from "~/types"
import { isFirefox } from "~/utils/browser"
import { openKeysPage, openModelsPage, openUsagePage } from "~/utils/navigation"

function AccountManagement({ inSidePanel = false }) {
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

  const [detectedAccount, setDetectedAccount] = useState<SiteAccount | null>(
    null
  )

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
    editingAccount,
    openAddAccount,
    closeAddAccount,
    openEditAccount,
    closeEditAccount
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

  const handleAddAccount = useCallback(() => {
    if (isFirefox() && !inSidePanel) {
      showFirefoxWarningDialog()
    } else {
      openAddAccount()
    }
  }, [inSidePanel, openAddAccount])

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
          const existingAccount = await accountStorage.checkUrlExists(
            tabs[0].url
          )
          if (existingAccount) {
            setDetectedAccount(existingAccount)
            console.log("检测到已存在的账号:", existingAccount.site_name)
          }
        } catch (error) {
          console.error("检测已存在账号时出错:", error)
        }
      }
    })
  }, [])

  return (
    <div className="p-6 bg-white flex flex-col">
      {/* 页面标题 */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <UserIcon className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-semibold text-gray-900">账户列表</h1>
        </div>
        <p className="text-gray-500">查看和管理站点账户</p>
      </div>
      {/* 滚动内容区域 */}
      <div className="flex-1 overflow-y-auto">
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
        detectedAccount={
          displayData.find((acc) => acc.id === detectedAccount?.id) ?? null
        }
      />

      {/* 编辑账号弹窗 */}
      <EditAccountDialog
        isOpen={isEditAccountOpen}
        onClose={closeEditAccount}
        account={editingAccount}
      />

      {/* Toast通知组件 */}
      <Toaster position="bottom-center" reverseOrder={true} />
    </div>
  )
}

export default AccountManagement
