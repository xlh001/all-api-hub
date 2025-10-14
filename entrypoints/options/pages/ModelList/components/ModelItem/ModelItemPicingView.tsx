import { CurrencyType } from "~/types"
import { CalculatedPrice } from "~/utils/modelPricing.ts"

interface PriceViewProps {
  calculatedPrice: CalculatedPrice
  showRealPrice: boolean
  tokenBillingType: boolean
  isAvailableForUser: boolean
  formatPriceCompact: (price: number, currency?: CurrencyType) => string
}
export const PriceView = ({
  calculatedPrice,
  showRealPrice,
  tokenBillingType,
  isAvailableForUser,
  formatPriceCompact
}: PriceViewProps) => {
  let inputPrice = showRealPrice
    ? `${formatPriceCompact(calculatedPrice.inputCNY, "CNY")}`
    : `${formatPriceCompact(calculatedPrice.inputUSD, "USD")}`

  let outputPrice = showRealPrice
    ? `${formatPriceCompact(calculatedPrice.outputCNY, "CNY")}`
    : `${formatPriceCompact(calculatedPrice.outputUSD, "USD")}`

  if (tokenBillingType) {
    inputPrice += "/M"
    outputPrice += "/M"
  }

  return (
    <div className="flex items-center gap-6">
      {/* 输入价格 */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 dark:text-dark-text-primary">
          输入:
        </span>
        <span
          className={`text-sm ${
            isAvailableForUser ? "text-blue-600" : "text-gray-500"
          }`}>
          {inputPrice}
        </span>
      </div>

      {/* 输出价格 */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 dark:text-dark-text-primary">
          输出:
        </span>
        <span
          className={`text-sm ${
            isAvailableForUser ? "text-green-600" : "text-gray-500"
          }`}>
          {outputPrice}
        </span>
      </div>
    </div>
  )
}
