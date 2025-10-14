import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
import React, { useMemo } from "react"
import CountUp from "react-countup"

import {
  DATA_TYPE_BALANCE,
  DATA_TYPE_CONSUMPTION,
  UI_CONSTANTS
} from "~/constants/ui"
import { useUserPreferencesContext } from "~/contexts/UserPreferencesContext"
import { useAccountDataContext } from "~/features/AccountManagement/hooks/AccountDataContext"
import {
  calculateTotalBalance,
  calculateTotalConsumption,
  getCurrencySymbol,
  getOppositeCurrency
} from "~/utils/formatters"

const StyledTab: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Tab
    className={({ selected }) =>
      `px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
        selected
          ? "bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text-primary shadow-sm"
          : "text-gray-500 dark:text-dark-text-secondary hover:text-gray-700 dark:hover:text-dark-text-primary"
      }`
    }>
    {children}
  </Tab>
)

const BalanceDisplay: React.FC<{
  value: number
  startValue: number
  isInitialLoad: boolean
  currencyType: "USD" | "CNY"
  onCurrencyToggle: () => void
  isConsumption?: boolean
  compact?: boolean
}> = ({
  value,
  startValue,
  isInitialLoad,
  currencyType,
  onCurrencyToggle,
  isConsumption = false,
  compact = false
}) => (
  <div className="flex items-center space-x-1 break-all">
    <button
      onClick={onCurrencyToggle}
      className={`${compact ? "text-2xl" : "text-5xl"} font-bold text-gray-900 dark:text-dark-text-primary tracking-tight hover:text-blue-600 transition-colors cursor-pointer text-left`}
      title={`点击切换到 ${currencyType === "USD" ? "人民币" : "美元"}`}>
      {isConsumption && value > 0 ? "-" : ""}
      {getCurrencySymbol(currencyType)}
      <CountUp
        start={startValue}
        end={value}
        duration={
          isInitialLoad
            ? UI_CONSTANTS.ANIMATION.INITIAL_DURATION
            : UI_CONSTANTS.ANIMATION.UPDATE_DURATION
        }
        decimals={2}
        preserveValue
      />
    </button>
  </div>
)

export const BalanceTabs: React.FC = () => {
  const { accounts, displayData, stats, isInitialLoad, prevTotalConsumption } =
    useAccountDataContext()
  const { activeTab, currencyType, updateActiveTab, updateCurrencyType } =
    useUserPreferencesContext()

  const totalConsumption = useMemo(
    () => calculateTotalConsumption(stats, accounts),
    [stats, accounts]
  )

  const totalBalance = useMemo(
    () => calculateTotalBalance(displayData),
    [displayData]
  )

  const totalIncome = useMemo(() => {
    return {
      USD: parseFloat(
        (
          stats.today_total_income /
          UI_CONSTANTS.EXCHANGE_RATE.CONVERSION_FACTOR
        ).toFixed(2)
      ),
      CNY: displayData.reduce((sum, site) => {
        return sum + (site.todayIncome?.CNY || 0)
      }, 0)
    }
  }, [stats, displayData])

  const handleTabChange = (index: number) => {
    const newTab = index === 0 ? DATA_TYPE_CONSUMPTION : DATA_TYPE_BALANCE
    updateActiveTab(newTab)
  }

  const handleCurrencyToggle = () => {
    updateCurrencyType(getOppositeCurrency(currencyType))
  }

  return (
    <div>
      <TabGroup
        selectedIndex={activeTab === DATA_TYPE_CONSUMPTION ? 0 : 1}
        onChange={handleTabChange}>
        <div className="flex justify-start mb-3">
          <TabList className="flex space-x-1 bg-gray-100 dark:bg-dark-bg-primary rounded-lg p-1">
            <StyledTab>今日统计</StyledTab>
            <StyledTab>总余额</StyledTab>
          </TabList>
        </div>

        <TabPanels>
          <TabPanel>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-dark-text-secondary">
                  今日消耗
                </span>
                <BalanceDisplay
                  value={totalConsumption[currencyType]}
                  startValue={
                    isInitialLoad ? 0 : prevTotalConsumption[currencyType]
                  }
                  isInitialLoad={isInitialLoad}
                  currencyType={currencyType}
                  onCurrencyToggle={handleCurrencyToggle}
                  isConsumption
                  compact
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-dark-text-secondary">
                  今日收入
                </span>
                <BalanceDisplay
                  value={totalIncome[currencyType]}
                  startValue={0}
                  isInitialLoad={isInitialLoad}
                  currencyType={currencyType}
                  onCurrencyToggle={handleCurrencyToggle}
                  isConsumption={false}
                  compact
                />
              </div>
            </div>
          </TabPanel>

          <TabPanel>
            <BalanceDisplay
              value={totalBalance[currencyType]}
              startValue={0}
              isInitialLoad={isInitialLoad}
              currencyType={currencyType}
              onCurrencyToggle={handleCurrencyToggle}
            />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  )
}
