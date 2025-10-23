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
import { useTranslation } from "react-i18next"

import { IconButton } from "~/components/ui"
import { useAccountActionsContext } from "~/features/AccountManagement/hooks/AccountActionsContext"
import { useDialogStateContext } from "~/features/AccountManagement/hooks/DialogStateContext"
import { fetchAccountTokens } from "~/services/apiService"
import type { DisplaySiteData } from "~/types"
import { getErrorMessage } from "~/utils/error"
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
  const { t } = useTranslation("account")
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
          toast.success(t("actions.keyCopied"))
        } else if (tokensResponse.length > 1) {
          // Multiple tokens - open dialog
          onCopyKey(site)
        } else {
          // No tokens found
          toast.error(t("actions.noKeyFound"))
        }
      } else {
        console.warn("Token response is not an array:", tokensResponse)
        toast.error(t("actions.fetchKeyInfoFailed"))
      }
    } catch (error) {
      console.error("Failed to fetch key list:", error)
      const errorMessage = getErrorMessage(error)
      toast.error(t("actions.fetchKeyListFailed", { errorMessage }))
      // Fallback to opening dialog
      onCopyKey(site)
    } finally {
      setIsCheckingTokens(false)
    }
  }

  const handleCopyUrlLocal = async () => {
    await navigator.clipboard.writeText(site.baseUrl)
    toast.success(t("actions.urlCopied"))
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

  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      {/* Primary Level - Three standalone buttons */}
      <IconButton
        onClick={handleCopyUrlLocal}
        variant="ghost"
        size="sm"
        className="touch-manipulation"
        aria-label={t("actions.copyUrl")}
        title={t("actions.copyUrl")}>
        <LinkIcon className="w-4 h-4" />
      </IconButton>

      <IconButton
        onClick={handleSmartCopyKey}
        variant="ghost"
        size="sm"
        className="touch-manipulation"
        disabled={isCheckingTokens}
        aria-label={t("actions.copyKey")}
        title={t("actions.copyKey")}>
        <KeyIcon className="w-4 h-4" />
      </IconButton>

      <IconButton
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          openEditAccount(site)
        }}
        variant="ghost"
        size="sm"
        className="touch-manipulation"
        aria-label={t("actions.edit")}
        title={t("actions.edit")}>
        <PencilIcon className="w-4 h-4" />
      </IconButton>

      {/* Secondary Level - Dropdown menu */}
      <Menu as="div" className="relative">
        <MenuButton
          as={IconButton}
          variant="ghost"
          size="sm"
          className="touch-manipulation"
          aria-label={t("actions.more")}>
          <EllipsisHorizontalIcon className="w-4 h-4" />
        </MenuButton>

        <MenuItems
          anchor="bottom end"
          className="z-50 bg-white dark:bg-dark-bg-secondary rounded-lg shadow-lg border border-gray-200 dark:border-dark-bg-tertiary py-1 focus:outline-none [--anchor-gap:4px] [--anchor-padding:8px]">
          {/* Secondary Menu Items */}
          <AccountActionMenuItem
            onClick={handleOpenKeyList}
            icon={ListBulletIcon}
            label={t("actions.keyList")}
          />

          <AccountActionMenuItem
            onClick={handleNavigateToKeyManagement}
            icon={KeyIcon}
            label={t("actions.keyManagement")}
          />

          <AccountActionMenuItem
            onClick={handleNavigateToModelManagement}
            icon={CpuChipIcon}
            label={t("actions.modelManagement")}
          />

          <hr className="my-1 border-gray-200 dark:border-dark-bg-tertiary" />

          <AccountActionMenuItem
            onClick={handleRefreshLocal}
            icon={ArrowPathIcon}
            label={t("actions.refresh")}
            disabled={refreshingAccountId === site.id}
          />

          <AccountActionMenuItem
            onClick={handleDeleteLocal}
            icon={TrashIcon}
            label={t("actions.delete")}
            isDestructive={true}
          />
        </MenuItems>
      </Menu>
    </div>
  )
}
