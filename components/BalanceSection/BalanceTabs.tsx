import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
import React, { useMemo } from "react"
import CountUp from "react-countup"

import {
  DATA_TYPE_BALANCE,
  DATA_TYPE_CONSUMPTION,
  UI_CONSTANTS
} from "~/constants/ui"
import { useAccountDataContext, useUserPreferencesContext } from "~/contexts"
import {
  calculateTotalBalance,
  calculateTotalConsumption,
  getCurrencySymbol,
  getOppositeCurrency
} from "~/utils/formatters"

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
            <Tab
              className={({ selected }) =>
                `px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  selected
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`
              }>
              今日消耗
            </Tab>
            <Tab
              className={({ selected }) =>
                `px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  selected
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`
              }>
              总余额
            </Tab>
          </TabList>
        </div>

        <TabPanels>
          <TabPanel>
            <div className="flex items-center space-x-1">
              <button
                onClick={handleCurrencyToggle}
                className="text-5xl font-bold text-gray-900 tracking-tight hover:text-blue-600 transition-colors cursor-pointer"
                title={`点击切换到 ${currencyType === "USD" ? "人民币" : "美元"}`}>
                {totalConsumption[currencyType] > 0 ? "-" : ""}
                {getCurrencySymbol(currencyType)}
                <CountUp
                  start={isInitialLoad ? 0 : prevTotalConsumption[currencyType]}
                  end={totalConsumption[currencyType]}
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
          </TabPanel>

          <TabPanel>
            <div className="flex items-center space-x-1">
              <button
                onClick={handleCurrencyToggle}
                className="text-5xl font-bold text-gray-900 tracking-tight hover:text-blue-600 transition-colors cursor-pointer"
                title={`点击切换到 ${currencyType === "USD" ? "人民币" : "美元"}`}>
                {getCurrencySymbol(currencyType)}
                <CountUp
                  start={isInitialLoad ? 0 : 0}
                  end={totalBalance[currencyType]}
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
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  )
}
