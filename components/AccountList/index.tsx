import {
  ChevronDownIcon,
  ChevronUpIcon,
  InboxIcon
} from "@heroicons/react/24/outline"
import { useState } from "react"

import type {
  CurrencyAmountMap,
  CurrencyType,
  DisplaySiteData,
  SortField,
  SortOrder
} from "~/types"

import CopyKeyDialog from "../CopyKeyDialog"
import DelAccountDialog from "../DelAccountDialog"
import AccountListItem from "./AccountListItem"

interface AccountListProps {
  // 数据
  sites: DisplaySiteData[]
  currencyType: CurrencyType

  // 排序状态
  sortField: SortField
  sortOrder: SortOrder

  // 动画相关
  isInitialLoad: boolean
  prevBalances: CurrencyAmountMap

  // 刷新状态
  refreshingAccountId?: string | null
  detectedAccountId?: string | null

  // 事件处理
  onSort: (field: SortField) => void
  onAddAccount: () => void
  onRefreshAccount?: (site: DisplaySiteData) => Promise<void>
  onCopyUrl?: (site: DisplaySiteData) => void
  onViewUsage?: (site: DisplaySiteData) => void
  onViewModels?: () => void
  onEditAccount?: (site: DisplaySiteData) => void
  onDeleteAccount?: (site: DisplaySiteData) => void
  onViewKeys?: () => void
}

export default function AccountList({
  sites,
  currencyType,
  sortField,
  sortOrder,
  isInitialLoad,
  prevBalances,
  refreshingAccountId,
  detectedAccountId,
  onSort,
  onAddAccount,
  onRefreshAccount,
  onCopyUrl,
  onViewUsage,
  onViewModels,
  onEditAccount,
  onDeleteAccount,
  onViewKeys
}: AccountListProps) {
  const [deleteDialogAccount, setDeleteDialogAccount] =
    useState<DisplaySiteData | null>(null)
  const [copyKeyDialogAccount, setCopyKeyDialogAccount] =
    useState<DisplaySiteData | null>(null)

  const handleDeleteWithDialog = (site: DisplaySiteData) => {
    setDeleteDialogAccount(site)
  }

  const handleCopyKeyWithDialog = (site: DisplaySiteData) => {
    setCopyKeyDialogAccount(site)
  }
  if (sites.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <InboxIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <p className="text-gray-500 text-sm mb-4">暂无站点账号</p>
        <button
          onClick={onAddAccount}
          className="px-6 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm">
          添加第一个站点账号
        </button>
      </div>
    )
  }

  const renderSortButton = (field: SortField, label: string) => (
    <button
      onClick={() => onSort(field)}
      className="flex items-center space-x-1 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors">
      <span>{label}</span>
      {sortField === field &&
        (sortOrder === "asc" ? (
          <ChevronUpIcon className="w-3 h-3" />
        ) : (
          <ChevronDownIcon className="w-3 h-3" />
        ))}
    </button>
  )

  return (
    <div className="flex flex-col">
      {/* 表头 */}
      <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <div className="flex-1">{renderSortButton("name", "账号")}</div>
          <div className="text-right flex-shrink-0">
            <div className="flex items-center space-x-1">
              {renderSortButton("balance", "余额")}
              <span className="text-xs text-gray-400">/</span>
              {renderSortButton("consumption", "今日消耗")}
            </div>
          </div>
        </div>
      </div>

      {/* 账号列表 */}
      {sites.map((site) => (
        <AccountListItem
          key={site.id}
          site={site}
          currencyType={currencyType}
          isInitialLoad={isInitialLoad}
          prevBalances={prevBalances}
          refreshingAccountId={refreshingAccountId}
          detectedAccountId={detectedAccountId}
          onRefreshAccount={onRefreshAccount}
          onCopyUrl={onCopyUrl}
          onViewKeys={onViewKeys}
          onViewModels={onViewModels}
          onViewUsage={onViewUsage}
          onEditAccount={onEditAccount}
          onDeleteAccount={() => handleDeleteWithDialog(site)}
          onCopyKey={() => handleCopyKeyWithDialog(site)}
        />
      ))}

      {/* 删除账号确认对话框 */}
      <DelAccountDialog
        isOpen={deleteDialogAccount !== null}
        onClose={() => setDeleteDialogAccount(null)}
        account={deleteDialogAccount}
        onDeleted={() => {
          onDeleteAccount?.(deleteDialogAccount!)
          setDeleteDialogAccount(null)
        }}
      />

      {/* 复制密钥对话框 */}
      <CopyKeyDialog
        isOpen={copyKeyDialogAccount !== null}
        onClose={() => setCopyKeyDialogAccount(null)}
        account={copyKeyDialogAccount}
      />
    </div>
  )
}
