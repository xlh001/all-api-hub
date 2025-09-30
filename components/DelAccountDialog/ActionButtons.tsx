import type { FC } from "react"

interface ActionButtonsProps {
  onClose: () => void
  onDelete: () => void
}

export const ActionButtons: FC<ActionButtonsProps> = ({
  onClose,
  onDelete
}) => (
  <div className="flex space-x-3">
    <button
      type="button"
      onClick={onClose}
      className="flex-1 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500">
      取消
    </button>
    <button
      type="button"
      onClick={onDelete}
      className="flex-1 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:from-red-60 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-red-500">
      确认删除
    </button>
  </div>
)
