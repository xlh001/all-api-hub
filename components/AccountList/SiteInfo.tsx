import { PencilSquareIcon } from "@heroicons/react/24/outline"

import { HEALTH_STATUS_MAP, UI_CONSTANTS } from "~/constants/ui"
import type { DisplaySiteData } from "~/types"

import Tooltip from "../Tooltip"

interface SiteInfoProps {
  site: DisplaySiteData
  detectedAccountId?: string | null
}

export default function SiteInfo({ site, detectedAccountId }: SiteInfoProps) {
  return (
    <div className="flex items-center space-x-3 flex-1 min-w-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-0.5">
          <div
            className={`w-2 h-2 rounded-full flex-shrink-0 ${
              HEALTH_STATUS_MAP[site.healthStatus]?.color ||
              UI_CONSTANTS.STYLES.STATUS_INDICATOR.UNKNOWN
            }`}></div>
          {site.id === detectedAccountId && (
            <Tooltip content="当前tab站点已经存在" position="top">
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
        </div>
        <div className="text-xs text-gray-500 truncate ml-4">
          {site.username}
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
