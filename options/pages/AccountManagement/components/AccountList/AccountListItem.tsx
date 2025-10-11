import React from "react"

import AccountActionButtons from "~/options/pages/AccountManagement/components/AccountActionButtons"
import { useAccountListItem } from "~/options/pages/AccountManagement/components/AccountList/useAccountListItem"
import type { DisplaySiteData } from "~/types"

import BalanceDisplay from "./BalanceDisplay"
import SiteInfo from "./SiteInfo"
import { useAccountDataContext } from "~/options/pages/AccountManagement/hooks/AccountDataContext"

interface AccountListItemProps {
  site: DisplaySiteData
  onCopyKey: (site: DisplaySiteData) => void
  onDeleteWithDialog: (site: DisplaySiteData) => void
}

const AccountListItem: React.FC<AccountListItemProps> = React.memo(
  ({ site, onCopyKey, onDeleteWithDialog }) => {
    const { detectedAccount } = useAccountDataContext()
    const { hoveredSiteId, handleMouseEnter, handleMouseLeave } =
      useAccountListItem()

    return (
      <div
        className={`px-5 py-4 border-b border-gray-50 transition-colors relative group ${
          site.id === detectedAccount?.id ? "bg-blue-50" : "hover:bg-gray-25"
        }`}
        onMouseEnter={() => handleMouseEnter(site.id)}
        onMouseLeave={handleMouseLeave}>
        <div className="flex items-center space-x-4">
          <SiteInfo site={site} />

          {hoveredSiteId === site.id && (
            <AccountActionButtons
              site={site}
              onDeleteAccount={onDeleteWithDialog}
              onCopyKey={onCopyKey}
            />
          )}

          <BalanceDisplay site={site} />
        </div>
      </div>
    )
  }
)
export default AccountListItem
