import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
import React from "react"
import CountUp from "react-countup"

import { UI_CONSTANTS } from "~/constants/ui"
import type { CurrencyAmount, CurrencyType } from "~/types"
import { getCurrencySymbol } from "~/utils/formatters"

interface BalanceTabsProps {
  activeTab: "consumption" | "balance"
  onTabChange: (index: number) => void
  currencyType: CurrencyType
  onCurrencyToggle: () => void
  totalConsumption: CurrencyAmount
  totalBalance: CurrencyAmount
  isInitialLoad: boolean
  prevTotalConsumption: CurrencyAmount
}

export const BalanceTabs: React.FC<BalanceTabsProps> = ({
  activeTab,
  onTabChange,
  currencyType,
  onCurrencyToggle,
  totalConsumption,
  totalBalance,
  isInitialLoad,
  prevTotalConsumption
}) => {
  return (
    <div>
      <TabGroup
        selectedIndex={activeTab === "consumption" ? 0 : 1}
        onChange={onTabChange}>
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
            {/* 今日消耗面板 */}
            <div className="flex items-center space-x-1">
              <button
                onClick={onCurrencyToggle}
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
            {/* 总余额面板 */}
            <div className="flex items-center space-x-1">
              <button
                onClick={onCurrencyToggle}
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
