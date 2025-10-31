import {
  ArrowPathIcon,
  CheckCircleIcon,
  CurrencyYenIcon,
  ExclamationTriangleIcon,
  GiftIcon,
  LinkIcon,
  PencilSquareIcon,
  UserIcon,
  XCircleIcon
} from "@heroicons/react/24/outline"
import { PinIcon } from "lucide-react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

import Tooltip from "~/components/Tooltip"
import { Badge, BodySmall, Caption, IconButton } from "~/components/ui"
import { UI_CONSTANTS } from "~/constants/ui"
import { useAccountActionsContext } from "~/features/AccountManagement/hooks/AccountActionsContext"
import { useAccountDataContext } from "~/features/AccountManagement/hooks/AccountDataContext"
import type {
  HighlightFragment,
  SearchResultWithHighlight
} from "~/features/AccountManagement/hooks/useAccountSearch"
import {
  getHealthStatusDisplay,
  getStatusIndicatorColor
} from "~/features/AccountManagement/utils/healthStatusUtils"
import type { DisplaySiteData } from "~/types"
import {
  openCheckInAndRedeem,
  openCheckInPage,
  openCustomCheckInPage
} from "~/utils/navigation"

interface SiteInfoProps {
  site: DisplaySiteData
  highlights?: SearchResultWithHighlight["highlights"]
}

function renderHighlightedFragments(
  fragments: HighlightFragment[] | undefined,
  fallback: string
) {
  if (!fragments || fragments.length === 0) {
    return fallback
  }

  return fragments.map((fragment, index) =>
    fragment.highlighted ? (
      <mark
        key={`${fragment.text}-${index}`}
        className="rounded bg-yellow-200 px-0.5 text-gray-900 dark:bg-yellow-500/30 dark:text-dark-text-primary">
        {fragment.text}
      </mark>
    ) : (
      <span key={`${fragment.text}-${index}`}>{fragment.text}</span>
    )
  )
}

