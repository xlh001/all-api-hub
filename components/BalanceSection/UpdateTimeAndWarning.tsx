import React from "react"

import { useTimeFormatter } from "~/hooks/useTimeFormatter"

import Tooltip from "../Tooltip"

interface UpdateTimeAndWarningProps {
  lastUpdateTime: Date
  detectedAccountName?: string
}

export const UpdateTimeAndWarning: React.FC<UpdateTimeAndWarningProps> = ({
  lastUpdateTime,
  detectedAccountName
}) => {
  const { formatRelativeTime, formatFullTime } = useTimeFormatter()

  return (
    <div className="mt-4 pt-3 border-t border-gray-100">
      <div className="ml-2 flex items-center justify-between">
        <Tooltip content={formatFullTime(lastUpdateTime)}>
          <p className="text-xs text-gray-400 cursor-help">
            更新于 {formatRelativeTime(lastUpdateTime)}
          </p>
        </Tooltip>
        {detectedAccountName && (
          <span className="text-xs text-yellow-600 font-medium">
            ⚠️当前站点 {detectedAccountName} 已被添加
          </span>
        )}
      </div>
    </div>
  )
}
