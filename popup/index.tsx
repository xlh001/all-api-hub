import "./style.css"
import { useState, useCallback, useMemo } from "react"
import { UI_CONSTANTS } from "../constants/ui"
import { calculateTotalConsumption, calculateTotalBalance, getOppositeCurrency } from "../utils/formatters"
import { useAccountData } from "../hooks/useAccountData"
import { useSort } from "../hooks/useSort"
import HeaderSection from "../components/HeaderSection"
import BalanceSection from "../components/BalanceSection"
import ActionButtons from "../components/ActionButtons"
import AccountList from "../components/AccountList"
import AddAccountDialog from "../components/AddAccountDialog"
import EditAccountDialog from "../components/EditAccountDialog"
import type { DisplaySiteData } from "../types"

function IndexPopup() {
  // 状态管理
  const [currencyType, setCurrencyType] = useState<'USD' | 'CNY'>('USD')
  const [activeTab, setActiveTab] = useState<'consumption' | 'balance'>('consumption')
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false)
  const [isEditAccountOpen, setIsEditAccountOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<DisplaySiteData | null>(null)

  // 数据管理
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

  // 排序管理
  const { sortField, sortOrder, sortedData, handleSort } = useSort(displayData, currencyType)

  // 计算数据 - 使用 useMemo 缓存
  const totalConsumption = useMemo(() => 
    calculateTotalConsumption(stats, accounts), 
    [stats, accounts]
  )
  
  const totalBalance = useMemo(() => 
    calculateTotalBalance(displayData), 
    [displayData]
  )
  
  const todayTokens = useMemo(() => ({
    upload: stats.today_total_prompt_tokens,
    download: stats.today_total_completion_tokens
  }), [stats.today_total_prompt_tokens, stats.today_total_completion_tokens])

  // 事件处理 - 使用 useCallback 优化
  const handleCurrencyToggle = useCallback(() => {
    setCurrencyType(getOppositeCurrency(currencyType))
  }, [currencyType])

  const handleTabChange = useCallback((index: number) => {
    const newTab = index === 0 ? 'consumption' : 'balance'
    setActiveTab(newTab)
    console.log(`切换到${newTab === 'consumption' ? '今日消耗' : '总余额'}标签页`)
  }, [])

  const handleOpenTab = useCallback(() => {
    console.log('打开完整管理页面')
  }, [])

  const handleAddAccount = useCallback(() => {
    setIsAddAccountOpen(true)
  }, [])

  const handleCloseAddAccount = useCallback(() => {
    setIsAddAccountOpen(false)
    loadAccountData() // 重新加载数据
  }, [loadAccountData])

  const handleEditAccount = useCallback((account: DisplaySiteData) => {
    setEditingAccount(account)
    setIsEditAccountOpen(true)
    console.log('编辑账号:', account.name)
  }, [])

  const handleCloseEditAccount = useCallback(() => {
    setIsEditAccountOpen(false)
    setEditingAccount(null)
    loadAccountData() // 重新加载数据
  }, [loadAccountData])

  const handleDeleteAccount = useCallback((account: DisplaySiteData) => {
    console.log('删除账号:', account.name)
    loadAccountData() // 重新加载数据
  }, [loadAccountData])

  return (
    <div className={`${UI_CONSTANTS.POPUP.WIDTH} bg-white flex flex-col ${UI_CONSTANTS.POPUP.HEIGHT}`}>
      {/* 顶部导航栏 */}
      <HeaderSection
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        onOpenTab={handleOpenTab}
      />

      {/* 滚动内容区域 */}
      <div className="flex-1 overflow-y-auto">
        {/* 基本信息展示 */}
        <BalanceSection
          totalConsumption={totalConsumption}
          totalBalance={totalBalance}
          todayTokens={todayTokens}
          currencyType={currencyType}
          activeTab={activeTab}
          isInitialLoad={isInitialLoad}
          lastUpdateTime={lastUpdateTime}
          prevTotalConsumption={prevTotalConsumption}
          onCurrencyToggle={handleCurrencyToggle}
          onTabChange={handleTabChange}
        />

        {/* 操作按钮组 */}
        <ActionButtons onAddAccount={handleAddAccount} />

        {/* 站点账号列表 */}
        <AccountList
          sites={sortedData}
          currencyType={currencyType}
          sortField={sortField}
          sortOrder={sortOrder}
          isInitialLoad={isInitialLoad}
          prevBalances={prevBalances}
          onSort={handleSort}
          onAddAccount={handleAddAccount}
          onEditAccount={handleEditAccount}
          onDeleteAccount={handleDeleteAccount}
        />
      </div>

      {/* 新增账号弹窗 */}
      <AddAccountDialog 
        isOpen={isAddAccountOpen}
        onClose={handleCloseAddAccount}
      />
      
      {/* 编辑账号弹窗 */}
      <EditAccountDialog 
        isOpen={isEditAccountOpen}
        onClose={handleCloseEditAccount}
        account={editingAccount}
      />
    </div>
  )
}

export default IndexPopup
