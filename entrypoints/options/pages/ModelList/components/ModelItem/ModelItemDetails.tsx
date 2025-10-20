import {
  CurrencyDollarIcon,
  ServerIcon,
  TagIcon
} from "@heroicons/react/24/outline"
import React from "react"
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation("modelList")
  return (
    <div className="border-t border-gray-100 dark:border-dark-bg-tertiary px-4 py-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {/* 可用分组 */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <TagIcon className="w-4 h-4 text-gray-400 dark:text-dark-text-tertiary" />
            <span className="font-medium text-gray-700 dark:text-dark-text-secondary">
              {t("availableGroups")}
            </span>
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
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 font-medium"
                      : isClickable
                        ? "bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300"
                        : "bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400"
                  }`}
                  title={
                    isClickable
                      ? t("clickSwitchGroup", { group })
                      : undefined
                  }>
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
              <ServerIcon className="w-4 h-4 text-gray-400 dark:text-dark-text-tertiary" />
              <span className="font-medium text-gray-700 dark:text-dark-text-secondary">
                {t("endpointType")}
              </span>
            </div>
            <div className="text-gray-600 dark:text-dark-text-secondary">
              {getEndpointTypesText(model.supported_endpoint_types)}
            </div>
          </div>
        )}

        {/* 详细定价信息（仅按量计费模型） */}
        {isTokenBillingType(model.quota_type) && (
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-2">
              <CurrencyDollarIcon className="w-4 h-4 text-gray-400 dark:text-dark-text-tertiary" />
              <span className="font-medium text-gray-700 dark:text-dark-text-secondary">
                {t("detailedPricing")}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <div className="text-gray-500 dark:text-dark-text-tertiary">
                  {t("input1MTokens")}
                </div>
                <div className="font-medium text-gray-900 dark:text-dark-text-primary">
                  USD: {formatPrice(calculatedPrice.inputUSD, "USD")}
                </div>
                <div className="font-medium text-gray-900 dark:text-dark-text-primary">
                  CNY: {formatPrice(calculatedPrice.inputCNY, "CNY")}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-gray-500 dark:text-dark-text-tertiary">
                  {t("output1MTokens")}
                </div>
                <div className="font-medium text-gray-900 dark:text-dark-text-primary">
                  USD: {formatPrice(calculatedPrice.outputUSD, "USD")}
                </div>
                <div className="font-medium text-gray-900 dark:text-dark-text-primary">
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
