import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline"
import React from "react"
import { useTranslation } from "react-i18next"

import Tooltip from "~/components/Tooltip"
import { useAccountDataContext } from "~/features/AccountManagement/hooks/AccountDataContext"
import { formatTokenCount } from "~/utils/formatters"

export const TokenStats = React.memo(() => {
  const { t } = useTranslation("account")
  const { stats } = useAccountDataContext()
  const todayTokens = stats
  let todayTotalPromptTokens = todayTokens.today_total_prompt_tokens
  let todayTotalCompletionTokens = todayTokens.today_total_completion_tokens
  return (
    <div>
      <Tooltip
        content={
          <div>
            <div>
              {t("common:stats.prompt")}:{" "}
              {todayTotalPromptTokens.toLocaleString()}{" "}
              {t("common:labels.token")}
            </div>
            <div>
              {t("common:stats.completion")}:{" "}
              {todayTotalCompletionTokens.toLocaleString()}{" "}
              {t("common:labels.token")}
            </div>
          </div>
        }>
        <div className="flex items-center space-x-3 cursor-help">
          <div className="flex items-center space-x-1">
            <ArrowUpIcon className="w-4 h-4 text-green-500" />
            <span className="font-medium text-gray-500 dark:text-dark-text-secondary">
              {formatTokenCount(todayTokens.today_total_prompt_tokens)}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <ArrowDownIcon className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-500 dark:text-dark-text-secondary">
              {formatTokenCount(todayTokens.today_total_completion_tokens)}
            </span>
          </div>
        </div>
      </Tooltip>
    </div>
  )
})
