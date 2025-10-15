import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

export function WarningNote() {
  const { t } = useTranslation()

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-lg p-3">
      <div className="flex items-start space-x-2">
        <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-yellow-800 dark:text-yellow-200">
          <p className="font-medium mb-1">{t("keyManagement.warningTitle")}</p>
          <ul className="text-xs space-y-1">
            <li>{t("keyManagement.warningText")}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
