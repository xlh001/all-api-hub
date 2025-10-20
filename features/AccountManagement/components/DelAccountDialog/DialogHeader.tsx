import { DialogTitle } from "@headlessui/react"
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline"
import type { FC } from "react"
import { useTranslation } from "react-i18next"

interface DialogHeaderProps {
  onClose: () => void
}

export const DialogHeader: FC<DialogHeaderProps> = ({ onClose }) => {
  const { t } = useTranslation("ui")

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-dark-bg-tertiary">
      <div className="flex items-center space-x-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-pink-600">
          <TrashIcon className="h-4 w-4 text-white" />
        </div>
        <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary">
          {t("dialog.delete.title")}
        </DialogTitle>
      </div>
      <button
        onClick={onClose}
        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary hover:text-gray-600 dark:hover:text-dark-text-secondary"
        aria-label="Close">
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  )
}
