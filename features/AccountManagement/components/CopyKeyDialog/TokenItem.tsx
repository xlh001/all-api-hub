import {
  ChevronDownIcon,
  ChevronRightIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation()

  return (
    <div className="bg-white dark:bg-dark-bg-secondary border border-gray-200 dark:border-dark-bg-tertiary rounded-lg overflow-hidden hover:shadow-sm transition-all duration-200">
      <div
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-colors"
        onClick={onToggle}>
        <div className="flex-1 min-w-0 space-y-1.5">
          <h4 className="font-medium text-gray-900 dark:text-dark-text-primary text-sm truncate">
            {token.name}
          </h4>
          <div className="flex items-center space-x-1.5">
            <UserGroupIcon className="w-3 h-3 text-gray-400" />
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getGroupBadgeStyle(token.group || "")}`}>
              {token.group || t("copyKeyDialog.defaultGroup")}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-3">
          <span
            className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${getStatusBadgeStyle(token.status)}`}>
            {token.status === 1
              ? t("copyKeyDialog.enabled")
              : t("copyKeyDialog.disabled")}
          </span>

          {isExpanded ? (
            <ChevronDownIcon className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

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
    </div>
  )
}
