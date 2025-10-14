import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"

import type { SortingFieldConfig } from "~/types/sorting"

import { SortingCriteriaItem } from "./SortingCriteriaItem"

export interface AugmentedSortingFieldConfig extends SortingFieldConfig {
  label: string
  description?: string
}

interface SortingPriorityDragListProps {
  items: AugmentedSortingFieldConfig[]
  onDragEnd: (event: DragEndEvent) => void
}

export function SortingPriorityDragList({
  items,
  onDragEnd
}: SortingPriorityDragListProps) {
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}>
        {items.map((item) => (
          <SortingCriteriaItem key={item.id} item={item} />
        ))}
      </SortableContext>
    </DndContext>
  )
}
