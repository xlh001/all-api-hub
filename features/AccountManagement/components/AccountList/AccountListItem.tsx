import React from "react"

import { CardItem } from "~/components/ui"
import { useDevice } from "~/contexts/DeviceContext"
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
    const { handleMouseEnter, handleMouseLeave } = useAccountListItem()
    const { isTouchDevice } = useDevice()

    // 触摸设备始终显示按钮，PC端根据hover状态显示
    const revealButtonsClass = isTouchDevice
      ? ""
      : "opacity-0 pointer-events-none group-hover:opacity-100 group-focus-within:opacity-100 group-hover:pointer-events-auto group-focus-within:pointer-events-auto"

    const isDetected = site.id === detectedAccount?.id

    return (
      <CardItem
        padding="none"
        className={`px-3 sm:px-4 py-2.5 sm:py-3 group touch-manipulation transition-all ${
          isDetected
            ? "bg-blue-50 dark:bg-blue-900/50 border-l-4 border-l-blue-500 dark:border-l-blue-400"
            : ""
        }`}
        onMouseEnter={() => handleMouseEnter(site.id)}
        onMouseLeave={handleMouseLeave}>
        <div className="flex items-center gap-1 sm:gap-2 min-w-0 w-full">
          {/* 左侧：站点信息 - 可压缩 */}
          <div className="flex-1 min-w-0">
            <SiteInfo site={site} />
          </div>

          {/* 中间：操作按钮 - 固定不压缩 */}
          <div
            className={`flex-shrink-0 transition-opacity duration-200 ${revealButtonsClass}`}>
            <AccountActionButtons
              site={site}
              onDeleteAccount={onDeleteWithDialog}
              onCopyKey={onCopyKey}
            />
          </div>

          {/* 右侧：余额显示 - 可压缩 */}
          <div className="flex-1 min-w-0 max-w-[120px] sm:max-w-[140px]">
            <BalanceDisplay site={site} />
          </div>
        </div>
      </CardItem>
    )
  }
)

AccountListItem.displayName = "AccountListItem"

export default AccountListItem
