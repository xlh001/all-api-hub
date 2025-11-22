import type { Row } from "@tanstack/react-table"

import type { NewApiChannel } from "~/types/newapi"

export type ChannelRow = NewApiChannel
export type CheckboxState = boolean | "indeterminate"

export type RowActionsLabels = {
  edit: string
  sync: string
  syncing: string
  delete: string
}

export interface RowActionsProps {
  row: Row<ChannelRow>
  onEdit: () => void
  onDelete: () => void
  onSync: () => void
  isSyncing: boolean
  labels: RowActionsLabels
}
