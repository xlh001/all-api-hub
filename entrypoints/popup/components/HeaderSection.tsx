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
import { UI_CONSTANTS } from "~/constants/ui"
import { useAccountDataContext } from "~/features/AccountManagement/hooks/AccountDataContext"
import { openFullManagerPage, openSettingsPage } from "~/utils/navigation"

import CompactThemeToggle from "./ThemeToggle"

export default function HeaderSection() {
  const { t } = useTranslation()
  const { isRefreshing, handleRefresh } = useAccountDataContext()

  const handleGlobalRefresh = useCallback(async () => {
    try {
      await toast.promise(handleRefresh(true), {
        loading: t("account.refreshing_all_accounts"),
        success: (result) => {
          if (result.failed > 0) {
            return t("account.refresh_complete", {
              success: result.success,
              failed: result.failed
            })
          }
          return t("account.refresh_success")
        },
        error: t("account.refresh_failed")
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
    <div className="flex items-center justify-between px-5 py-3 bg-white dark:bg-dark-bg-primary border-b border-gray-100 dark:border-dark-bg-tertiary flex-shrink-0">
      <div className="flex items-center space-x-3">
        <img
          src={iconImage}
          alt={t("app.name")}
          className="w-7 h-7 rounded-lg shadow-sm"
        />
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-dark-text-primary">
            {t("app.name")}
          </span>
          <span className="text-xs text-gray-500 dark:text-dark-text-secondary">
            {t("app.description")}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <CompactThemeToggle />
        <Tooltip content={t("common.refresh_data")}>
          <button
            onClick={handleGlobalRefresh}
            disabled={isRefreshing}
            className={`${UI_CONSTANTS.STYLES.BUTTON.ICON} ${isRefreshing ? "animate-spin" : ""}`}
            title={t("common.refresh_data")}>
            <ArrowPathIcon className="w-4 h-4" />
          </button>
        </Tooltip>
        <button
          onClick={handleOpenFullManagerPage}
          className={UI_CONSTANTS.STYLES.BUTTON.ICON}
          title={t("common.open_full_page")}>
          <ArrowsPointingOutIcon className="w-4 h-4" />
        </button>
        <button
          onClick={handleOpenSetting}
          className={UI_CONSTANTS.STYLES.BUTTON.ICON}
          title={t("common.settings")}>
          <Cog6ToothIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
