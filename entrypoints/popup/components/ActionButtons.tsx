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
    <section
      className={`px-3 py-2 sm:px-5 sm:py-3 ${COLORS.background.secondary} ${COLORS.border.default} border-b`}>
      <div className="flex gap-1.5 sm:gap-2">
        <Button
          onClick={handleAddAccountClick}
          className="flex-1 touch-manipulation"
          size="default"
          leftIcon={<PlusIcon className="h-4 w-4" />}>
          {t("account:addAccount")}
        </Button>

        <Tooltip content={t("ui:navigation.keys")}>
          <IconButton
            onClick={handleOpenKeysPageClick}
            variant="outline"
            size="default"
            className="touch-manipulation"
            aria-label={t("ui:navigation.keys")}>
            <KeyIcon className="h-4 w-4" />
          </IconButton>
        </Tooltip>

        <Tooltip content={t("ui:navigation.models")}>
          <IconButton
            onClick={handleOpenModelsPageClick}
            variant="outline"
            size="default"
            className="touch-manipulation"
            aria-label={t("ui:navigation.models")}>
            <CpuChipIcon className="h-4 w-4" />
          </IconButton>
        </Tooltip>
      </div>
    </section>
  )
}
