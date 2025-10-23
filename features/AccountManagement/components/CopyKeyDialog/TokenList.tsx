import { KeyIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import { EmptyState } from "~/components/ui"
import type { ApiToken, DisplaySiteData } from "~/types"

import { TokenItem } from "./TokenItem"

interface TokenListProps {
  tokens: ApiToken[]
  expandedTokens: Set<number>
  copiedKey: string | null
  onToggleToken: (id: number) => void
  onCopyKey: (key: string) => void
  formatTime: (timestamp: number) => string
  formatUsedQuota: (token: ApiToken) => string
  formatQuota: (token: ApiToken) => string
  getGroupBadgeStyle: (group: string) => string
  getStatusBadgeStyle: (status: number) => string
  account: DisplaySiteData
}

export function TokenList({
  tokens,
  expandedTokens,
  copiedKey,
  onToggleToken,
  onCopyKey,
  formatTime,
  formatUsedQuota,
  formatQuota,
  getGroupBadgeStyle,
  getStatusBadgeStyle,
  account
}: TokenListProps) {
  const { t } = useTranslation("ui")

  if (!Array.isArray(tokens) || tokens.length === 0) {
    return (
      <EmptyState
        icon={<KeyIcon className="w-12 h-12" />}
        title={t("dialog.copyKey.noKeys")}
      />
    )
  }

  return (
    <div className="space-y-3">
      {tokens.map((token) => (
        <TokenItem
          key={token.id}
          token={token}
          isExpanded={expandedTokens.has(token.id)}
          copiedKey={copiedKey}
          onToggle={() => onToggleToken(token.id)}
          onCopyKey={onCopyKey}
          formatTime={formatTime}
          formatUsedQuota={formatUsedQuota}
          formatQuota={formatQuota}
          getGroupBadgeStyle={getGroupBadgeStyle}
          getStatusBadgeStyle={getStatusBadgeStyle}
          account={account}
        />
      ))}
    </div>
  )
}
