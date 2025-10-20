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
import { UI_CONSTANTS } from "~/constants/ui"
import { useAccountActionsContext } from "~/features/AccountManagement/hooks/AccountActionsContext"
import { useAccountDataContext } from "~/features/AccountManagement/hooks/AccountDataContext"
import type { DisplaySiteData } from "~/types"
import { openCheckInPage } from "~/utils/navigation"
import { getHealthStatusDisplay, getStatusIndicatorColor } from "~/features/AccountManagement/utils/healthStatusUtils"

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
    <div className="flex items-center space-x-3 flex-1 min-w-[100px]">
      <div className="flex-1 min-w-[100px]">
        <div className="flex items-center space-x-2 mb-0.5">
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
              <span className={`text-yellow-700`}>{t("list.site.currentSite")}</span>
            </Tooltip>
          )}
          <div className="font-medium text-gray-900 dark:text-dark-text-primary text-sm truncate">
            <a
              href={site.baseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline">
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
              <button onClick={handleCheckIn(site.checkIn.customCheckInUrl)}>
                <CurrencyYenIcon className="h-4 w-4 text-green-500" />
              </button>
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
                    <button onClick={handleCheckIn()}>
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    </button>
                  </Tooltip>
                ) : (
                  <Tooltip
                    content={t("list.site.notCheckedInToday")}
                    position="top"
                    wrapperClassName="flex justify-center items-center">
                    <button onClick={handleCheckIn()}>
                      <XCircleIcon className="h-4 w-4 text-red-500" />
                    </button>
                  </Tooltip>
                )}
              </>
            )
          )}
        </div>
        <div className="text-xs text-gray-500 dark:text-dark-text-secondary truncate ml-4 flex items-start space-x-1">
          <UserIcon className="h-3 w-3 mt-0.5 flex-shrink-0" />
          <span className="truncate" title={site.username}>
            {site.username}
          </span>
        </div>
        {site.notes && (
          <div className="text-xs text-gray-500 dark:text-dark-text-secondary truncate ml-4 mt-1 flex items-start space-x-1">
            <PencilSquareIcon className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span className="truncate" title={site.notes}>
              {site.notes}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
