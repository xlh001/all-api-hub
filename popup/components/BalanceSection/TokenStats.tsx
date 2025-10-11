import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline"
import React from "react"

import { formatTokenCount } from "~/utils/formatters"

import Tooltip from "../../../components/Tooltip"
import { useAccountDataContext } from "~/options/pages/AccountManagement/hooks/AccountDataContext"

export const TokenStats = React.memo(() => {
  const { stats } = useAccountDataContext()
  const todayTokens = stats
  let todayTotalPromptTokens = todayTokens.today_total_prompt_tokens
  let todayTotalCompletionTokens = todayTokens.today_total_completion_tokens
  return (
    <div>
      <Tooltip
        content={
          <div>
            <div>提示: {todayTotalPromptTokens.toLocaleString()} 令牌</div>
            <div>补全: {todayTotalCompletionTokens.toLocaleString()} 令牌</div>
          </div>
        }>
        <div className="flex items-center space-x-3 cursor-help">
          <div className="flex items-center space-x-1">
            <ArrowUpIcon className="w-4 h-4 text-green-500" />
            <span className="font-medium text-gray-500">
              {formatTokenCount(todayTokens.today_total_prompt_tokens)}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <ArrowDownIcon className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-500">
              {formatTokenCount(todayTokens.today_total_completion_tokens)}
            </span>
          </div>
        </div>
      </Tooltip>
    </div>
  )
})
