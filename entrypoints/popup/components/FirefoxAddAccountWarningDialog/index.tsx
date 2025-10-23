import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import Modal from "~/components/ui/Dialog/Modal"

interface FirefoxWarningDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function FirefoxAddAccountWarningDialog({
  isOpen,
  onClose,
  onConfirm
}: FirefoxWarningDialogProps) {
  const { t } = useTranslation("ui")

  const header = (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-dark-bg-tertiary">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
          <ExclamationTriangleIcon className="w-4 h-4 text-white" />
        </div>
        <div className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary">
          {t("dialog.firefox.warningTitle")}
        </div>
      </div>
    </div>
  )

  const footer = (
    <div className="p-4">
      <div className="space-y-4">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-orange-500" />
          <div className="mt-3">
            <h3 className="text-base font-medium text-gray-900 dark:text-dark-text-primary">
              {t("dialog.firefox.limitation")}
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
                {t("dialog.firefox.popupLimitation")}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30 rounded-lg p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-orange-400 dark:text-orange-300" />
            </div>
            <div className="ml-3">
              <h3 className="text-xs font-medium text-orange-800 dark:text-orange-200">
                {t("dialog.firefox.howOpenSidebar")}
              </h3>
              <div className="mt-1 text-xs text-orange-700 dark:text-orange-300">
                <p>{t("dialog.firefox.sidebarInstruction")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 按钮组 */}
      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-dark-text-secondary bg-gray-100 dark:bg-dark-bg-tertiary rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500">
          {t("dialog.firefox.confirm")}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg hover:from-orange-600 hover:to-amber-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500">
          {t("dialog.firefox.openSidebar")}
        </button>
      </div>
    </div>
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      panelClassName="w-full max-w-md bg-white dark:bg-dark-bg-secondary rounded-lg shadow-xl transform transition-all"
      header={header}
      footer={footer}>
      {/* empty: header/footer contain the content */}
    </Modal>
  )
}
