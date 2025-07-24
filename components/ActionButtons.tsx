import { PlusIcon, KeyIcon, CpuChipIcon } from "@heroicons/react/24/outline"
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
        <Tooltip content="密钥管理">
          <button className={UI_CONSTANTS.STYLES.BUTTON.SECONDARY}>
            <KeyIcon className="w-4 h-4" />
          </button>
        </Tooltip>
        <Tooltip content="模型列表">
          <button className={UI_CONSTANTS.STYLES.BUTTON.SECONDARY}>
            <CpuChipIcon className="w-4 h-4" />
          </button>
        </Tooltip>
      </div>
    </div>
  )
}