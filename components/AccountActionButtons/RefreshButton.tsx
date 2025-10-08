import { ArrowPathIcon } from "@heroicons/react/24/outline"
import React from "react"

import type { DisplaySiteData } from "~/types"

import Tooltip from "../Tooltip"

interface RefreshButtonProps {
  site: DisplaySiteData
  refreshingAccountId: string | null
  onRefreshAccount: (site: DisplaySiteData, force: boolean) => Promise<void>
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({
  site,
  refreshingAccountId,
  onRefreshAccount
}) => {
  return (
    <Tooltip content="刷新账号" position="top">
      <button
        onClick={() => onRefreshAccount(site, true)}
        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
        disabled={refreshingAccountId === site.id}>
        <ArrowPathIcon
          className={`w-4 h-4 text-gray-500 ${
            refreshingAccountId === site.id ? "animate-spin" : ""
          }`}
        />
      </button>
    </Tooltip>
  )
}
