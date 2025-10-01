import { DocumentDuplicateIcon } from "@heroicons/react/24/outline"
import React from "react"

import type { ModelPricing } from "../../services/apiService"
import {
  getBillingModeStyle,
  getBillingModeText
} from "../../utils/modelPricing"
import { getProviderConfig } from "../../utils/modelProviders"

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
                isAvailableForUser ? "text-gray-900" : "text-gray-500"
              }`}>
              {model.model_name}
            </h3>

            {/* 复制按钮 */}
            <button
              onClick={handleCopyModelName}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="复制模型名称">
              <DocumentDuplicateIcon className="w-3 h-3 text-gray-400" />
            </button>
          </div>

          {/* 计费模式标签 */}
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${billingStyle.color} ${billingStyle.bgColor}`}>
            {getBillingModeText(model.quota_type)}
          </span>

          {/* 可用状态标签 */}
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              isAvailableForUser
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-600"
            }`}>
            {isAvailableForUser ? "可用" : "不可用"}
          </span>
        </div>
      </div>
    </div>
  )
}
