import React, { useEffect, useState } from "react"

import AccountActionButtons from "~/features/AccountManagement/components/AccountActionButtons"
import { useAccountListItem } from "~/features/AccountManagement/components/AccountList/hooks/useAccountListItem"
import { useAccountDataContext } from "~/features/AccountManagement/hooks/AccountDataContext"
import type { DisplaySiteData } from "~/types"

import BalanceDisplay from "./BalanceDisplay"
import SiteInfo from "./SiteInfo"

interface AccountListItemProps {
  site: DisplaySiteData
  onCopyKey: (site: DisplaySiteData) => void
  onDeleteWithDialog: (site: DisplaySiteData) => void
}

const AccountListItem: React.FC<AccountListItemProps> = React.memo(
  ({ site, onCopyKey, onDeleteWithDialog }) => {
    const { detectedAccount } = useAccountDataContext()
    const { hoveredSiteId, handleMouseEnter, handleMouseLeave } =
      useAccountListItem()

    // 检测是否为触摸设备
    const [isTouchDevice, setIsTouchDevice] = useState(false)

    useEffect(() => {
      // 检测是否为触摸设备
      const checkTouchDevice = () => {
        setIsTouchDevice(
          "ontouchstart" in window ||
            navigator.maxTouchPoints > 0 ||
            window.matchMedia("(pointer: coarse)").matches
        )
      }

      checkTouchDevice()

      // 监听媒体查询变化
      const mediaQuery = window.matchMedia("(pointer: coarse)")
      const handler = () => checkTouchDevice()

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handler)
        return () => mediaQuery.removeEventListener("change", handler)
      }
    }, [])

    // 触摸设备始终显示按钮，PC端根据hover状态显示
    const shouldShowButtons = isTouchDevice || hoveredSiteId === site.id

    return (
      <div
        className={`px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-50 dark:border-dark-bg-tertiary transition-colors relative group touch-manipulation ${
          site.id === detectedAccount?.id
            ? "bg-blue-50 dark:bg-blue-900/50"
            : "hover:bg-gray-25 dark:hover:bg-dark-bg-secondary active:bg-gray-50 dark:active:bg-dark-bg-tertiary"
        }`}
        onMouseEnter={() => handleMouseEnter(site.id)}
        onMouseLeave={handleMouseLeave}>
        <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
          <SiteInfo site={site} />

          {shouldShowButtons && (
            <AccountActionButtons
              site={site}
              onDeleteAccount={onDeleteWithDialog}
              onCopyKey={onCopyKey}
            />
          )}

          <BalanceDisplay site={site} />
        </div>
      </div>
    )
  }
)
export default AccountListItem
