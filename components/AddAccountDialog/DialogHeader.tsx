import { DialogTitle } from "@headlessui/react"
import { SparklesIcon, XMarkIcon } from "@heroicons/react/24/outline"

interface DialogHeaderProps {
  onClose: () => void
}

export default function DialogHeader({ onClose }: DialogHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <SparklesIcon className="w-4 h-4 text-white" />
        </div>
        <DialogTitle className="text-lg font-semibold text-gray-900">
          新增账号
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
