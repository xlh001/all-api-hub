import { DocumentDuplicateIcon } from "@heroicons/react/24/outline"
import React from "react"
import { useTranslation } from "react-i18next"

import type { ModelPricing } from "~/services/apiService/common/type"
import { getBillingModeStyle, getBillingModeText } from "~/utils/modelPricing"
import { getProviderConfig } from "~/utils/modelProviders"

interface ModelItemHeaderProps {
  model: ModelPricing
  isAvailableForUser: boolean
  handleCopyModelName: () => void
}

export const ModelItemHeader: React.FC<ModelItemHeaderProps> = ({
  model,
  isAvailableForUser,
  handleCopyModelName
}) => {
  const { t } = useTranslation("modelList")
  const providerConfig = getProviderConfig(model.model_name)
  const IconComponent = providerConfig.icon
  const billingStyle = getBillingModeStyle(model.quota_type)

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-start gap-2 sm:gap-3 mb-2">
        {/* 厂商图标 */}
        <div
          className={`p-1.5 rounded-lg flex-shrink-0 ${providerConfig.bgColor}`}>
          <IconComponent
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${providerConfig.color}`}
          />
        </div>

        {/* 模型名称和标签 */}
        <div className="flex-1 min-w-0">
          {/* 第一行：模型名称 + 复制按钮 */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <h3
              className={`text-sm sm:text-base md:text-lg font-semibold truncate ${
                isAvailableForUser
                  ? "text-gray-900 dark:text-dark-text-primary"
                  : "text-gray-500 dark:text-dark-text-tertiary"
              }`}>
              {model.model_name}
            </h3>

            {/* 复制按钮 */}
            <button
              onClick={handleCopyModelName}
              className="p-1 hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary rounded transition-colors flex-shrink-0 touch-manipulation tap-highlight-transparent"
              title={t("messages.modelNameCopied")}>
              <DocumentDuplicateIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 dark:text-dark-text-tertiary" />
            </button>
          </div>

          {/* 第二行：标签 */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* 计费模式标签 */}
            <span
              className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap ${billingStyle.color} ${billingStyle.bgColor}`}>
              {getBillingModeText(model.quota_type)}
            </span>

            {/* 可用状态标签 */}
            <span
              className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap ${
                isAvailableForUser
                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                  : "bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400"
              }`}>
              {isAvailableForUser ? t("available") : t("unavailable")}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
