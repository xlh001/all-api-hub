import { CpuChipIcon, KeyIcon, PlusIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import Tooltip from "~/components/Tooltip"
import { useDialogStateContext } from "~/features/AccountManagement/hooks/DialogStateContext"
import {
  isDesktopByUA,
  isExtensionSidePanel,
  isFirefoxByUA
} from "~/utils/browser"
import { openKeysPage, openModelsPage } from "~/utils/navigation"

import { showFirefoxWarningDialog } from "./FirefoxAddAccountWarningDialog/showFirefoxWarningDialog"

export default function ActionButtons() {
  const { t } = useTranslation(["account", "ui"])
  const { openAddAccount } = useDialogStateContext()

  const handleAddAccountClick = () => {
    // Firefox 桌面端的Pop-up不支持添加账号
    if (isFirefoxByUA() && isDesktopByUA() && !isExtensionSidePanel()) {
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
    <div className="px-3 sm:px-5 mb-3 sm:mb-4 bg-gray-50 dark:bg-dark-bg-secondary border-b border-gray-200 dark:border-dark-bg-tertiary">
      <div className="flex space-x-1.5 sm:space-x-2 py-2 sm:py-3">
        <button
          onClick={handleAddAccountClick}
          className="flex-1 flex items-center justify-center space-x-1.5 sm:space-x-2 py-2 sm:py-2.5 px-2 sm:px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg-primary transition-colors text-xs sm:text-sm font-medium shadow-sm border border-blue-600 touch-manipulation tap-highlight-transparent">
          <PlusIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>{t("account:addAccount")}</span>
        </button>
        <Tooltip content={t("ui:navigation.keys")}>
          <button
            onClick={handleOpenKeysPageClick}
            className="p-1.5 sm:p-2 text-gray-400 dark:text-dark-text-tertiary hover:text-gray-600 dark:hover:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg-primary border border-gray-200 dark:border-dark-bg-tertiary touch-manipulation tap-highlight-transparent">
            <KeyIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </Tooltip>
        <Tooltip content={t("ui:navigation.models")}>
          <button
            onClick={handleOpenModelsPageClick}
            className="p-1.5 sm:p-2 text-gray-400 dark:text-dark-text-tertiary hover:text-gray-600 dark:hover:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg-primary border border-gray-200 dark:border-dark-bg-tertiary touch-manipulation tap-highlight-transparent">
            <CpuChipIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </Tooltip>
      </div>
    </div>
  )
}
