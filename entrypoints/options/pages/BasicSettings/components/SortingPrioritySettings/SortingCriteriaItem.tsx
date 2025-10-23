import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useTranslation } from "react-i18next"

import { Badge, Card, CardContent } from "~/components/ui"

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
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      variant="default"
      padding="none"
      className="mb-2 cursor-move touch-none transition-colors hover:bg-gray-100 dark:hover:bg-dark-bg-secondary">
      <CardContent padding="sm">
        <div className="flex items-center">
          <div className="mr-2 min-w-0 flex-grow sm:mr-3">
            <div className="truncate text-sm font-medium text-gray-900 dark:text-dark-text-primary">
              {item.label}
            </div>
            <div className="truncate text-xs text-gray-500 dark:text-dark-text-secondary">
              {item.description}
            </div>
          </div>
          <div className="shrink-0">
            <Badge variant="default" size="sm">
              {t(`sorting.priority`)}: {item.priority + 1}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
