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
    <div className="flex items-center justify-between px-5 py-3 bg-white dark:bg-dark-bg-primary border-b border-gray-100 dark:border-dark-bg-tertiary flex-shrink-0">
      <div className="flex items-center space-x-3">
        <img
          src={iconImage}
          alt={t("ui:app.name")}
          className="w-7 h-7 rounded-lg shadow-sm"
        />
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-dark-text-primary">
            {t("ui:app.name")}
          </span>
          <span className="text-xs text-gray-500 dark:text-dark-text-secondary">
            {t("ui:app.description")}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <CompactThemeToggle />
        <Tooltip content={t("common:actions.refresh")}>
          <button
            onClick={handleGlobalRefresh}
            disabled={isRefreshing}
            className={`${UI_CONSTANTS.STYLES.BUTTON.ICON} ${isRefreshing ? "animate-spin" : ""}`}
            title={t("common:actions.refresh")}>
            <ArrowPathIcon className="w-4 h-4" />
          </button>
        </Tooltip>
        <button
          onClick={handleOpenFullManagerPage}
          className={UI_CONSTANTS.STYLES.BUTTON.ICON}
          title={t("ui:navigation.home")}>
          <ArrowsPointingOutIcon className="w-4 h-4" />
        </button>
        <button
          onClick={handleOpenSetting}
          className={UI_CONSTANTS.STYLES.BUTTON.ICON}
          title={t("common:labels.settings")}>
          <Cog6ToothIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
