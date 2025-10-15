import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild
} from "@headlessui/react"
import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { Fragment } from "react"
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation()

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        {/* 背景遮罩动画 */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            aria-hidden="true"
          />
        </TransitionChild>

        {/* 居中容器 - 针对插件优化 */}
        <div className="fixed inset-0 flex items-center justify-center p-2">
          {/* 弹窗面板动画 */}
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95 translate-y-4"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-4">
            <DialogPanel className="w-full max-w-md bg-white dark:bg-dark-bg-secondary rounded-lg shadow-xl transform transition-all">
              {/* 头部 */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-dark-bg-tertiary">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                    <ExclamationTriangleIcon className="w-4 h-4 text-white" />
                  </div>
                  <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary">
                    {t("firefox.warningTitle")}
                  </DialogTitle>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary rounded-lg transition-colors">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* 内容区域 */}
              <div className="p-4">
                <div className="space-y-4">
                  <div className="text-center">
                    <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-orange-500" />
                    <div className="mt-3">
                      <h3 className="text-base font-medium text-gray-900 dark:text-dark-text-primary">
                        {t("firefox.limitation")}
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
                          {t("firefox.popupLimitation")}
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
                          {t("firefox.howOpenSidebar")}
                        </h3>
                        <div className="mt-1 text-xs text-orange-700 dark:text-orange-300">
                          <p>{t("firefox.sidebarInstruction")}</p>
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
                    {t("firefox.confirm")}
                  </button>
                  <button
                    type="button"
                    onClick={onConfirm}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg hover:from-orange-600 hover:to-amber-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500">
                    {t("firefox.openSidebar")}
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}
