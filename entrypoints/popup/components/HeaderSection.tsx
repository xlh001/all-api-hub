import {
  ArrowPathIcon,
  ArrowsPointingOutIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/outline"
import { useCallback } from "react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

import iconImage from "~/assets/icon.png"
import Tooltip from "~/components/Tooltip"
import { useAccountDataContext } from "~/features/AccountManagement/hooks/AccountDataContext"
import { openFullManagerPage, openSettingsPage } from "~/utils/navigation"

import CompactThemeToggle from "./ThemeToggle"

export default function HeaderSection() {
  const { t } = useTranslation(["ui", "account", "common"])
  const { isRefreshing, handleRefresh } = useAccountDataContext()

  const handleGlobalRefresh = useCallback(async () => {
    try {
      await toast.promise(handleRefresh(true), {
        loading: t("account:refresh.refreshingAll"),
        success: (result) => {
          if (result.failed > 0) {
            return t("account:refresh.refreshComplete", {
              success: result.success,
              failed: result.failed
            })
          }
          return t("account:refresh.refreshSuccess")
        },
        error: t("account:refresh.refreshFailed")
      })
    } catch (error) {
      console.error("Error during global refresh:", error)
    }
  }, [handleRefresh, t])

  const handleOpenFullManagerPage = () => {
    openFullManagerPage()
  }

  const handleOpenSetting = () => {
    openSettingsPage()
  }

  return (
    <div className="flex items-center justify-between px-3 sm:px-5 py-2 sm:py-3 bg-white dark:bg-dark-bg-primary border-b border-gray-100 dark:border-dark-bg-tertiary flex-shrink-0">
      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
        <img
          src={iconImage}
          alt={t("ui:app.name")}
          className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg shadow-sm flex-shrink-0"
        />
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-dark-text-primary truncate">
            {t("ui:app.name")}
          </span>
          <span className="text-xs text-gray-500 dark:text-dark-text-secondary truncate hidden xs:block">
            {t("ui:app.description")}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
        <CompactThemeToggle />
        <Tooltip content={t("common:actions.refresh")}>
          <button
            onClick={handleGlobalRefresh}
            disabled={isRefreshing}
            className="p-1.5 sm:p-2 text-gray-400 dark:text-dark-text-tertiary hover:text-gray-600 dark:hover:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg-primary border border-gray-200 dark:border-dark-bg-tertiary touch-manipulation tap-highlight-transparent"
            title={t("common:actions.refresh")}>
            <ArrowPathIcon
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
        </Tooltip>
        <button
          onClick={handleOpenFullManagerPage}
          className="p-1.5 sm:p-2 text-gray-400 dark:text-dark-text-tertiary hover:text-gray-600 dark:hover:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg-primary border border-gray-200 dark:border-dark-bg-tertiary touch-manipulation tap-highlight-transparent"
          title={t("ui:navigation.home")}>
          <ArrowsPointingOutIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        <button
          onClick={handleOpenSetting}
          className="p-1.5 sm:p-2 text-gray-400 dark:text-dark-text-tertiary hover:text-gray-600 dark:hover:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg-primary border border-gray-200 dark:border-dark-bg-tertiary touch-manipulation tap-highlight-transparent"
          title={t("common:labels.settings")}>
          <Cog6ToothIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  )
}
