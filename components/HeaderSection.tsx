import { ArrowsPointingOutIcon, Cog6ToothIcon, ArrowPathIcon } from "@heroicons/react/24/outline"
import { UI_CONSTANTS } from "../constants/ui"
import Tooltip from "./Tooltip"

interface HeaderSectionProps {
  isRefreshing: boolean
  onRefresh: () => void
  onOpenTab: () => void
}

export default function HeaderSection({ 
  isRefreshing, 
  onRefresh, 
  onOpenTab 
}: HeaderSectionProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100 flex-shrink-0">
      <div className="flex items-center space-x-3">
        <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm">
          API
        </div>
        <span className="font-semibold text-gray-900">One API Manager</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <Tooltip content="刷新数据">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className={`${UI_CONSTANTS.STYLES.BUTTON.ICON} ${isRefreshing ? 'animate-spin' : ''}`}
            title="刷新数据"
          >
            <ArrowPathIcon className="w-4 h-4" />
          </button>
        </Tooltip>
        <button
          onClick={onOpenTab}
          className={UI_CONSTANTS.STYLES.BUTTON.ICON}
          title="打开完整管理页面"
        >
          <ArrowsPointingOutIcon className="w-4 h-4" />
        </button>
        <button
          className={UI_CONSTANTS.STYLES.BUTTON.ICON}
          title="设置"
        >
          <Cog6ToothIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}