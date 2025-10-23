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
import { BodySmall, Caption, IconButton } from "~/components/ui"
import { COLORS } from "~/constants/designTokens"
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
    <header
      className={`flex items-center justify-between px-3 sm:px-5 py-2 sm:py-3 ${COLORS.background.primary} ${COLORS.border.default} border-b flex-shrink-0`}>
      {/* Logo and Title Section */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <img
          src={iconImage}
          alt={t("ui:app.name")}
          className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg shadow-sm flex-shrink-0"
        />
        <div className="flex flex-col min-w-0 flex-1">
          <BodySmall weight="semibold" className="truncate">
            {t("ui:app.name")}
          </BodySmall>
          <Caption className="truncate hidden xs:block">
            {t("ui:app.description")}
          </Caption>
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <CompactThemeToggle />

        <Tooltip content={t("common:actions.refresh")}>
          <IconButton
            onClick={handleGlobalRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            aria-label={t("common:actions.refresh")}
            className="touch-manipulation">
            <ArrowPathIcon
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </IconButton>
        </Tooltip>

        <Tooltip content={t("ui:navigation.home")}>
          <IconButton
            onClick={handleOpenFullManagerPage}
            variant="outline"
            size="sm"
            aria-label={t("ui:navigation.home")}
            className="touch-manipulation">
            <ArrowsPointingOutIcon className="w-4 h-4" />
          </IconButton>
        </Tooltip>

        <Tooltip content={t("common:labels.settings")}>
          <IconButton
            onClick={handleOpenSetting}
            variant="outline"
            size="sm"
            aria-label={t("common:labels.settings")}
            className="touch-manipulation">
            <Cog6ToothIcon className="w-4 h-4" />
          </IconButton>
        </Tooltip>
      </div>
    </header>
  )
}
