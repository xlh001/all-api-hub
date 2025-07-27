import { ArrowsPointingOutIcon, Cog6ToothIcon, ArrowPathIcon } from "@heroicons/react/24/outline"
import { UI_CONSTANTS } from "../constants/ui"
import Tooltip from "./Tooltip"
import iconImage from "../assets/icon.png"

interface HeaderSectionProps {
  isRefreshing: boolean
  onRefresh: () => void
  onOpenTab: () => void
  onOpenSettings: () => void
}

export default function HeaderSection({ 
  isRefreshing, 
  onRefresh, 
  onOpenTab,
  onOpenSettings
}: HeaderSectionProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100 flex-shrink-0">
      <div className="flex items-center space-x-3">
        <img 
          src={iconImage} 
          alt="One API Hub" 
          className="w-7 h-7 rounded-lg shadow-sm"
        />
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">One API Hub</span>
          <span className="text-xs text-gray-500">一键管理所有AI中转站</span>
        </div>
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
          onClick={onOpenSettings}
          className={UI_CONSTANTS.STYLES.BUTTON.ICON}
          title="设置"
        >
          <Cog6ToothIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}