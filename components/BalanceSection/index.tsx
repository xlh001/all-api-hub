import React, { useMemo } from "react"

import { BalanceTabs } from "./BalanceTabs"
import { TokenStats } from "./TokenStats"
import { UpdateTimeAndWarning } from "./UpdateTimeAndWarning"

const BalanceSection = () => {
  return (
    <div className="p-4 bg-gradient-to-br from-blue-50/50 to-indigo-50/30">
      <div className="space-y-3">
        <BalanceTabs />
        <TokenStats />
      </div>

      <UpdateTimeAndWarning />
    </div>
  )
}

export default BalanceSection
