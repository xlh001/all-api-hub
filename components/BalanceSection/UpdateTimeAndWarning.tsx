import React from "react"

import { useAccountDataContext } from "~/contexts"
import { useTimeFormatter } from "~/hooks/useTimeFormatter"

import Tooltip from "../Tooltip"

export const UpdateTimeAndWarning = () => {
  const { lastUpdateTime, detectedAccount } = useAccountDataContext()
  const { formatRelativeTime, formatFullTime } = useTimeFormatter()

  return (
    <div className="mt-4 pt-3 border-t border-gray-100">
      <div className="ml-2 flex items-center justify-between">
        <Tooltip content={formatFullTime(lastUpdateTime)}>
          <p className="text-xs text-gray-400 cursor-help">
            更新于 {formatRelativeTime(lastUpdateTime)}
          </p>
        </Tooltip>
        {detectedAccount && (
          <span className="text-xs text-yellow-600 font-medium">
            ⚠️当前站点 {detectedAccount.site_name} 已被添加
          </span>
        )}
      </div>
    </div>
  )
}
