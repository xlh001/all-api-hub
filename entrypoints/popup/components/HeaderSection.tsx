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
import { IconButton } from "~/components/ui"
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
          <IconButton
            onClick={handleGlobalRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            aria-label={t("common:actions.refresh")}
            className="p-1.5 sm:p-2 touch-manipulation tap-highlight-transparent">
            <ArrowPathIcon
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </IconButton>
        </Tooltip>
        <Tooltip content={t("ui:navigation.home")}>
          <IconButton
            onClick={handleOpenFullManagerPage}
            variant="outline"
            size="sm"
            aria-label={t("ui:navigation.home")}
            className="p-1.5 sm:p-2 touch-manipulation tap-highlight-transparent">
            <ArrowsPointingOutIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </IconButton>
        </Tooltip>
        <Tooltip content={t("common:labels.settings")}>
          <IconButton
            onClick={handleOpenSetting}
            variant="outline"
            size="sm"
            aria-label={t("common:labels.settings")}
            className="p-1.5 sm:p-2 touch-manipulation tap-highlight-transparent">
            <Cog6ToothIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  )
}
