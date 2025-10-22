import { Dialog } from "@headlessui/react"
import { KeyIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import { IconButton } from "~/components/ui"

interface DialogHeaderProps {
  isEditMode: boolean
  onClose: () => void
}

export function DialogHeader({ isEditMode, onClose }: DialogHeaderProps) {
  const { t } = useTranslation("keyManagement")

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-2">
        <KeyIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary">
          {isEditMode ? t("dialog.editToken") : t("dialog.addToken")}
        </Dialog.Title>
      </div>
      <IconButton
        aria-label="close"
        variant="ghost"
        size="sm"
        onClick={onClose}>
        <XMarkIcon className="w-5 h-5" />
      </IconButton>
    </div>
  )
}