export default function SiteInfo({ site, highlights }: SiteInfoProps) {
  const { t } = useTranslation("account")
  const { t: tMessages } = useTranslation("messages")
  const { detectedAccount, isAccountPinned, togglePinAccount } =
    useAccountDataContext()
  const { handleRefreshAccount, refreshingAccountId, handleMarkAsCheckedIn } =
    useAccountActionsContext()
  const detectedAccountId = detectedAccount?.id

  const isPinned = isAccountPinned(site.id)
  const pinTooltipLabel = isPinned ? t("actions.unpin") : t("actions.pin")
  const isRefreshing = refreshingAccountId === site.id

  const handlePinClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const success = await togglePinAccount(site.id)
    if (success) {
      const message = isPinned
        ? tMessages("toast.success.accountUnpinned", {
            accountName: site.name
          })
        : tMessages("toast.success.accountPinned", {
            accountName: site.name
          })
      toast.success(message)
    }
  }

  const handleCheckIn = (customCheckInUrl?: string) => async () => {
    try {
      if (customCheckInUrl) {
        await handleMarkAsCheckedIn(site)
        // Check if we should open redeem page with check-in
        // Default to true for backward compatibility
        const shouldOpenRedeem = site.checkIn?.openRedeemWithCheckIn ?? true
        if (shouldOpenRedeem) {
          await openCheckInAndRedeem(site)
        } else {
          await openCustomCheckInPage(site)
        }
      } else {
        await openCheckInPage(site)
      }
    } catch (error) {
      console.error("Failed to handle check-in navigation:", error)
    }
  }

  const renderCheckInIcon = () => {
    if (site.checkIn?.customCheckInUrl) {
      if (site.checkIn.isCheckedInToday) {
        return (
          <Tooltip
            content={t("list.site.checkedInToday")}
            position="top"
            wrapperClassName="flex items-center">
            <IconButton
              onClick={handleCheckIn(site.checkIn.customCheckInUrl)}
              variant="ghost"
              size="xs"
              aria-label={t("list.site.checkedInToday")}>
              <CurrencyYenIcon className="h-4 w-4 text-green-500" />
            </IconButton>
          </Tooltip>
        )
      }

      return (
        <Tooltip
          content={t("list.site.notCheckedInToday")}
          position="top"
          wrapperClassName="flex items-center">
          <IconButton
            onClick={handleCheckIn(site.checkIn.customCheckInUrl)}
            variant="ghost"
            size="xs"
            aria-label={t("list.site.notCheckedInToday")}>
            <CurrencyYenIcon className="h-4 w-4 text-red-500" />
          </IconButton>
        </Tooltip>
      )
    }

    if (site.checkIn?.enableDetection) {
      if (site.checkIn.isCheckedInToday === undefined) {
        return (
          <Tooltip
            content={t("list.site.checkInUnsupported")}
            position="top"
            wrapperClassName="flex items-center">
            <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
          </Tooltip>
        )
      }

      if (site.checkIn.isCheckedInToday) {
        return (
          <Tooltip
            content={t("list.site.checkedInToday")}
            position="top"
            wrapperClassName="flex items-center">
            <IconButton
              onClick={handleCheckIn()}
              variant="ghost"
              size="xs"
              aria-label={t("list.site.checkedInToday")}>
              <CheckCircleIcon className="h-4 w-4 text-green-500" />
            </IconButton>
          </Tooltip>
        )
      }

      return (
        <Tooltip
          content={t("list.site.notCheckedInToday")}
          position="top"
          wrapperClassName="flex items-center">
          <IconButton
            onClick={handleCheckIn()}
            variant="ghost"
            size="xs"
            aria-label={t("list.site.notCheckedInToday")}>
            <XCircleIcon className="h-4 w-4 text-red-500" />
          </IconButton>
        </Tooltip>
      )
    }

    return null
  }

  const handleHealthClick = async () => {
    if (!isRefreshing) {
      await handleRefreshAccount(site, true) // Force refresh
    }
  }

  return (
    <div className="flex w-full min-w-0 items-start gap-2 sm:gap-3">
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-start gap-1.5">
          {/* Status indicators container */}
          <div className="flex flex-col items-center gap-0.5">
            {/* Health Status Indicator */}
            <Tooltip
              content={
                <div className="space-y-1">
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
              <button
                className={`h-2 w-2 flex-shrink-0 rounded-full transition-all duration-200 ${
                  isRefreshing
                    ? "animate-pulse opacity-60"
                    : "cursor-pointer hover:scale-125"
                } ${
                  getStatusIndicatorColor(site.health?.status) ||
                  UI_CONSTANTS.STYLES.STATUS_INDICATOR.UNKNOWN
                }`}
                onClick={handleHealthClick}
                aria-label={t("list.site.refreshHealthStatus")}
              />
            </Tooltip>

            {/* Pin Indicator */}
            <Tooltip content={pinTooltipLabel} position="right">
              <button
                type="button"
                onClick={handlePinClick}
                className="flex h-2 w-2 items-center justify-center transition-transform duration-200 hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label={pinTooltipLabel}>
                <PinIcon
                  className={`h-2 w-2 -rotate-12 transition-colors ${
                    isPinned
                      ? "text-gray-600 dark:text-gray-200"
                      : "text-gray-400 dark:text-dark-text-tertiary"
                  }`}
                  aria-hidden="true"
                />
              </button>
            </Tooltip>
          </div>

          {/* Current Site Badge */}
          {site.id === detectedAccountId && (
            <Tooltip content={t("list.site.currentSiteExists")} position="top">
              <Badge variant="warning" size="sm" className="whitespace-nowrap">
                {t("list.site.currentSite")}
              </Badge>
            </Tooltip>
          )}

          {/* Site Name Link */}
          <div className="flex min-w-0 items-center gap-2">
            <a
              href={site.baseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block min-w-0 truncate"
              title={site.name}>
              <BodySmall weight="medium" className="truncate">
                {renderHighlightedFragments(highlights?.name, site.name)}
              </BodySmall>
            </a>
          </div>

          <div className="flex items-center gap-2">
            {/* Inline check-in placed next to site name for tighter spacing */}
            {renderCheckInIcon()}
          </div>
        </div>

        {/* Username */}
        <div className="ml-3 flex min-w-0 items-start gap-1 sm:ml-4">
          <UserIcon className="mt-0.5 h-3 w-3 flex-shrink-0 text-gray-400 dark:text-dark-text-tertiary" />
          <Caption className="truncate" title={site.username}>
            {highlights?.username && site.username
              ? renderHighlightedFragments(highlights.username, site.username)
              : site.username}
          </Caption>
        </div>

        {/* Highlighted Base URL */}
        {highlights?.baseUrl && (
          <div className="ml-3 mt-0.5 flex min-w-0 items-start gap-1 sm:ml-4">
            <LinkIcon className="mt-0.5 h-3 w-3 flex-shrink-0 text-gray-400 dark:text-dark-text-tertiary" />
            <Caption className="truncate" title={site.baseUrl}>
              {renderHighlightedFragments(highlights.baseUrl, site.baseUrl)}
            </Caption>
          </div>
        )}

        {/* Highlighted Custom Check-in URL */}
        {highlights?.customCheckInUrl && site.checkIn?.customCheckInUrl && (
          <div className="ml-3 mt-0.5 flex min-w-0 items-start gap-1 sm:ml-4">
            <ArrowPathIcon className="mt-0.5 h-3 w-3 flex-shrink-0 text-gray-400 dark:text-dark-text-tertiary" />
            <Caption className="truncate" title={site.checkIn.customCheckInUrl}>
              {renderHighlightedFragments(
                highlights.customCheckInUrl,
                site.checkIn.customCheckInUrl
              )}
            </Caption>
          </div>
        )}

        {/* Highlighted Custom Redeem URL */}
        {highlights?.customRedeemUrl && site.checkIn?.customRedeemUrl && (
          <div className="ml-3 mt-0.5 flex min-w-0 items-start gap-1 sm:ml-4">
            <GiftIcon className="mt-0.5 h-3 w-3 flex-shrink-0 text-gray-400 dark:text-dark-text-tertiary" />
            <Caption className="truncate" title={site.checkIn.customRedeemUrl}>
              {renderHighlightedFragments(
                highlights.customRedeemUrl,
                site.checkIn.customRedeemUrl
              )}
            </Caption>
          </div>
        )}

        {/* Notes */}
        {site.notes && (
          <div className="ml-3 mt-0.5 flex min-w-0 items-start gap-1 sm:ml-4 sm:mt-1">
            <PencilSquareIcon className="mt-0.5 h-3 w-3 flex-shrink-0 text-gray-400 dark:text-dark-text-tertiary" />
            <Caption className="truncate" title={site.notes}>
              {site.notes}
            </Caption>
          </div>
        )}
      </div>
    </div>
  )
}
