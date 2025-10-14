import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import type { AugmentedSortingFieldConfig } from "./SortingPriorityDragList"

interface SortingCriteriaItemProps {
  item: AugmentedSortingFieldConfig
}

export function SortingCriteriaItem({ item }: SortingCriteriaItemProps) {
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
      className="mb-2 flex items-center rounded-lg border border-gray-200 dark:border-dark-bg-tertiary bg-gray-50 dark:bg-dark-bg-tertiary p-4 cursor-move hover:bg-gray-100 dark:hover:bg-dark-bg-secondary transition-colors">
      <div className="flex-grow">
        <div className="font-medium text-gray-900 dark:text-dark-text-primary">
          {item.label}
        </div>
        <div className="text-sm text-gray-500 dark:text-dark-text-secondary">
          {item.description}
        </div>
      </div>
      <div className="ml-4">
        <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-300">
          优先级: {item.priority + 1}
        </span>
      </div>
    </div>
  )
}
