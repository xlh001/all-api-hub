import { CpuChipIcon, KeyIcon, PlusIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import Tooltip from "~/components/Tooltip"
import { UI_CONSTANTS } from "~/constants/ui"
import { useDialogStateContext } from "~/features/AccountManagement/hooks/DialogStateContext"
import { isFirefox } from "~/utils/browser"
import { openKeysPage, openModelsPage } from "~/utils/navigation"

import { showFirefoxWarningDialog } from "./FirefoxAddAccountWarningDialog/showFirefoxWarningDialog"

interface ActionButtonsProps {
  inSidePanel?: boolean
}

export default function ActionButtons({
  inSidePanel = false
}: ActionButtonsProps) {
  const { t } = useTranslation()
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
    <div className="px-5 mb-4 bg-gray-50 dark:bg-dark-bg-secondary border-b border-gray-200 dark:border-dark-bg-tertiary">
      <div className="flex space-x-2 py-3">
        <button
          onClick={handleAddAccountClick}
          className={UI_CONSTANTS.STYLES.BUTTON.PRIMARY}>
          <PlusIcon className="w-4 h-4" />
          <span>{t("account.add_account")}</span>
        </button>
        <Tooltip content={t("common.key_management")}>
          <button
            onClick={handleOpenKeysPageClick}
            className={UI_CONSTANTS.STYLES.BUTTON.ICON}>
            <KeyIcon className="w-4 h-4" />
          </button>
        </Tooltip>
        <Tooltip content={t("common.model_list")}>
          <button
            onClick={handleOpenModelsPageClick}
            className={UI_CONSTANTS.STYLES.BUTTON.ICON}>
            <CpuChipIcon className="w-4 h-4" />
          </button>
        </Tooltip>
      </div>
    </div>
  )
}
