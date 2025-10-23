import { COLORS } from "~/components/ui"

import { BalanceTabs } from "./BalanceTabs"
import { TokenStats } from "./TokenStats"
import { UpdateTimeAndWarning } from "./UpdateTimeAndWarning"

const BalanceSection = () => {
  return (
    <section
      className={`bg-gradient-to-br from-blue-50/50 to-indigo-50/30 p-3 dark:from-blue-900/20 dark:to-indigo-900/10 sm:p-4 ${COLORS.border.default} border-b`}>
      <div className="space-y-3">
        <BalanceTabs />
        <TokenStats />
      </div>

      <UpdateTimeAndWarning />
    </section>
  )
}

export default BalanceSection
