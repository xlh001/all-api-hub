import { CpuChipIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

export function Footer() {
  const { t } = useTranslation("modelList")
  return (
    <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg">
      <div className="flex items-start space-x-3">
        <CpuChipIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="text-blue-800 dark:text-blue-300 font-medium mb-1">
            {t("pricingNote")}
          </p>
          <p className="text-blue-700 dark:text-blue-200">
            {t("pricingDescription")}
          </p>
        </div>
      </div>
    </div>
  )
}
