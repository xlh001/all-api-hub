import {
  CheckIcon,
  ClockIcon,
  DocumentDuplicateIcon
} from "@heroicons/react/24/outline"

import { CherryIcon } from "~/components/icons/CherryIcon"
import type { ApiToken, DisplaySiteData } from "~/types"
import { OpenInCherryStudio } from "~/utils/cherryStudio"

interface TokenDetailsProps {
  token: ApiToken
  copiedKey: string | null
  formatTime: (timestamp: number) => string
  formatUsedQuota: (token: ApiToken) => string
  formatQuota: (token: ApiToken) => string
  onCopyKey: (key: string) => void
  account: DisplaySiteData
}

export function TokenDetails({
  token,
  copiedKey,
  formatTime,
  formatUsedQuota,
  formatQuota,
  onCopyKey,
  account
}: TokenDetailsProps) {
  return (
    <div className="px-3 pb-3 border-t border-gray-100 dark:border-dark-bg-tertiary bg-gray-50/30 dark:bg-dark-bg-primary">
      <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-dark-text-secondary mb-3 pt-3">
        <ClockIcon className="w-3 h-3" />
        <span>过期时间: {formatTime(token.expired_time)}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-white dark:bg-dark-bg-secondary rounded p-2 border border-gray-100 dark:border-dark-bg-tertiary">
          <div className="text-xs text-gray-500 dark:text-dark-text-secondary mb-0.5">
            已用额度
          </div>
          <div className="text-sm font-semibold text-gray-900 dark:text-dark-text-primary">
            {formatUsedQuota(token)}
          </div>
        </div>
        <div className="bg-white dark:bg-dark-bg-secondary rounded p-2 border border-gray-100 dark:border-dark-bg-tertiary">
          <div className="text-xs text-gray-500 dark:text-dark-text-secondary mb-0.5">
            剩余额度
          </div>
          <div
            className={`text-sm font-semibold ${
              token.unlimited_quota || token.remain_quota < 0
                ? "text-green-600"
                : token.remain_quota < 1000000
                  ? "text-orange-600"
                  : "text-gray-900 dark:text-dark-text-primary"
            }`}>
            {formatQuota(token)}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-bg-secondary rounded p-2 border border-gray-100 dark:border-dark-bg-tertiary">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wide">
            API 密钥
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onCopyKey(token.key)
              }}
              className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs font-medium rounded hover:from-purple-600 hover:to-indigo-700 transition-all duration-200">
              {copiedKey === token.key ? (
                <>
                  <CheckIcon className="w-3 h-3" />
                  <span>已复制</span>
                </>
              ) : (
                <>
                  <DocumentDuplicateIcon className="w-3 h-3" />
                  <span>复制</span>
                </>
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                OpenInCherryStudio(account, token)
              }}
              className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-xs font-medium rounded hover:from-blue-600 hover:to-cyan-700 transition-all duration-200">
              <CherryIcon className="w-3 h-3" />
              <span>在Cherry Studio中使用</span>
            </button>
          </div>
        </div>
        <div className="font-mono text-xs text-gray-700 dark:text-dark-text-secondary bg-gray-50 dark:bg-dark-bg-primary px-2 py-1 rounded border border-gray-200 dark:border-dark-bg-tertiary break-all">
          <span className="text-gray-900 dark:text-dark-text-primary">
            {token.key.substring(0, 16)}
          </span>
          <span className="text-gray-400 dark:text-gray-600">
            {"•".repeat(6)}
          </span>
          <span className="text-gray-900 dark:text-dark-text-primary">
            {token.key.substring(token.key.length - 6)}
          </span>
        </div>
      </div>
    </div>
  )
}
