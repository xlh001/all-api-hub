import React from "react"

import type { ModelPricing } from "~/services/apiService/common/type"
import type { CalculatedPrice } from "~/utils/modelPricing"
import { formatPriceCompact } from "~/utils/modelPricing"

interface ModelItemPricingProps {
  model: ModelPricing
  calculatedPrice: CalculatedPrice
  exchangeRate: number
  showRealPrice: boolean
  showRatioColumn: boolean
  isAvailableForUser: boolean
}

export const ModelItemPricing: React.FC<ModelItemPricingProps> = ({
  model,
  calculatedPrice,
  exchangeRate,
  showRealPrice,
  showRatioColumn,
  isAvailableForUser
}) => {
  return (
    <div className="mt-2">
      {model.quota_type === 0 ? (
        // 按量计费 - 横向并排显示价格
        <div className="flex items-center gap-6">
          {/* 输入价格 */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">输入:</span>
            <span
              className={`text-sm ${
                isAvailableForUser ? "text-blue-600" : "text-gray-500"
              }`}>
              {showRealPrice
                ? `${formatPriceCompact(calculatedPrice.inputCNY, "CNY")}/M`
                : `${formatPriceCompact(calculatedPrice.inputUSD, "USD")}/M`}
            </span>
          </div>

          {/* 输出价格 */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">输出:</span>
            <span
              className={`text-sm ${
                isAvailableForUser ? "text-green-600" : "text-gray-500"
              }`}>
              {showRealPrice
                ? `${formatPriceCompact(calculatedPrice.outputCNY, "CNY")}/M`
                : `${formatPriceCompact(calculatedPrice.outputUSD, "USD")}/M`}
            </span>
          </div>

          {/* 倍率显示 */}
          {showRatioColumn && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">倍率:</span>
              <span
                className={`text-sm font-medium ${
                  isAvailableForUser ? "text-gray-900" : "text-gray-500"
                }`}>
                {model.model_ratio}x
              </span>
            </div>
          )}
        </div>
      ) : (
        // 按次计费
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">每次调用:</span>
          <span
            className={`text-sm ${
              isAvailableForUser ? "text-purple-600" : "text-gray-500"
            }`}>
            {showRealPrice
              ? formatPriceCompact(
                  (calculatedPrice.perCallPrice || 0) * exchangeRate,
                  "CNY"
                )
              : formatPriceCompact(calculatedPrice.perCallPrice || 0, "USD")}
          </span>
        </div>
      )}
    </div>
  )
}
