import {
  ChevronDownIcon,
  ChevronRightIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import { Badge, Card, CardContent, IconButton } from "~/components/ui"
import type { ApiToken, DisplaySiteData } from "~/types"

import { TokenDetails } from "./TokenDetails"

interface TokenItemProps {
  token: ApiToken
  isExpanded: boolean
  copiedKey: string | null
  onToggle: () => void
  onCopyKey: (key: string) => void
  formatTime: (timestamp: number) => string
  formatUsedQuota: (token: ApiToken) => string
  formatQuota: (token: ApiToken) => string
  getGroupBadgeStyle: (group: string) => string
  getStatusBadgeStyle: (status: number) => string
  account: DisplaySiteData
}

export function TokenItem({
  token,
  isExpanded,
  copiedKey,
  onToggle,
  onCopyKey,
  formatTime,
  formatUsedQuota,
  formatQuota,
  getGroupBadgeStyle,
  getStatusBadgeStyle,
  account
}: TokenItemProps) {
  const { t } = useTranslation("ui")

  return (
    <Card variant="interactive" padding="none">
      <CardContent
        className="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-colors"
        onClick={onToggle}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0 space-y-1.5">
            <h4 className="font-medium text-gray-900 dark:text-dark-text-primary text-sm truncate">
              {token.name}
            </h4>
            <div className="flex items-center space-x-1.5">
              <UserGroupIcon className="w-3 h-3 text-gray-400 dark:text-gray-500" />
              <Badge
                variant="outline"
                size="sm"
                className={getGroupBadgeStyle(token.group || "")}>
                {token.group || t("dialog.copyKey.defaultGroup")}
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-3">
            <Badge
              variant={token.status === 1 ? "success" : "secondary"}
              size="sm"
              className={getStatusBadgeStyle(token.status)}>
              {token.status === 1
                ? t("dialog.copyKey.enabled")
                : t("dialog.copyKey.disabled")}
            </Badge>

            <IconButton
              variant="ghost"
              size="sm"
              aria-label={
                isExpanded ? t("dialog.collapse") : t("dialog.expand")
              }>
              {isExpanded ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
            </IconButton>
          </div>
        </div>
      </CardContent>

      {isExpanded && (
        <TokenDetails
          token={token}
          copiedKey={copiedKey}
          formatTime={formatTime}
          formatUsedQuota={formatUsedQuota}
          formatQuota={formatQuota}
          onCopyKey={onCopyKey}
          account={account}
        />
      )}
    </Card>
  )
}
