/**
 * 模型列表项组件
 */

import React, { useState } from "react"

import type { ModelPricing } from "~/services/apiService/common/type"
import type { CalculatedPrice } from "~/utils/modelPricing"

import { ModelItemDescription } from "./ModelItemDescription"
import { ModelItemDetails } from "./ModelItemDetails"
import { ModelItemExpandButton } from "./ModelItemExpandButton"
import { ModelItemHeader } from "./ModelItemHeader"
import { ModelItemPricing } from "./ModelItemPricing"
import toast from "react-hot-toast"

interface ModelItemProps {
  model: ModelPricing
  calculatedPrice: CalculatedPrice
  exchangeRate: number
  showRealPrice: boolean // 是否以真实充值金额展示
  showRatioColumn: boolean // 是否显示倍率列
  showEndpointTypes: boolean // 是否显示可用端点类型
  userGroup: string
  onGroupClick?: (group: string) => void // 新增：点击分组时的回调函数
  availableGroups?: string[] // 新增：用户的所有可用分组列表
  isAllGroupsMode?: boolean // 新增：是否为"所有分组"模式
}

export default function ModelItem({
  model,
  calculatedPrice,
  exchangeRate,
  showRealPrice,
  showRatioColumn,
  showEndpointTypes,
  userGroup,
  onGroupClick,
  availableGroups = [],
  isAllGroupsMode = false
}: ModelItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const handleCopyModelName = async () => {
    try {
      await navigator.clipboard.writeText(model.model_name)
      toast.success("模型名称已复制")
    } catch (error) {
      toast.error("复制失败")
    }
  }

  // 检查模型是否对当前用户分组可用
  const isAvailableForUser = isAllGroupsMode
    ? availableGroups.some((group) => model.enable_groups.includes(group)) // 所有分组模式：任何一个用户分组可用即可
    : model.enable_groups.includes(userGroup) // 特定分组模式：必须该分组可用

  return (
    <div
      className={`border rounded-lg transition-all duration-200 ${
        isAvailableForUser
          ? "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
          : "border-gray-100 bg-gray-50"
      }`}>
      {/* 主要信息行 */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <ModelItemHeader
            model={model}
            isAvailableForUser={isAvailableForUser}
            handleCopyModelName={handleCopyModelName}
          />
          <ModelItemExpandButton
            isExpanded={isExpanded}
            onToggleExpand={() => setIsExpanded(!isExpanded)}
          />
        </div>
        <ModelItemDescription
          model={model}
          isAvailableForUser={isAvailableForUser}
        />
        <ModelItemPricing
          model={model}
          calculatedPrice={calculatedPrice}
          exchangeRate={exchangeRate}
          showRealPrice={showRealPrice}
          showRatioColumn={showRatioColumn}
          isAvailableForUser={isAvailableForUser}
        />
      </div>

      {/* 展开的详细信息 */}
      {isExpanded && (
        <ModelItemDetails
          model={model}
          calculatedPrice={calculatedPrice}
          showEndpointTypes={showEndpointTypes}
          userGroup={userGroup}
          onGroupClick={onGroupClick}
        />
      )}
    </div>
  )
}
