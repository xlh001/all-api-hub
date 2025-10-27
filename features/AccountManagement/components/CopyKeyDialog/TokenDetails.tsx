import {
  CheckIcon,
  ClockIcon,
  DocumentDuplicateIcon
} from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import { CherryIcon } from "~/components/icons/CherryIcon"
import { Button } from "~/components/ui"
import type { ApiToken, DisplaySiteData } from "~/types"
import { OpenInCherryStudio } from "~/utils/cherryStudio"
import { formatKeyTime, formatQuota, formatUsedQuota } from "~/utils/formatters"

interface TokenDetailsProps {
  token: ApiToken
  copiedKey: string | null
  onCopyKey: (key: string) => void
  account: DisplaySiteData
}

export function TokenDetails({
  token,
  copiedKey,
  onCopyKey,
  account
}: TokenDetailsProps) {
  const { t } = useTranslation("ui")

  return (
    <div className="border-t border-gray-100 bg-gray-50/30 px-3 pb-3 dark:border-dark-bg-tertiary dark:bg-dark-bg-primary">
      <div className="mb-3 flex items-center space-x-1 pt-3 text-xs text-gray-500 dark:text-dark-text-secondary">
        <ClockIcon className="h-3 w-3" />
        <span>
          {t("dialog.copyKey.expireTime", {
            time: formatKeyTime(token.expired_time)
          })}
        </span>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2">
        <div className="rounded border border-gray-100 bg-white p-2 dark:border-dark-bg-tertiary dark:bg-dark-bg-secondary">
          <div className="mb-0.5 text-xs text-gray-500 dark:text-dark-text-secondary">
            {t("dialog.copyKey.usedQuota")}
          </div>
          <div className="text-sm font-semibold text-gray-900 dark:text-dark-text-primary">
            {formatUsedQuota(token)}
          </div>
        </div>
        <div className="rounded border border-gray-100 bg-white p-2 dark:border-dark-bg-tertiary dark:bg-dark-bg-secondary">
          <div className="mb-0.5 text-xs text-gray-500 dark:text-dark-text-secondary">
            {t("dialog.copyKey.remainingQuota")}
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

      <div className="rounded border border-gray-100 bg-white p-2 dark:border-dark-bg-tertiary dark:bg-dark-bg-secondary">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-dark-text-secondary">
            {t("dialog.copyKey.apiKey")}
          </span>
          <div className="flex items-center space-x-2">
            <Button
              onClick={(e) => {
                e.stopPropagation()
                onCopyKey(token.key)
              }}
              variant="default"
              size="sm"
              className="flex items-center space-x-1 px-2 py-1">
              {copiedKey === token.key ? (
                <>
                  <CheckIcon className="h-3 w-3" />
                  <span>{t("dialog.copyKey.copied")}</span>
                </>
              ) : (
                <>
                  <DocumentDuplicateIcon className="h-3 w-3" />
                  <span>{t("dialog.copyKey.copy")}</span>
                </>
              )}
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                OpenInCherryStudio(account, token)
              }}
              variant="default"
              size="sm"
              className="flex items-center space-x-1 px-2 py-1">
              <CherryIcon />
              <span>{t("dialog.copyKey.useInCherry")}</span>
            </Button>
          </div>
        </div>
        <div className="break-all rounded border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-xs text-gray-700 dark:border-dark-bg-tertiary dark:bg-dark-bg-primary dark:text-dark-text-secondary">
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
