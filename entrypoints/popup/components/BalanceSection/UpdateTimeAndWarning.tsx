import { useEffect, useState } from "react"

import Tooltip from "~/components/Tooltip"
import { UI_CONSTANTS } from "~/constants/ui"
import { useAccountDataContext } from "~/features/AccountManagement/hooks/AccountDataContext"
import { formatFullTime, formatRelativeTime } from "~/utils/formatters"

export const UpdateTimeAndWarning = () => {
  const { lastUpdateTime, detectedAccount } = useAccountDataContext()
  const [, setTick] = useState(0)

  useEffect(() => {
    // 每隔一段时间更新 tick，以触发相对时间的重新计算
    // 这样可以确保 "更新于 X 分钟前" 这样的文本是动态更新的
    // 而不是仅在组件初次渲染时计算一次
    const timer = setInterval(
      () => setTick((t) => t + 1),
      UI_CONSTANTS.UPDATE_INTERVAL
    )
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="mt-4">
      <div className="ml-2 flex items-center justify-between">
        <Tooltip content={formatFullTime(lastUpdateTime)}>
          <p className="text-xs text-gray-400 dark:text-dark-text-tertiary cursor-help">
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
