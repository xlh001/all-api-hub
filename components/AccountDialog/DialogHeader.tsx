import { DialogTitle } from "@headlessui/react"
import {
  PencilIcon,
  SparklesIcon,
  XMarkIcon
} from "@heroicons/react/24/outline"

interface DialogHeaderProps {
  mode: "add" | "edit"
  onClose: () => void
}

export default function DialogHeader({ mode, onClose }: DialogHeaderProps) {
  const isAddMode = mode === "add"
  const title = isAddMode ? "新增账号" : "编辑账号"
  const Icon = isAddMode ? SparklesIcon : PencilIcon
  const iconBgClass = isAddMode
    ? "bg-gradient-to-r from-blue-500 to-indigo-600"
    : "bg-gradient-to-r from-green-500 to-emerald-600"

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <div
          className={`w-8 h-8 ${iconBgClass} rounded-lg flex items-center justify-center`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <DialogTitle className="text-lg font-semibold text-gray-900">
          {title}
        </DialogTitle>
      </div>
      <button
        onClick={onClose}
        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  )
}