import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PencilSquareIcon,
  UserIcon,
  XCircleIcon
} from "@heroicons/react/24/outline"

import { HEALTH_STATUS_MAP, UI_CONSTANTS } from "~/constants/ui"
import { useAccountDataContext } from "~/features/AccountManagement/hooks/AccountDataContext"
import type { DisplaySiteData } from "~/types"

import Tooltip from "../../../../components/Tooltip"

interface SiteInfoProps {
  site: DisplaySiteData
}

export default function SiteInfo({ site }: SiteInfoProps) {
  const { detectedAccount } = useAccountDataContext()
  const detectedAccountId = detectedAccount?.id

  return (
    <div className="flex items-center space-x-3 flex-1 min-w-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-0.5">
          <Tooltip
            content={
              <div className="text-xs">
                <p>
                  状态:{" "}
                  <span
                    className={
                      HEALTH_STATUS_MAP[site.health?.status]?.color ||
                      "text-gray-400"
                    }>
                    {HEALTH_STATUS_MAP[site.health?.status]?.text || "未知"}
                  </span>
                </p>
                {site.health?.reason && <p>原因: {site.health.reason}</p>}
                <p>
                  上次同步:{" "}
                  {site.last_sync_time
                    ? new Date(site.last_sync_time).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            }
            position="right">
            <div
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                HEALTH_STATUS_MAP[site.health?.status]?.color ||
                UI_CONSTANTS.STYLES.STATUS_INDICATOR.UNKNOWN
              }`}></div>
          </Tooltip>
          {site.id === detectedAccountId && (
            <Tooltip content="当前标签页站点已存在" position="top">
              <span className={`text-yellow-700`}>当前站点</span>
            </Tooltip>
          )}
          <div className="font-medium text-gray-900 text-sm truncate">
            <a
              href={site.baseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline">
              {site.name}
            </a>
          </div>
          {site.supports_check_in && (
            <>
              {site.can_check_in === undefined ? (
                <Tooltip content="站点可能不支持签到" position="top">
                  <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
                </Tooltip>
              ) : site.can_check_in === false ? (
                <Tooltip content="今日已签到" position="top">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                </Tooltip>
              ) : (
                <Tooltip content="今日未签到" position="top">
                  <XCircleIcon className="h-4 w-4 text-red-500" />
                </Tooltip>
              )}
            </>
          )}
        </div>
        <div className="text-xs text-gray-500 truncate ml-4 flex items-start space-x-1">
          <UserIcon className="h-3 w-3 mt-0.5 flex-shrink-0" />
          <span className="truncate" title={site.username}>
            {site.username}
          </span>
        </div>
        {site.notes && (
          <div className="text-xs text-gray-500 truncate ml-4 mt-1 flex items-start space-x-1">
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
