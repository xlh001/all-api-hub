import AccountActionButtons from "~components/AccountActionButtons"

import { useAccountListItem } from "../hooks/useAccountListItem"
import type { DisplaySiteData } from "../types"
import BalanceDisplay from "./BalanceDisplay"
import SiteInfo from "./SiteInfo"

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

  return (
    <div
      className={`px-5 py-4 border-b border-gray-50 transition-colors relative group ${
        site.id === detectedAccountId ? "bg-blue-50" : "hover:bg-gray-25"
      }`}
      onMouseEnter={() => handleMouseEnter(site.id)}
      onMouseLeave={handleMouseLeave}>
      <div className="flex items-center space-x-4">
        <SiteInfo site={site} detectedAccountId={detectedAccountId} />

        {hoveredSiteId === site.id && (
          <AccountActionButtons
            site={site}
            refreshingAccountId={refreshingAccountId}
            onRefreshAccount={onRefreshAccount}
            onCopyUrl={onCopyUrl}
            onViewUsage={onViewUsage}
            onViewModels={onViewModels}
            onEditAccount={onEditAccount}
            onDeleteAccount={onDeleteAccount}
            onViewKeys={onViewKeys}
            onCopyKey={onCopyKey}
          />
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
