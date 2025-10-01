import { useEffect, useState } from "react"

import { UI_CONSTANTS } from "~/constants/ui"
import { formatFullTime, formatRelativeTime } from "~/utils/formatters"

interface UseTimeFormatterResult {
  formatRelativeTime: (date: Date) => string
  formatFullTime: (date: Date) => string
  forceUpdate: () => void
}

export const useTimeFormatter = (): UseTimeFormatterResult => {
  const [, setForceUpdate] = useState({})

  // 强制更新函数
  const forceUpdate = () => {
    setForceUpdate({})
  }

  // 定时更新相对时间显示
  useEffect(() => {
    const updateInterval = setInterval(() => {
      forceUpdate()
    }, UI_CONSTANTS.UPDATE_INTERVAL)

    return () => clearInterval(updateInterval)
  }, [])

  return {
    formatRelativeTime,
    formatFullTime,
    forceUpdate
  }
}
