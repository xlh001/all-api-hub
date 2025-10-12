import { Switch } from "@headlessui/react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

import { useUserPreferencesContext } from "~/contexts/UserPreferencesContext"

import { showUpdateToast } from "../utils/toastHelpers"

export default function RefreshSettings() {
  const {
    autoRefresh,
    refreshOnOpen,
    refreshInterval,
    minRefreshInterval,
    updateAutoRefresh,
    updateRefreshOnOpen,
    updateRefreshInterval,
    updateMinRefreshInterval
  } = useUserPreferencesContext()

  const [intervalInput, setIntervalInput] = useState(refreshInterval.toString())
  const [minIntervalInput, setMinIntervalInput] = useState(
    minRefreshInterval.toString()
  )

  useEffect(() => {
    setIntervalInput(refreshInterval.toString())
  }, [refreshInterval])

  useEffect(() => {
    setMinIntervalInput(minRefreshInterval.toString())
  }, [minRefreshInterval])

  const handleAutoRefreshChange = async (value: boolean) => {
    const success = await updateAutoRefresh(value)
    showUpdateToast(success, "自动刷新")
  }

  const handleRefreshOnOpenChange = async (value: boolean) => {
    const success = await updateRefreshOnOpen(value)
    showUpdateToast(success, "打开插件时自动刷新")
  }

  const handleRefreshIntervalBlur = async () => {
    const value = parseInt(intervalInput, 10)
    if (isNaN(value) || value < 10) {
      toast.error("刷新间隔不能小于10秒")
      setIntervalInput(refreshInterval.toString())
      return
    }
    if (value === refreshInterval) return

    const success = await updateRefreshInterval(value)
    showUpdateToast(success, "刷新间隔")
  }

  const handleMinRefreshIntervalBlur = async () => {
    const value = parseInt(minIntervalInput, 10)
    if (isNaN(value) || value < 0 || value > 300) {
      toast.error("最小刷新间隔必须在0到300秒之间")
      setMinIntervalInput(minRefreshInterval.toString())
      return
    }
    if (value === minRefreshInterval) return

    const success = await updateMinRefreshInterval(value)
    showUpdateToast(success, "最小刷新间隔")
  }

  return (
    <section>
      <h2 className="text-lg font-medium text-gray-900 mb-4">刷新设置</h2>
      <div className="space-y-6">
        {/* 自动刷新 */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-medium text-gray-900">自动刷新</h3>
            <p className="text-sm text-gray-500">定期自动刷新账号数据</p>
          </div>
          <Switch
            checked={autoRefresh}
            onChange={handleAutoRefreshChange}
            className={`${
              autoRefresh ? "bg-blue-600" : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}>
            <span
              className={`${
                autoRefresh ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>

        {/* 刷新间隔 */}
        {autoRefresh && (
          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-medium text-gray-900">刷新间隔</h3>
              <p className="text-sm text-gray-500">
                设置自动刷新的时间间隔（默认360秒，建议不要设置过小以避免频繁请求）
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="10"
                value={intervalInput}
                onChange={(e) => setIntervalInput(e.target.value)}
                onBlur={handleRefreshIntervalBlur}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.currentTarget.blur() // 触发onBlur事件
                  }
                }}
                placeholder="360"
                className="w-20 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-sm text-gray-500">秒</span>
            </div>
          </div>
        )}

        {/* 打开插件时自动刷新 */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              打开插件时自动刷新
            </h3>
            <p className="text-sm text-gray-500">
              当打开插件弹出层时自动刷新账号数据
            </p>
          </div>
          <Switch
            checked={refreshOnOpen}
            onChange={handleRefreshOnOpenChange}
            className={`${
              refreshOnOpen ? "bg-blue-600" : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}>
            <span
              className={`${
                refreshOnOpen ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>

        {/* 最小刷新间隔 */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-medium text-gray-900">最小刷新间隔</h3>
            <p className="text-sm text-gray-500">
              自动刷新时的最小时间间隔，避免频繁请求（手动刷新不受限制）
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="0"
              max="300"
              value={minIntervalInput}
              onChange={(e) => setMinIntervalInput(e.target.value)}
              onBlur={handleMinRefreshIntervalBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.blur()
                }
              }}
              placeholder="60"
              className="w-20 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="text-sm text-gray-500">秒</span>
          </div>
        </div>
      </div>
    </section>
  )
}
