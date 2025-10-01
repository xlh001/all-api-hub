import React from "react"

import type {
  BalanceType,
  CurrencyAmount,
  CurrencyType,
  TokenUsage
} from "~/types"

import { BalanceTabs } from "./BalanceTabs"
import { TokenStats } from "./TokenStats"
import { UpdateTimeAndWarning } from "./UpdateTimeAndWarning"

interface BalanceSectionProps {
  // 金额数据
  totalConsumption: CurrencyAmount
  totalBalance: CurrencyAmount
  todayTokens: TokenUsage

  // 状态
  currencyType: CurrencyType
  activeTab: BalanceType
  isInitialLoad: boolean
  lastUpdateTime: Date

  // 动画相关
  prevTotalConsumption: CurrencyAmount

  // 显示当前站点是否已添加
  detectedAccountName?: string

  // 事件处理
  onCurrencyToggle: () => void
  onTabChange: (index: number) => void
}

export default function BalanceSection({
  totalConsumption,
  totalBalance,
  todayTokens,
  currencyType,
  activeTab,
  isInitialLoad,
  lastUpdateTime,
  prevTotalConsumption,
  detectedAccountName,
  onCurrencyToggle,
  onTabChange
}: BalanceSectionProps) {
  return (
    <div className="px-6 py-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/30">
      <div className="space-y-3">
        <BalanceTabs
          activeTab={activeTab}
          onTabChange={onTabChange}
          currencyType={currencyType}
          onCurrencyToggle={onCurrencyToggle}
          totalConsumption={totalConsumption}
          totalBalance={totalBalance}
          isInitialLoad={isInitialLoad}
          prevTotalConsumption={prevTotalConsumption}
        />

        <TokenStats todayTokens={todayTokens} />
      </div>

      <UpdateTimeAndWarning
        lastUpdateTime={lastUpdateTime}
        detectedAccountName={detectedAccountName}
      />
    </div>
  )
}
