import { DialogTitle } from "@headlessui/react"
import { PencilIcon, SparklesIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

interface DialogHeaderProps {
  mode: "add" | "edit"
}

export default function DialogHeader({ mode }: DialogHeaderProps) {
  const { t } = useTranslation("accountDialog")
  const isAddMode = mode === "add"
  const title = isAddMode ? t("title.add") : t("title.edit")
  const Icon = isAddMode ? SparklesIcon : PencilIcon
  const iconBgClass = isAddMode
    ? "bg-gradient-to-r from-blue-500 to-indigo-600"
    : "bg-gradient-to-r from-green-500 to-emerald-600"

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div
          className={`w-8 h-8 ${iconBgClass} rounded-lg flex items-center justify-center`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary">
          {title}
        </DialogTitle>
      </div>
      {/* Modal provides close button */}
    </div>
  )
}
