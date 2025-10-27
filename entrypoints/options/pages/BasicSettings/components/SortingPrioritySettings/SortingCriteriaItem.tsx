import React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useTranslation } from "react-i18next"

import { Badge, Card, CardContent, Switch } from "~/components/ui"

import type { AugmentedSortingFieldConfig } from "./SortingPriorityDragList"

interface SortingCriteriaItemProps {
  item: AugmentedSortingFieldConfig
  onToggleEnabled?: (id: string, enabled: boolean) => void
}

export function SortingCriteriaItem({ item, onToggleEnabled }: SortingCriteriaItemProps) {
  const { t } = useTranslation("settings")
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onToggleEnabled) {
      onToggleEnabled(item.id, !item.enabled)
    }
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      variant="default"
      padding="none"
      className="mb-2 transition-colors hover:bg-gray-100 dark:hover:bg-dark-bg-secondary">
      <CardContent padding="sm">
        <div className="flex items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            className="mr-1 flex cursor-move touch-none items-center text-gray-400 hover:text-gray-600 dark:text-dark-text-tertiary dark:hover:text-dark-text-secondary">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            </svg>
          </div>
          <div className="min-w-0 flex-grow">
            <div className="truncate text-sm font-medium text-gray-900 dark:text-dark-text-primary">
              {item.label}
            </div>
            <div className="truncate text-xs text-gray-500 dark:text-dark-text-secondary">
              {item.description}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Badge variant="default" size="sm">
              {t(`sorting.priority`)}: {item.priority + 1}
            </Badge>
            <div onClick={handleToggle}>
              <Switch
                checked={item.enabled}
                onChange={(checked) => onToggleEnabled?.(item.id, checked)}
                size="sm"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
