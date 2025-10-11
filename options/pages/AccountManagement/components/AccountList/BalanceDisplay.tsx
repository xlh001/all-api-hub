import React from "react"
import CountUp from "react-countup"

import { UI_CONSTANTS } from "~/constants/ui"
import { useUserPreferencesContext } from "~/contexts/UserPreferencesContext"
import { useAccountDataContext } from "~/options/pages/AccountManagement/hooks/AccountDataContext"
import type { DisplaySiteData } from "~/types"
import { getCurrencySymbol } from "~/utils/formatters"

interface BalanceDisplayProps {
  site: DisplaySiteData
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = React.memo(({ site }) => {
  const { isInitialLoad, prevBalances } = useAccountDataContext()
  const { currencyType } = useUserPreferencesContext()

  return (
    <div className="text-right flex-shrink-0">
      <div className="font-semibold text-gray-900 text-lg mb-0.5">
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
        className={`text-xs ${
          site.todayConsumption[currencyType] > 0
            ? "text-green-500"
            : "text-gray-400"
        }`}>
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
