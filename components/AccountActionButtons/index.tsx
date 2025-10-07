import React from "react"

import { useAccountActionsContext, useDialogStateContext } from "~/contexts"
import type { DisplaySiteData } from "~/types"
import { openKeysPage, openModelsPage, openUsagePage } from "~/utils/navigation"

import { CopyDropdown } from "./CopyDropdown"
import { MoreActionsDropdown } from "./MoreActionsDropdown"
import { RefreshButton } from "./RefreshButton"

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
    <div className="flex items-center space-x-2 flex-shrink-0">
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
