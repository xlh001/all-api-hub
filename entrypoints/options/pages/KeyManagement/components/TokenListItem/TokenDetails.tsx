import { useTranslation } from "react-i18next"

import { BodySmall } from "~/components/ui"
import type { ApiToken } from "~/types"
import { formatKeyTime } from "~/utils/formatters"

import { formatQuota } from "../../utils"

interface TokenDetailsProps {
  token: ApiToken
}

export function TokenDetails({ token }: TokenDetailsProps) {
  const { t } = useTranslation("keyManagement")
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3.5">
      <div className="min-w-0 truncate">
        <BodySmall
          as="span"
          className="text-gray-500 dark:text-dark-text-tertiary">
          {t("keyDetails.remainingQuota")}
        </BodySmall>
        <span className="ml-2 font-medium text-gray-900 dark:text-dark-text-primary">
          {formatQuota(token.remain_quota, token.unlimited_quota)}
        </span>
      </div>
      <div className="min-w-0 truncate">
        <BodySmall
          as="span"
          className="text-gray-500 dark:text-dark-text-tertiary">
          {t("keyDetails.usedQuota")}
        </BodySmall>
        <span className="ml-2 font-medium text-gray-900 dark:text-dark-text-primary">
          {formatQuota(token.used_quota, false)}
        </span>
      </div>
      <div className="min-w-0 truncate">
        <BodySmall
          as="span"
          className="text-gray-500 dark:text-dark-text-tertiary">
          {t("keyDetails.expireTime")}
        </BodySmall>
        <span className="ml-2 font-medium text-gray-900 dark:text-dark-text-primary">
          {formatKeyTime(token.expired_time)}
        </span>
      </div>
      <div className="min-w-0 truncate">
        <BodySmall
          as="span"
          className="text-gray-500 dark:text-dark-text-tertiary">
          {t("keyDetails.createTime")}
        </BodySmall>
        <span className="ml-2 font-medium text-gray-900 dark:text-dark-text-primary">
          {formatKeyTime(token.created_time)}
        </span>
      </div>
    </div>
  )
}
