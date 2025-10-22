import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useTranslation } from "react-i18next"

import type { AugmentedSortingFieldConfig } from "./SortingPriorityDragList"

interface SortingCriteriaItemProps {
  item: AugmentedSortingFieldConfig
}

export function SortingCriteriaItem({ item }: SortingCriteriaItemProps) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="mb-2 flex items-center rounded-lg border border-gray-200 dark:border-dark-bg-tertiary bg-gray-50 dark:bg-dark-bg-tertiary p-2.5 sm:p-3 cursor-move hover:bg-gray-100 dark:hover:bg-dark-bg-secondary transition-colors touch-none">
      <div className="flex-grow min-w-0 mr-2 sm:mr-3">
        <div className="font-medium text-sm text-gray-900 dark:text-dark-text-primary truncate">
          {item.label}
        </div>
        <div className="text-xs text-gray-500 dark:text-dark-text-secondary truncate">
          {item.description}
        </div>
      </div>
      <div className="shrink-0">
        <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-2 sm:px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-300 whitespace-nowrap">
          {t(`sorting.priority`)}: {item.priority + 1}
        </span>
      </div>
    </div>
  )
}
