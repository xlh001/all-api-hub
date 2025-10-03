import React from "react"

import { PriceView } from "~/components/ModelItem/ModelItemPicingView"
import { formatPriceCompact } from "~/utils/modelPricing"

export const ModelItemPerCallPricingView = ({
  perCallPrice,
  isAvailableForUser,
  exchangeRate,
  showRealPrice,
  tokenBillingType
}) => {
  const calculatedPrice = {
    inputUSD: perCallPrice.input,
    inputCNY: perCallPrice.input * exchangeRate,
    outputUSD: perCallPrice.output,
    outputCNY: perCallPrice.output * exchangeRate
  }
  return typeof perCallPrice === "number" ? (
    <span
      className={`text-sm ${
        isAvailableForUser ? "text-purple-600" : "text-gray-500"
      }`}>
      {showRealPrice
        ? formatPriceCompact((perCallPrice || 0) * exchangeRate, "CNY")
        : formatPriceCompact(perCallPrice || 0, "USD")}
    </span>
  ) : (
    <PriceView
      calculatedPrice={calculatedPrice}
      showRealPrice={showRealPrice}
      tokenBillingType={tokenBillingType}
      isAvailableForUser={isAvailableForUser}
      formatPriceCompact={formatPriceCompact}
    />
  )
}
