import { CpuChipIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

export function Header() {
  const { t } = useTranslation("modelList")
  return (
    <div className="mb-6">
      <div className="flex items-center space-x-3 mb-2">
        <CpuChipIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-dark-text-primary">
          {t("title")}
        </h1>
      </div>
      <p className="text-gray-500 dark:text-dark-text-secondary">
        {t("description")}
      </p>
    </div>
  )
}
