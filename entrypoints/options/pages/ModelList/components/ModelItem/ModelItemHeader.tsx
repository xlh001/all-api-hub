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
  const { t } = useTranslation()
  const providerConfig = getProviderConfig(model.model_name)
  const IconComponent = providerConfig.icon
  const billingStyle = getBillingModeStyle(model.quota_type)

  return (
    <div className="flex items-start justify-between">
      {/* 左侧：模型名称和基本信息 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-3 mb-2">
          {/* 厂商图标 */}
          <div className={`p-1.5 rounded-lg ${providerConfig.bgColor}`}>
            <IconComponent className={`w-4 h-4 ${providerConfig.color}`} />
          </div>

          {/* 模型名称 */}
          <div className="flex items-center space-x-2 min-w-0">
            <h3
              className={`text-lg font-semibold ${
                isAvailableForUser
                  ? "text-gray-900 dark:text-dark-text-primary"
                  : "text-gray-500 dark:text-dark-text-tertiary"
              }`}>
              {model.model_name}
            </h3>

            {/* 复制按钮 */}
            <button
              onClick={handleCopyModelName}
              className="p-1 hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary rounded transition-colors"
              title={t("modelList.modelNameCopied")}>
              <DocumentDuplicateIcon className="w-3 h-3 text-gray-400 dark:text-dark-text-tertiary" />
            </button>
          </div>

          {/* 计费模式标签 */}
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${billingStyle.color} ${billingStyle.bgColor}`}>
            {getBillingModeText(model.quota_type, t)}
          </span>

          {/* 可用状态标签 */}
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              isAvailableForUser
                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                : "bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400"
            }`}>
            {isAvailableForUser
              ? t("modelList.available")
              : t("modelList.unavailable")}
          </span>
        </div>
      </div>
    </div>
  )
}
