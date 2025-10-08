import { CpuChipIcon, KeyIcon, PlusIcon } from "@heroicons/react/24/outline"

import { showFirefoxWarningDialog } from "~/components/FirefoxAddAccountWarningDialog/showFirefoxWarningDialog"
import { UI_CONSTANTS } from "~/constants/ui"
import { useDialogStateContext } from "~/contexts"
import { isFirefox } from "~/utils/browser"
import { openKeysPage, openModelsPage } from "~/utils/navigation"

import Tooltip from "./Tooltip"

interface ActionButtonsProps {
  inSidePanel?: boolean
}

export default function ActionButtons({
  inSidePanel = false
}: ActionButtonsProps) {
  const { openAddAccount } = useDialogStateContext()

  const handleAddAccountClick = () => {
    if (isFirefox() && !inSidePanel) {
      showFirefoxWarningDialog()
    } else {
      openAddAccount()
    }
  }

  const handleOpenKeysPageClick = () => {
    openKeysPage()
  }

  const handleOpenModelsPageClick = () => {
    openModelsPage()
  }

  return (
    <div className="px-5 mb-4 bg-gray-50/50">
      <div className="flex space-x-2">
        <button
          onClick={handleAddAccountClick}
          className={UI_CONSTANTS.STYLES.BUTTON.PRIMARY}>
          <PlusIcon className="w-4 h-4" />
          <span>新增账号</span>
        </button>
        <Tooltip content="密钥管理">
          <button
            onClick={handleOpenKeysPageClick}
            className={UI_CONSTANTS.STYLES.BUTTON.SECONDARY}>
            <KeyIcon className="w-4 h-4" />
          </button>
        </Tooltip>
        <Tooltip content="模型列表">
          <button
            onClick={handleOpenModelsPageClick}
            className={UI_CONSTANTS.STYLES.BUTTON.SECONDARY}>
            <CpuChipIcon className="w-4 h-4" />
          </button>
        </Tooltip>
      </div>
    </div>
  )
}
