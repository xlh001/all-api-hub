import { PencilIcon, SparklesIcon } from "@heroicons/react/24/outline"

interface ActionButtonsProps {
  url: string
  isDetecting: boolean
  onAutoDetect: () => void
  onShowManualForm: () => void
}

export default function ActionButtons({
  url,
  isDetecting,
  onAutoDetect,
  onShowManualForm
}: ActionButtonsProps) {
  return (
    <div className="flex space-x-3 pt-4">
      <button
        type="button"
        onClick={onAutoDetect}
        disabled={!url.trim() || isDetecting}
        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
        {isDetecting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>识别中...</span>
          </>
        ) : (
          <>
            <SparklesIcon className="w-4 h-4" />
            <span>自动识别</span>
          </>
        )}
      </button>
      <button
        type="button"
        onClick={onShowManualForm}
        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm">
        <PencilIcon className="w-4 h-4" />
        <span>手动添加</span>
      </button>
    </div>
  )
}
