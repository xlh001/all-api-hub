import { Switch } from "@headlessui/react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

import { useUserPreferencesContext } from "~/contexts/UserPreferencesContext"

import { showUpdateToast } from "../utils/toastHelpers"

export default function RefreshSettings() {
  const { t } = useTranslation("settings")
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
    showUpdateToast(success, t("refresh.autoRefresh"))
  }

  const handleRefreshOnOpenChange = async (value: boolean) => {
    const success = await updateRefreshOnOpen(value)
    showUpdateToast(success, t("refresh.refreshOnOpen"))
  }

  const handleRefreshIntervalBlur = async () => {
    const value = parseInt(intervalInput, 10)
    if (isNaN(value) || value < 10) {
      toast.error(
        t("refresh.refreshInterval") + " " + t("refresh.minRefreshIntervalDesc")
      )
      setIntervalInput(refreshInterval.toString())
      return
    }
    if (value === refreshInterval) return

    const success = await updateRefreshInterval(value)
    showUpdateToast(success, t("refresh.refreshInterval"))
  }

  const handleMinRefreshIntervalBlur = async () => {
    const value = parseInt(minIntervalInput, 10)
    if (isNaN(value) || value < 0 || value > 300) {
      toast.error(
        t("refresh.minRefreshInterval") +
          " " +
          t("refresh.minRefreshIntervalDesc")
      )
      setMinIntervalInput(minRefreshInterval.toString())
      return
    }
    if (value === minRefreshInterval) return

    const success = await updateMinRefreshInterval(value)
    showUpdateToast(success, t("refresh.minRefreshInterval"))
  }

  return (
    <section>
      <h2 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary mb-4">
        {t("refresh.title")}
      </h2>
      <div className="space-y-6">
        {/* 自动刷新 */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-dark-bg-tertiary">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">
              {t("refresh.autoRefresh")}
            </h3>
            <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
              {t("refresh.autoRefreshDesc")}
            </p>
          </div>
          <Switch
            checked={autoRefresh}
            onChange={handleAutoRefreshChange}
            className={`${
              autoRefresh
                ? "bg-blue-600"
                : "bg-gray-200 dark:bg-dark-bg-tertiary"
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
          <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-dark-bg-tertiary">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                {t("refresh.refreshInterval")}
              </h3>
              <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
                {t("refresh.refreshIntervalDesc")}
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
                className="w-20 px-3 py-1.5 text-sm border border-gray-300 dark:border-dark-bg-tertiary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text-primary"
              />
              <span className="text-sm text-gray-500 dark:text-dark-text-secondary">
                {t("common:time.seconds")}
              </span>
            </div>
          </div>
        )}

        {/* 打开插件时自动刷新 */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-dark-bg-tertiary">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">
              {t("refresh.refreshOnOpen")}
            </h3>
            <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
              {t("refresh.refreshOnOpenDesc")}
            </p>
          </div>
          <Switch
            checked={refreshOnOpen}
            onChange={handleRefreshOnOpenChange}
            className={`${
              refreshOnOpen
                ? "bg-blue-600"
                : "bg-gray-200 dark:bg-dark-bg-tertiary"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}>
            <span
              className={`${
                refreshOnOpen ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>

        {/* 最小刷新间隔 */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-dark-bg-tertiary">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">
              {t("refresh.minRefreshInterval")}
            </h3>
            <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
              {t("refresh.minRefreshIntervalDesc")}
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
              className="w-20 px-3 py-1.5 text-sm border border-gray-300 dark:border-dark-bg-tertiary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text-primary"
            />
            <span className="text-sm text-gray-500 dark:text-dark-text-secondary">
              {t("common:time.seconds")}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
