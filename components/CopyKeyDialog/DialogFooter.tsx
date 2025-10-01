import { KeyIcon } from "@heroicons/react/24/outline"

interface DialogFooterProps {
  tokenCount: number
  onClose: () => void
}

export function DialogFooter({ tokenCount, onClose }: DialogFooterProps) {
  return (
    <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {tokenCount > 0 && (
            <div className="flex items-center space-x-1.5 text-xs text-gray-500">
              <KeyIcon className="w-3 h-3" />
              <span>共 {tokenCount} 个密钥</span>
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:border-gray-400 transition-colors">
          关闭
        </button>
      </div>
    </div>
  )
}
