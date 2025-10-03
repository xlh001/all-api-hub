import {
  CurrencyDollarIcon,
  ServerIcon,
  TagIcon
} from "@heroicons/react/24/outline"
import React from "react"

import type { ModelPricing } from "~/services/apiService/common/type"
import {
  formatPrice,
  getEndpointTypesText,
  isTokenBillingType,
  type CalculatedPrice
} from "~/utils/modelPricing"

interface ModelItemDetailsProps {
  model: ModelPricing
  calculatedPrice: CalculatedPrice
  showEndpointTypes: boolean
  userGroup: string
  onGroupClick?: (group: string) => void
}

export const ModelItemDetails: React.FC<ModelItemDetailsProps> = ({
  model,
  calculatedPrice,
  showEndpointTypes,
  userGroup,
  onGroupClick
}) => {
  return (
    <div className="border-t border-gray-100 px-4 py-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {/* 可用分组 */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <TagIcon className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-700">可用分组</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {model.enable_groups.map((group, index) => {
              const isCurrentGroup = group === userGroup
              const isClickable = onGroupClick && !isCurrentGroup

              return (
                <span
                  key={index}
                  onClick={isClickable ? () => onGroupClick(group) : undefined}
                  className={`inline-flex items-center px-2 py-1 rounded text-xs cursor-pointer transition-colors ${
                    isCurrentGroup
                      ? "bg-blue-100 text-blue-800 font-medium"
                      : isClickable
                        ? "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                        : "bg-gray-100 text-gray-600"
                  }`}
                  title={isClickable ? `点击切换到 ${group} 分组` : undefined}>
                  {isCurrentGroup && <TagIcon className="w-3 h-3 mr-1" />}
                  {group}
                </span>
              )
            })}
          </div>
        </div>

        {/* 可用端点类型 */}
        {showEndpointTypes && (
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <ServerIcon className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-gray-700">端点类型</span>
            </div>
            <div className="text-gray-600">
              {getEndpointTypesText(model.supported_endpoint_types)}
            </div>
          </div>
        )}

        {/* 详细定价信息（仅按量计费模型） */}
        {isTokenBillingType(model.quota_type) && (
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-2">
              <CurrencyDollarIcon className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-gray-700">详细定价</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <div className="text-gray-500">输入(1M tokens)</div>
                <div className="font-medium">
                  USD: {formatPrice(calculatedPrice.inputUSD, "USD")}
                </div>
                <div className="font-medium">
                  CNY: {formatPrice(calculatedPrice.inputCNY, "CNY")}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-gray-500">输出(1M tokens)</div>
                <div className="font-medium">
                  USD: {formatPrice(calculatedPrice.outputUSD, "USD")}
                </div>
                <div className="font-medium">
                  CNY: {formatPrice(calculatedPrice.outputCNY, "CNY")}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
