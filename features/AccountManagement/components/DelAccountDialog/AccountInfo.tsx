import type { FC } from "react"
import { useTranslation } from "react-i18next"

import type { DisplaySiteData } from "~/types"

const AccountInfoDetail: FC<{
  label: string
  value: string
  isUrl?: boolean
}> = ({ label, value, isUrl }) => (
  <div className="flex items-center justify-between">
    <span className="text-gray-500 dark:text-dark-text-secondary">
      {label}：
    </span>
    {isUrl ? (
      <span
        className="truncate ml-2 max-w-48 font-medium text-gray-900 dark:text-dark-text-primary"
        title={value}>
        {value}
      </span>
    ) : (
      <span className="font-medium text-gray-900 dark:text-dark-text-primary">
        {value}
      </span>
    )}
  </div>
)

export const AccountInfo: FC<{ account: DisplaySiteData }> = ({ account }) => {
  const { t } = useTranslation("ui")
  
  return (
    <div className="mb-4 space-y-1 rounded-lg bg-gray-50 dark:bg-dark-bg-secondary p-3 text-sm">
      <AccountInfoDetail label={t("dialog.delete.siteName")} value={account.name} />
      <AccountInfoDetail label={t("dialog.delete.username")} value={account.username} />
      <AccountInfoDetail label={t("dialog.delete.siteUrl")} value={account.baseUrl} isUrl />
    </div>
  )
}
