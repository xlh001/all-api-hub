import { CpuChipIcon, KeyIcon, PlusIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import Tooltip from "~/components/Tooltip"
import { Button, IconButton } from "~/components/ui"
import { COLORS } from "~/constants/designTokens"
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
    <div
      className={`px-3 sm:px-5 mb-3 sm:mb-4 ${COLORS.background.secondary} border-b ${COLORS.border.default}`}>
      <div className="flex space-x-1.5 sm:space-x-2 py-2 sm:py-3">
        <Button
          onClick={handleAddAccountClick}
          className="flex-1 flex items-center justify-center space-x-1.5 sm:space-x-2 py-2 sm:py-2.5 px-2 sm:px-3 text-xs sm:text-sm font-medium shadow-sm border border-blue-600 touch-manipulation tap-highlight-transparent"
          leftIcon={<PlusIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}>
          {t("account:addAccount")}
        </Button>
        <Tooltip content={t("ui:navigation.keys")}>
          <IconButton
            onClick={handleOpenKeysPageClick}
            variant="outline"
            size="sm"
            className="p-1.5 sm:p-2 touch-manipulation tap-highlight-transparent"
            aria-label={t("ui:navigation.keys")}>
            <KeyIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </IconButton>
        </Tooltip>
        <Tooltip content={t("ui:navigation.models")}>
          <IconButton
            onClick={handleOpenModelsPageClick}
            variant="outline"
            size="sm"
            className="p-1.5 sm:p-2 touch-manipulation tap-highlight-transparent"
            aria-label={t("ui:navigation.models")}>
            <CpuChipIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  )
}
