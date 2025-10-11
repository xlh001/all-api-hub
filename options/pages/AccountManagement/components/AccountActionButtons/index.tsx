import React from "react"

import type { DisplaySiteData } from "~/types"
import { openKeysPage, openModelsPage, openUsagePage } from "~/utils/navigation"

import { CopyDropdown } from "./CopyDropdown"
import { MoreActionsDropdown } from "./MoreActionsDropdown"
import { RefreshButton } from "./RefreshButton"
import { useAccountActionsContext } from "~/options/pages/AccountManagement/hooks/AccountActionsContext"
import { useDialogStateContext } from "~/options/pages/AccountManagement/hooks/DialogStateContext"

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
  const { refreshingAccountId, handleRefreshAccount, handleCopyUrl } =
    useAccountActionsContext()
  const { openEditAccount } = useDialogStateContext()

  return (
    <div className="flex items-center flex-shrink-0">
      <RefreshButton
        site={site}
        refreshingAccountId={refreshingAccountId}
        onRefreshAccount={() => handleRefreshAccount(site)}
      />

      <CopyDropdown
        site={site}
        onCopyUrl={() => handleCopyUrl(site)}
        onViewKeys={() => openKeysPage(site.id)}
        onCopyKey={onCopyKey}
      />

      <MoreActionsDropdown
        site={site}
        onViewUsage={() => openUsagePage(site)}
        onViewModels={() => openModelsPage(site.id)}
        onEditAccount={() => openEditAccount(site)}
        onDeleteAccount={onDeleteAccount}
      />
    </div>
  )
}
