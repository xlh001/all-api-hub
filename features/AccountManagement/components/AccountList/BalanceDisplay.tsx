import React from "react"
import CountUp from "react-countup"

import { UI_CONSTANTS } from "~/constants/ui"
import { useUserPreferencesContext } from "~/contexts/UserPreferencesContext"
import { useAccountActionsContext } from "~/features/AccountManagement/hooks/AccountActionsContext"
import { useAccountDataContext } from "~/features/AccountManagement/hooks/AccountDataContext"
import type { DisplaySiteData } from "~/types"
import { getCurrencySymbol } from "~/utils/formatters"

interface BalanceDisplayProps {
  site: DisplaySiteData
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = React.memo(({ site }) => {
  const { isInitialLoad, prevBalances } = useAccountDataContext()
  const { currencyType } = useUserPreferencesContext()
  const { handleRefreshAccount, refreshingAccountId } =
    useAccountActionsContext()

  const isRefreshing = refreshingAccountId === site.id

  const handleBalanceClick = async () => {
    if (!isRefreshing) {
      await handleRefreshAccount(site, true) // Force refresh
    }
  }

  const handleConsumptionClick = async () => {
    if (!isRefreshing) {
      await handleRefreshAccount(site, true) // Force refresh
    }
  }

  return (
    <div className="text-right flex-1 min-w-[40px] overflow-hidden">
      <div
        className={`font-semibold text-gray-900 dark:text-dark-text-primary text-lg mb-0.5 transition-all duration-200 truncate ${
          isRefreshing
            ? "opacity-60 animate-pulse"
            : "cursor-pointer hover:opacity-80 hover:scale-105"
        }`}
        onClick={handleBalanceClick}
        title="点击刷新余额">
        {getCurrencySymbol(currencyType)}
        <CountUp
          start={isInitialLoad ? 0 : prevBalances[site.id]?.[currencyType] || 0}
          end={site.balance[currencyType]}
          duration={
            isInitialLoad
              ? UI_CONSTANTS.ANIMATION.SLOW_DURATION
              : UI_CONSTANTS.ANIMATION.FAST_DURATION
          }
          decimals={2}
          preserveValue
        />
      </div>
      <div
        className={`text-xs transition-all duration-200 truncate ${
          site.todayConsumption[currencyType] > 0
            ? "text-green-500"
            : "text-gray-400 dark:text-dark-text-tertiary"
        } ${
          isRefreshing
            ? "opacity-60 animate-pulse"
            : "cursor-pointer hover:opacity-80 hover:scale-105"
        }`}
        onClick={handleConsumptionClick}
        title="点击刷新今日消费">
        -{getCurrencySymbol(currencyType)}
        <CountUp
          start={isInitialLoad ? 0 : 0}
          end={site.todayConsumption[currencyType]}
          duration={
            isInitialLoad
              ? UI_CONSTANTS.ANIMATION.SLOW_DURATION
              : UI_CONSTANTS.ANIMATION.FAST_DURATION
          }
          decimals={2}
          preserveValue
        />
      </div>
    </div>
  )
})
export default BalanceDisplay
