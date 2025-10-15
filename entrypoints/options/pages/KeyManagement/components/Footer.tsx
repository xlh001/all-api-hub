import { KeyIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

export function Footer() {
  const { t } = useTranslation()

  return (
    <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 rounded-lg">
      <div className="flex items-start space-x-3">
        <KeyIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-40 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="text-yellow-800 dark:text-yellow-300 font-medium mb-1">
            {t("keyManagement.warningTitle")}
          </p>
          <p className="text-yellow-70 dark:text-yellow-200">
            {t("keyManagement.description")}
          </p>
        </div>
      </div>
    </div>
  )
}
