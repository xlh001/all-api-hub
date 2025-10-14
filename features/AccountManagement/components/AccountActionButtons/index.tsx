import { Menu, MenuButton, MenuItems } from "@headlessui/react"
import {
  ArrowPathIcon,
  CpuChipIcon,
  EllipsisHorizontalIcon,
  KeyIcon,
  LinkIcon,
  ListBulletIcon,
  PencilIcon,
  TrashIcon
} from "@heroicons/react/24/outline"
import React, { useState } from "react"
import toast from "react-hot-toast"

import { useAccountActionsContext } from "~/features/AccountManagement/hooks/AccountActionsContext"
import { useDialogStateContext } from "~/features/AccountManagement/hooks/DialogStateContext"
import { fetchAccountTokens } from "~/services/apiService"
import type { DisplaySiteData } from "~/types"
import { openKeysPage, openModelsPage } from "~/utils/navigation"

import { AccountActionMenuItem } from "./AccountActionMenuItem"

export interface ActionButtonsProps {
  site: DisplaySiteData
  onCopyKey: (site: DisplaySiteData) => void
  onDeleteAccount: (site: DisplaySiteData) => void
}

export default function AccountActionButtons({
  site,
  onCopyKey,
  onDeleteAccount
}: ActionButtonsProps) {
  const { refreshingAccountId, handleRefreshAccount } =
    useAccountActionsContext()
  const { openEditAccount } = useDialogStateContext()
  const [isCheckingTokens, setIsCheckingTokens] = useState(false)

  // Smart copy key logic - check token count before deciding action
  const handleSmartCopyKey = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isCheckingTokens) return

    setIsCheckingTokens(true)

    try {
      // Fetch tokens to check count
      const tokensResponse = await fetchAccountTokens(site)

      if (Array.isArray(tokensResponse)) {
        if (tokensResponse.length === 1) {
          // Single token - copy directly
          const token = tokensResponse[0]
          const textToCopy = token.key.startsWith("sk-")
            ? token.key
            : "sk-" + token.key
          await navigator.clipboard.writeText(textToCopy)
          toast.success("密钥已复制到剪贴板")
        } else if (tokensResponse.length > 1) {
          // Multiple tokens - open dialog
          onCopyKey(site)
        } else {
          // No tokens found
          toast.error("未找到可用密钥")
        }
      } else {
        console.warn("Token response is not an array:", tokensResponse)
        toast.error("获取密钥信息失败")
      }
    } catch (error) {
      console.error("获取密钥列表失败:", error)
      const errorMessage = getErrorMessage(error)
      toast.error(`获取密钥列表失败: ${errorMessage}`)
      // Fallback to opening dialog
      onCopyKey(site)
    } finally {
      setIsCheckingTokens(false)
    }
  }

  const handleCopyUrlLocal = async () => {
    await navigator.clipboard.writeText(site.baseUrl)
    toast.success("网址已复制到剪贴板")
  }

  // Navigation functions for secondary menu items
  const handleNavigateToKeyManagement = () => {
    openKeysPage(site.id)
  }

  const handleNavigateToModelManagement = () => {
    openModelsPage(site.id)
  }

  const handleOpenKeyList = () => {
    onCopyKey(site)
  }

  const handleRefreshLocal = () => {
    handleRefreshAccount(site)
  }

  const handleDeleteLocal = () => {
    onDeleteAccount(site)
  }

  const primaryButtonClasses =
    "flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-colors mr-1"

  return (
    <div className="flex items-center flex-shrink-0">
      {/* Primary Level - Three standalone buttons */}
      <button
        onClick={handleCopyUrlLocal}
        className={primaryButtonClasses}
        title="复制网址">
        <LinkIcon className="w-4 h-4 text-gray-500 dark:text-dark-text-secondary" />
      </button>
      <button
        onClick={handleSmartCopyKey}
        className={primaryButtonClasses}
        disabled={isCheckingTokens}
        title="复制密钥">
        <KeyIcon
          className={`w-4 h-4 text-gray-500 dark:text-dark-text-secondary ${isCheckingTokens ? "opacity-50" : ""}`}
        />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          openEditAccount(site)
        }}
        className={primaryButtonClasses}
        title="编辑">
        <PencilIcon className="w-4 h-4 text-gray-500 dark:text-dark-text-secondary" />
      </button>

      {/* Secondary Level - Dropdown menu */}
      <Menu as="div" className="relative">
        <MenuButton className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-colors">
          <EllipsisHorizontalIcon className="w-4 h-4 text-gray-500 dark:text-dark-text-secondary" />
        </MenuButton>
        <MenuItems
          anchor="bottom end"
          className="z-50 bg-white dark:bg-dark-bg-secondary rounded-lg shadow-lg border border-gray-200 dark:border-dark-bg-tertiary py-1 focus:outline-none [--anchor-gap:4px] [--anchor-padding:8px]">
          {/* Secondary Menu Items */}
          <AccountActionMenuItem
            onClick={handleOpenKeyList}
            icon={ListBulletIcon}
            label="密钥列表"
          />

          <AccountActionMenuItem
            onClick={handleNavigateToKeyManagement}
            icon={KeyIcon}
            label="密钥管理"
          />

          <AccountActionMenuItem
            onClick={handleNavigateToModelManagement}
            icon={CpuChipIcon}
            label="模型管理"
          />

          <hr />

          <AccountActionMenuItem
            onClick={handleRefreshLocal}
            icon={ArrowPathIcon}
            label="刷新"
            disabled={refreshingAccountId === site.id}
          />

          <AccountActionMenuItem
            onClick={handleDeleteLocal}
            icon={TrashIcon}
            label="删除"
            isDestructive={true}
          />
        </MenuItems>
      </Menu>
    </div>
  )
}
