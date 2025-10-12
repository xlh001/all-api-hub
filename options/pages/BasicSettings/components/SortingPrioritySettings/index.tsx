import type { DragEndEvent } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import React, { useEffect, useState } from "react"

import { useBasicSettings } from "~/options/pages/BasicSettings/contexts/BasicSettingsContext"
import { SortingCriteriaType, type SortingFieldConfig } from "~/types/sorting"

import { SortingPriorityDragList } from "./SortingPriorityDragList"

// Maps sorting criteria IDs to their UI display text (label and description).
// This keeps UI concerns separate from the data-only sorting configuration.
const SORTING_CRITERIA_UI_TEXT: Record<
  SortingCriteriaType,
  { label: string; description?: string }
> = {
  [SortingCriteriaType.CURRENT_SITE]: {
    label: "当前站点优先",
    description: "将当前访问的站点置于列表顶部"
  },
  [SortingCriteriaType.HEALTH_STATUS]: {
    label: "健康状态",
    description: "按站点的健康状况排序（错误 > 警告 > 未知 > 健康）"
  },
  [SortingCriteriaType.CHECK_IN_REQUIREMENT]: {
    label: "签到需求",
    description: "将需要签到的站点排在前面"
  },
  [SortingCriteriaType.USER_SORT_FIELD]: {
    label: "用户自定义排序",
    description: "根据用户在列表视图中选择的字段（如余额）进行排序"
  }
}

function SortingPrioritySettingsContent() {
  const {
    sortingPriorityConfig: initialConfig,
    updateSortingPriorityConfig,
    isLoading
  } = useBasicSettings()
  const [items, setItems] = useState<SortingFieldConfig[]>([])

  useEffect(() => {
    if (initialConfig?.criteria) {
      // Sort items based on priority for consistent display
      setItems(
        [...initialConfig.criteria].sort((a, b) => a.priority - b.priority)
      )
    }
  }, [initialConfig])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setItems((currentItems) => {
        const oldIndex = currentItems.findIndex((item) => item.id === active.id)
        const newIndex = currentItems.findIndex((item) => item.id === over.id)
        const reorderedItems = arrayMove(currentItems, oldIndex, newIndex)
        // Update the priority based on the new array index
        return reorderedItems.map((item, index) => ({
          ...item,
          priority: index
        }))
      })
    }
  }

  const handleSave = async () => {
    if (initialConfig) {
      // Create the new config with updated criteria and lastModified timestamp
      const newConfig = {
        ...initialConfig,
        criteria: items,
        lastModified: Date.now()
      }
      await updateSortingPriorityConfig(newConfig)
    }
  }

  if (isLoading) {
    return <div>加载中...</div>
  }

  // Augment the data-only items with UI text for rendering
  const augmentedItems = items.map((item) => ({
    ...item,
    ...(SORTING_CRITERIA_UI_TEXT[item.id] || {
      label: item.id,
      description: "未知排序规则"
    })
  }))

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">排序优先级设置</h2>
      <SortingPriorityDragList
        items={augmentedItems}
        onDragEnd={handleDragEnd}
      />
      <button
        onClick={handleSave}
        className="rounded-md bg-blue-600 px-4 py-2 text-white">
        保存
      </button>
    </div>
  )
}

export default function SortingPrioritySettings() {
  return <SortingPrioritySettingsContent />
}
