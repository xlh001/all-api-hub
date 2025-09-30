import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import {
  ArrowPathIcon,
  ChartPieIcon,
  CpuChipIcon,
  DocumentDuplicateIcon,
  EllipsisHorizontalIcon,
  KeyIcon,
  PencilIcon,
  TrashIcon
} from "@heroicons/react/24/outline"

import { useAccountListItem } from "../hooks/useAccountListItem"
import type { DisplaySiteData } from "../types"
import BalanceDisplay from "./BalanceDisplay"
import SiteInfo from "./SiteInfo"
import Tooltip from "./Tooltip"

interface AccountListItemProps {
  site: DisplaySiteData
  currencyType: "USD" | "CNY"
  isInitialLoad: boolean
  prevBalances: { [id: string]: { USD: number; CNY: number } }
  refreshingAccountId?: string | null
  detectedAccountId?: string | null
  onRefreshAccount?: (site: DisplaySiteData) => Promise<void>
  onCopyUrl?: (site: DisplaySiteData) => void
  onViewUsage?: (site: DisplaySiteData) => void
  onViewModels?: (site: DisplaySiteData) => void
  onEditAccount?: (site: DisplaySiteData) => void
  onDeleteAccount?: (site: DisplaySiteData) => void
  onViewKeys?: (site: DisplaySiteData) => void
  onCopyKey: (site: DisplaySiteData) => void
}

export default function AccountListItem({
  site,
  currencyType,
  isInitialLoad,
  prevBalances,
  refreshingAccountId,
  detectedAccountId,
  onRefreshAccount,
  onCopyUrl,
  onViewUsage,
  onViewModels,
  onEditAccount,
  onDeleteAccount,
  onViewKeys,
  onCopyKey
}: AccountListItemProps) {
  const { hoveredSiteId, handleMouseEnter, handleMouseLeave } =
    useAccountListItem()

  const handleCopyUrlLocal = () => {
    navigator.clipboard.writeText(site.baseUrl)
    onCopyUrl?.(site)
  }

  return (
    <div
      className={`px-5 py-4 border-b border-gray-50 transition-colors relative group ${
        site.id === detectedAccountId ? "bg-blue-50" : "hover:bg-gray-25"
      }`}
      onMouseEnter={() => handleMouseEnter(site.id)}
      onMouseLeave={handleMouseLeave}>
      <div className="flex items-center space-x-4">
        <SiteInfo site={site} detectedAccountId={detectedAccountId} />

        {/* 按钮组 - 只在 hover 时显示 */}
        {hoveredSiteId === site.id && (
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* 刷新按钮 */}
            <Tooltip content="刷新账号" position="top">
              <button
                onClick={() => onRefreshAccount?.(site)}
                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
                disabled={refreshingAccountId === site.id}>
                <ArrowPathIcon
                  className={`w-4 h-4 text-gray-500 ${
                    refreshingAccountId === site.id ? "animate-spin" : ""
                  }`}
                />
              </button>
            </Tooltip>

            {/* 复制下拉菜单 */}
            <Menu as="div" className="relative">
              <Tooltip content="复制" position="top">
                <MenuButton className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors">
                  <DocumentDuplicateIcon className="w-4 h-4 text-gray-500" />
                </MenuButton>
              </Tooltip>
              <MenuItems
                anchor="bottom end"
                className="z-50 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 focus:outline-none [--anchor-gap:4px] [--anchor-padding:8px]">
                <MenuItem>
                  <button
                    onClick={handleCopyUrlLocal}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:text-gray-900 data-focus:bg-gray-50 flex items-center space-x-2">
                    <DocumentDuplicateIcon className="w-4 h-4" />
                    <span>复制 URL</span>
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={() => onCopyKey(site)}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:text-gray-900 data-focus:bg-gray-50 flex items-center space-x-2">
                    <DocumentDuplicateIcon className="w-4 h-4" />
                    <span>复制密钥</span>
                  </button>
                </MenuItem>
                <hr />
                <MenuItem>
                  <button
                    onClick={() => onViewKeys?.(site)}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:text-gray-900 data-focus:bg-gray-50 flex items-center space-x-2">
                    <KeyIcon className="w-4 h-4" />
                    <span>管理密钥</span>
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>

            {/* 更多下拉菜单 */}
            <Menu as="div" className="relative">
              <MenuButton className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors">
                <EllipsisHorizontalIcon className="w-4 h-4 text-gray-500" />
              </MenuButton>
              <MenuItems
                anchor="bottom end"
                className="z-50 w-24 bg-white rounded-lg shadow-lg border border-gray-200 py-1 focus:outline-none [--anchor-gap:4px] [--anchor-padding:8px]">
                <MenuItem>
                  <button
                    onClick={() => onViewModels?.(site)}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:text-gray-900 data-focus:bg-gray-50 flex items-center space-x-2">
                    <CpuChipIcon className="w-4 h-4" />
                    <span>模型</span>
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={() => onViewUsage?.(site)}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:text-gray-900 data-focus:bg-gray-50 flex items-center space-x-2">
                    <ChartPieIcon className="w-4 h-4" />
                    <span>用量</span>
                  </button>
                </MenuItem>
                <hr />
                <MenuItem>
                  <button
                    onClick={() => onEditAccount?.(site)}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:text-gray-900 data-focus:bg-gray-50 flex items-center space-x-2">
                    <PencilIcon className="w-4 h-4" />
                    <span>编辑</span>
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={() => onDeleteAccount?.(site)}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:text-red-700 data-focus:bg-red-50 flex items-center space-x-2">
                    <TrashIcon className="w-4 h-4" />
                    <span>删除</span>
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        )}

        <BalanceDisplay
          site={site}
          currencyType={currencyType}
          isInitialLoad={isInitialLoad}
          prevBalances={prevBalances}
        />
      </div>
    </div>
  )
}
