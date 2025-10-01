import React from "react"

import type { DisplaySiteData } from "~/types"

import { CopyDropdown } from "./CopyDropdown"
import { MoreActionsDropdown } from "./MoreActionsDropdown"
import { RefreshButton } from "./RefreshButton"

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
  return (
    <div className="flex items-center space-x-2 flex-shrink-0">
      <RefreshButton
        site={site}
        refreshingAccountId={refreshingAccountId}
        onRefreshAccount={onRefreshAccount}
      />

      <CopyDropdown
        site={site}
        onCopyUrl={onCopyUrl}
        onViewKeys={onViewKeys}
        onCopyKey={onCopyKey}
      />

      <MoreActionsDropdown
        site={site}
        onViewUsage={onViewUsage}
        onViewModels={onViewModels}
        onEditAccount={onEditAccount}
        onDeleteAccount={onDeleteAccount}
      />
    </div>
  )
}
