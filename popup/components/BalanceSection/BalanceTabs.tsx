import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
import React, { useMemo } from "react"
import CountUp from "react-countup"

import {
  DATA_TYPE_BALANCE,
  DATA_TYPE_CONSUMPTION,
  UI_CONSTANTS
} from "~/constants/ui"
import {
  calculateTotalBalance,
  calculateTotalConsumption,
  getCurrencySymbol,
  getOppositeCurrency
} from "~/utils/formatters"
import { useAccountDataContext } from "~/options/pages/AccountManagement/hooks/AccountDataContext"
import { useUserPreferencesContext } from "~/contexts/UserPreferencesContext"

const StyledTab: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Tab
    className={({ selected }) =>
      `px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
        selected
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-500 hover:text-gray-700"
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
}> = ({
  value,
  startValue,
  isInitialLoad,
  currencyType,
  onCurrencyToggle,
  isConsumption = false
}) => (
  <div className="flex items-center space-x-1 break-all">
    <button
      onClick={onCurrencyToggle}
      className="text-5xl font-bold text-gray-900 tracking-tight hover:text-blue-600 transition-colors cursor-pointer text-left"
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
          <TabList className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <StyledTab>今日消耗</StyledTab>
            <StyledTab>总余额</StyledTab>
          </TabList>
        </div>

        <TabPanels>
          <TabPanel>
            <BalanceDisplay
              value={totalConsumption[currencyType]}
              startValue={
                isInitialLoad ? 0 : prevTotalConsumption[currencyType]
              }
              isInitialLoad={isInitialLoad}
              currencyType={currencyType}
              onCurrencyToggle={handleCurrencyToggle}
              isConsumption
            />
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
