import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline"
import React from "react"

import { formatTokenCount } from "../../utils/formatters"
import Tooltip from "../Tooltip"

interface TokenStatsProps {
  todayTokens: { upload: number; download: number }
}

export const TokenStats: React.FC<TokenStatsProps> = ({ todayTokens }) => {
  return (
    <div>
      <Tooltip
        content={
          <div>
            <div>提示: {todayTokens.upload.toLocaleString()} tokens</div>
            <div>补全: {todayTokens.download.toLocaleString()} tokens</div>
          </div>
        }>
        <div className="flex items-center space-x-3 cursor-help">
          <div className="flex items-center space-x-1">
            <ArrowUpIcon className="w-4 h-4 text-green-500" />
            <span className="font-medium text-gray-500">
              {formatTokenCount(todayTokens.upload)}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <ArrowDownIcon className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-500">
              {formatTokenCount(todayTokens.download)}
            </span>
          </div>
        </div>
      </Tooltip>
    </div>
  )
}
