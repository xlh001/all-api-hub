import { PlusIcon, UserIcon, DocumentChartBarIcon } from "@heroicons/react/24/outline"
import { UI_CONSTANTS } from "../constants/ui"
import Tooltip from "./Tooltip"

interface ActionButtonsProps {
  onAddAccount: () => void
}

export default function ActionButtons({ onAddAccount }: ActionButtonsProps) {
  return (
    <div className="px-5 py-4 bg-gray-50/50">
      <div className="flex space-x-2">
        <button 
          onClick={onAddAccount}
          className={UI_CONSTANTS.STYLES.BUTTON.PRIMARY}
        >
          <PlusIcon className="w-4 h-4" />
          <span>新增账号</span>
        </button>
        <Tooltip content="账号管理">
          <button className={UI_CONSTANTS.STYLES.BUTTON.SECONDARY}>
            <UserIcon className="w-4 h-4" />
          </button>
        </Tooltip>
        <Tooltip content="用量统计">
          <button className={UI_CONSTANTS.STYLES.BUTTON.SECONDARY}>
            <DocumentChartBarIcon className="w-4 h-4" />
          </button>
        </Tooltip>
      </div>
    </div>
  )
}