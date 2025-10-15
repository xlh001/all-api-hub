import { useTranslation } from "react-i18next"

import type { ApiToken } from "~/types"

import { formatQuota, formatTime } from "../../utils"

interface TokenDetailsProps {
  token: ApiToken
}

export function TokenDetails({ token }: TokenDetailsProps) {
  const { t } = useTranslation()
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div>
        <span className="text-gray-500 dark:text-dark-text-tertiary">
          {t("keyManagement.remainingQuota")}
        </span>
        <span className="ml-2 font-medium text-gray-900 dark:text-dark-text-primary">
          {formatQuota(token.remain_quota, token.unlimited_quota)}
        </span>
      </div>
      <div>
        <span className="text-gray-500 dark:text-dark-text-tertiary">
          {t("keyManagement.usedQuota")}
        </span>
        <span className="ml-2 font-medium text-gray-900 dark:text-dark-text-primary">
          {formatQuota(token.used_quota, false)}
        </span>
      </div>
      <div>
        <span className="text-gray-500 dark:text-dark-text-tertiary">
          {t("keyManagement.expireTime")}
        </span>
        <span className="ml-2 font-medium text-gray-900 dark:text-dark-text-primary">
          {formatTime(token.expired_time)}
        </span>
      </div>
      <div>
        <span className="text-gray-500 dark:text-dark-text-tertiary">
          {t("keyManagement.createTime")}
        </span>
        <span className="ml-2 font-medium text-gray-900 dark:text-dark-text-primary">
          {formatTime(token.created_time)}
        </span>
      </div>
    </div>
  )
}
