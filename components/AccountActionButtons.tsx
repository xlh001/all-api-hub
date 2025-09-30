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

import type { DisplaySiteData } from "../types"
import Tooltip from "./Tooltip"

export interface ActionButtonsProps {
  site: DisplaySiteData
  refreshingAccountId: string | null
  onRefreshAccount: (site: DisplaySiteData) => Promise<void>
  onCopyUrl: (site: DisplaySiteData) => void
  onViewUsage: (site: DisplaySiteData) => void
  onViewModels: (site: DisplaySiteData) => void
  onEditAccount: (site: DisplaySiteData) => void
  onDeleteAccount: (site: DisplaySiteData) => void
  onViewKeys: (site: DisplaySiteData) => void
  onCopyKey: (site: DisplaySiteData) => void
}

const menuItemClassName =
  "w-full px-3 py-2 text-left text-sm text-gray-700 hover:text-gray-900 data-focus:bg-gray-50 flex items-center space-x-2"
const destructiveMenuItemClassName =
  "w-full px-3 py-2 text-left text-sm text-red-600 hover:text-red-700 data-focus:bg-red-50 flex items-center space-x-2"

const AccountActionMenuItem = ({
  onClick,
  icon: Icon,
  label,
  isDestructive = false
}: {
  onClick: () => void
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  label: string
  isDestructive?: boolean
}) => (
  <MenuItem>
    <button
      onClick={onClick}
      className={
        isDestructive ? destructiveMenuItemClassName : menuItemClassName
      }>
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  </MenuItem>
)

export default function AccountActionButtons({
  site,
  refreshingAccountId,
  onRefreshAccount,
  onCopyUrl,
  onViewUsage,
  onViewModels,
  onEditAccount,
  onDeleteAccount,
  onViewKeys,
  onCopyKey
}: ActionButtonsProps) {
  const handleCopyUrlLocal = () => {
    navigator.clipboard.writeText(site.baseUrl)
    onCopyUrl(site)
  }

  return (
    <div className="flex items-center space-x-2 flex-shrink-0">
      {/* 刷新按钮 */}
      <Tooltip content="刷新账号" position="top">
        <button
          onClick={() => onRefreshAccount(site)}
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
          <AccountActionMenuItem
            onClick={handleCopyUrlLocal}
            icon={DocumentDuplicateIcon}
            label="复制 URL"
          />
          <AccountActionMenuItem
            onClick={() => onCopyKey(site)}
            icon={DocumentDuplicateIcon}
            label="复制密钥"
          />
          <hr />
          <AccountActionMenuItem
            onClick={() => onViewKeys(site)}
            icon={KeyIcon}
            label="管理密钥"
          />
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
          <AccountActionMenuItem
            onClick={() => onViewModels(site)}
            icon={CpuChipIcon}
            label="模型"
          />
          <AccountActionMenuItem
            onClick={() => onViewUsage(site)}
            icon={ChartPieIcon}
            label="用量"
          />
          <hr />
          <AccountActionMenuItem
            onClick={() => onEditAccount(site)}
            icon={PencilIcon}
            label="编辑"
          />
          <AccountActionMenuItem
            onClick={() => onDeleteAccount(site)}
            icon={TrashIcon}
            label="删除"
            isDestructive
          />
        </MenuItems>
      </Menu>
    </div>
  )
}
