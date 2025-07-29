/**
 * 模型列表项组件
 */

import React, { useState } from 'react'
import { 
  DocumentDuplicateIcon, 
  ChevronDownIcon, 
  ChevronUpIcon,
  TagIcon,
  CurrencyDollarIcon,
  ServerIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import type { ModelPricing } from '../services/apiService'
import type { CalculatedPrice } from '../utils/modelPricing'
import { 
  getProviderConfig, 
  type ProviderType 
} from '../utils/modelProviders'
import { 
  formatPrice, 
  formatPriceCompact, 
  getBillingModeText, 
  getBillingModeStyle,
  getEndpointTypesText 
} from '../utils/modelPricing'

interface ModelItemProps {
  model: ModelPricing
  calculatedPrice: CalculatedPrice
  exchangeRate: number
  showRealPrice: boolean // 是否以真实充值金额展示
  showRatioColumn: boolean // 是否显示倍率列
  showEndpointTypes: boolean // 是否显示可用端点类型
  userGroup: string
  onGroupClick?: (group: string) => void // 新增：点击分组时的回调函数
}

export default function ModelItem({
  model,
  calculatedPrice,
  exchangeRate,
  showRealPrice,
  showRatioColumn,
  showEndpointTypes,
  userGroup,
  onGroupClick
}: ModelItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // 获取厂商配置
  const providerConfig = getProviderConfig(model.model_name)
  const IconComponent = providerConfig.icon
  
  // 获取计费模式样式
  const billingStyle = getBillingModeStyle(model.quota_type)
  
  // 检查模型是否对当前用户分组可用
  const isAvailableForUser = model.enable_groups.includes(userGroup)
  
  // 复制模型名称
  const handleCopyModelName = async () => {
    try {
      await navigator.clipboard.writeText(model.model_name)
      toast.success('模型名称已复制')
    } catch (error) {
      toast.error('复制失败')
    }
  }
  
  return (
    <div className={`border rounded-lg transition-all duration-200 ${
      isAvailableForUser 
        ? 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm' 
        : 'border-gray-100 bg-gray-50'
    }`}>
      {/* 主要信息行 */}
      <div className="p-4">
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
                <h3 className={`text-lg font-semibold ${
                  isAvailableForUser ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {model.model_name}
                </h3>
                
                {/* 复制按钮 */}
                <button
                  onClick={handleCopyModelName}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="复制模型名称"
                >
                  <DocumentDuplicateIcon className="w-3 h-3 text-gray-400" />
                </button>
              </div>
              
              {/* 计费模式标签 */}
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${billingStyle.color} ${billingStyle.bgColor}`}>
                {getBillingModeText(model.quota_type)}
              </span>
              
              {/* 可用状态标签 */}
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                isAvailableForUser 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {isAvailableForUser ? '可用' : '不可用'}
              </span>
            </div>
            
            {/* 模型描述 */}
            {model.model_description && (
              <div className="mb-2">
                <p className={`text-sm leading-relaxed ${
                  isAvailableForUser ? 'text-gray-600' : 'text-gray-400'
                } overflow-hidden`} 
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}
                title={model.model_description}>
                  {model.model_description}
                </p>
              </div>
            )}
            
            {/* 价格信息 */}
            <div className="mt-2">
              {model.quota_type === 0 ? (
                // 按量计费 - 横向并排显示价格
                <div className="flex items-center gap-6">
                  {/* 输入价格 */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">输入:</span>
                    <span className={`text-sm ${
                      isAvailableForUser ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {showRealPrice 
                        ? `${formatPriceCompact(calculatedPrice.inputCNY, 'CNY')}/M`
                        : `${formatPriceCompact(calculatedPrice.inputUSD, 'USD')}/M`
                      }
                    </span>
                  </div>
                  
                  {/* 输出价格 */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">输出:</span>
                    <span className={`text-sm ${
                      isAvailableForUser ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {showRealPrice 
                        ? `${formatPriceCompact(calculatedPrice.outputCNY, 'CNY')}/M`
                        : `${formatPriceCompact(calculatedPrice.outputUSD, 'USD')}/M`
                      }
                    </span>
                  </div>
                  
                  {/* 倍率显示 */}
                  {showRatioColumn && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">倍率:</span>
                      <span className={`text-sm font-medium ${
                        isAvailableForUser ? 'text-gray-900' : 'text-gray-500'
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
                  <span className={`text-sm ${
                    isAvailableForUser ? 'text-purple-600' : 'text-gray-500'
                  }`}>
                    {showRealPrice 
                      ? formatPriceCompact((calculatedPrice.perCallPrice || 0) * exchangeRate, 'CNY')
                      : formatPriceCompact(calculatedPrice.perCallPrice || 0, 'USD')
                    }
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* 右侧：展开/收起按钮 */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title={isExpanded ? '收起详细信息' : '展开详细信息'}
          >
            {isExpanded ? (
              <ChevronUpIcon className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDownIcon className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>
      
      {/* 展开的详细信息 */}
      {isExpanded && (
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
                          ? 'bg-blue-100 text-blue-800 font-medium' 
                          : isClickable
                          ? 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                      title={isClickable ? `点击切换到 ${group} 分组` : undefined}
                    >
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
            {model.quota_type === 0 && (
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2 mb-2">
                  <CurrencyDollarIcon className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-700">详细定价</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="text-gray-500">输入(1M tokens)</div>
                    <div className="font-medium">
                      USD: {formatPrice(calculatedPrice.inputUSD, 'USD')}
                    </div>
                    <div className="font-medium">
                      CNY: {formatPrice(calculatedPrice.inputCNY, 'CNY')}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-gray-500">输出(1M tokens)</div>
                    <div className="font-medium">
                      USD: {formatPrice(calculatedPrice.outputUSD, 'USD')}
                    </div>
                    <div className="font-medium">
                      CNY: {formatPrice(calculatedPrice.outputCNY, 'CNY')}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}