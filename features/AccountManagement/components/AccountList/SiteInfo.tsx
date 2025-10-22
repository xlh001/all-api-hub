import {
  CheckCircleIcon,
  CurrencyYenIcon,
  ExclamationTriangleIcon,
  PencilSquareIcon,
  UserIcon,
  XCircleIcon
} from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import Tooltip from "~/components/Tooltip"
import { IconButton } from "~/components/ui"
import { UI_CONSTANTS } from "~/constants/ui"
import { useAccountActionsContext } from "~/features/AccountManagement/hooks/AccountActionsContext"
import { useAccountDataContext } from "~/features/AccountManagement/hooks/AccountDataContext"
import {
  getHealthStatusDisplay,
  getStatusIndicatorColor
} from "~/features/AccountManagement/utils/healthStatusUtils"
import type { DisplaySiteData } from "~/types"
import { openCheckInPage } from "~/utils/navigation"

interface SiteInfoProps {
  site: DisplaySiteData
}

export default function SiteInfo({ site }: SiteInfoProps) {
  const { t } = useTranslation("account")
  const { detectedAccount } = useAccountDataContext()
  const { handleRefreshAccount, refreshingAccountId } =
    useAccountActionsContext()
  const detectedAccountId = detectedAccount?.id

  const isRefreshing = refreshingAccountId === site.id

  const handleCheckIn = (customCheckInUrl?: string) => () => {
    openCheckInPage(site, customCheckInUrl)
  }

  const handleHealthClick = async () => {
    if (!isRefreshing) {
      await handleRefreshAccount(site, true) // Force refresh
    }
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3 min-w-0 w-full">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5">
          <Tooltip
            content={
              <div className="text-xs">
                <p>
                  {t("list.site.status")}:{" "}
                  <span
                    className={
                      getHealthStatusDisplay(site.health?.status, t).color ||
                      "text-gray-400"
                    }>
                    {getHealthStatusDisplay(site.health?.status, t).text ||
                      t("list.site.unknown")}
                  </span>
                </p>
                {site.health?.reason && (
                  <p>
                    {t("list.site.reason")}: {site.health.reason}
                  </p>
                )}
                <p>
                  {t("list.site.lastSync")}:{" "}
                  {site.last_sync_time
                    ? new Date(site.last_sync_time).toLocaleString()
                    : t("list.site.notAvailable")}
                </p>
              </div>
            }
            position="right">
            <div
              className={`w-2 h-2 rounded-full flex-shrink-0 transition-all duration-200 ${
                isRefreshing
                  ? "opacity-60 animate-pulse"
                  : "cursor-pointer hover:scale-125"
              } ${
                getStatusIndicatorColor(site.health?.status) ||
                UI_CONSTANTS.STYLES.STATUS_INDICATOR.UNKNOWN
              }`}
              onClick={handleHealthClick}
              title={t("list.site.refreshHealthStatus")}></div>
          </Tooltip>
          {site.id === detectedAccountId && (
            <Tooltip content={t("list.site.currentSiteExists")} position="top">
              <span className="text-yellow-700 text-xs sm:text-sm whitespace-nowrap">
                {t("list.site.currentSite")}
              </span>
            </Tooltip>
          )}
          <div className="font-medium text-gray-900 dark:text-dark-text-primary text-xs sm:text-sm truncate flex-1 min-w-0">
            <a
              href={site.baseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline truncate block">
              {site.name}
            </a>
          </div>
          {/* The check-in UI is displayed if the checkIn object exists. */}
          {site.checkIn?.customCheckInUrl ? (
            <Tooltip
              content={t("list.site.customCheckInUrl", {
                url: site.checkIn.customCheckInUrl
              })}
              position="top"
              wrapperClassName="flex justify-center items-center">
              <IconButton
                onClick={handleCheckIn(site.checkIn.customCheckInUrl)}
                variant="ghost"
                size="sm"
                aria-label={t("list.site.customCheckIn")}>
                <CurrencyYenIcon className="h-4 w-4 text-green-500" />
              </IconButton>
            </Tooltip>
          ) : (
            site.checkIn?.enableDetection && (
              <>
                {site.checkIn.isCheckedInToday === undefined ? (
                  <Tooltip
                    content={t("list.site.checkInUnsupported")}
                    position="top"
                    wrapperClassName="flex justify-center items-center">
                    <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
                  </Tooltip>
                ) : site.checkIn.isCheckedInToday === false ? (
                  <Tooltip
                    content={t("list.site.checkedInToday")}
                    position="top"
                    wrapperClassName="flex justify-center items-center">
                    <IconButton
                      onClick={handleCheckIn()}
                      variant="ghost"
                      size="sm"
                      aria-label={t("list.site.checkIn")}>
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip
                    content={t("list.site.notCheckedInToday")}
                    position="top"
                    wrapperClassName="flex justify-center items-center">
                    <IconButton
                      onClick={handleCheckIn()}
                      variant="ghost"
                      size="sm"
                      aria-label={t("list.site.checkIn")}>
                      <XCircleIcon className="h-4 w-4 text-red-500" />
                    </IconButton>
                  </Tooltip>
                )}
              </>
            )
          )}
        </div>
        <div className="text-[10px] sm:text-xs text-gray-500 dark:text-dark-text-secondary truncate ml-3 sm:ml-4 flex items-start gap-1 min-w-0">
          <UserIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 mt-0.5 flex-shrink-0" />
          <span className="truncate" title={site.username}>
            {site.username}
          </span>
        </div>
        {site.notes && (
          <div className="text-[10px] sm:text-xs text-gray-500 dark:text-dark-text-secondary truncate ml-3 sm:ml-4 mt-0.5 sm:mt-1 flex items-start gap-1 min-w-0">
            <PencilSquareIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 mt-0.5 flex-shrink-0" />
            <span className="truncate" title={site.notes}>
              {site.notes}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
