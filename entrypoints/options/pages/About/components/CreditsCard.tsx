import { HeartIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

const CreditsCard = () => {
  const { t } = useTranslation()
  return (
    <div className="bg-white dark:bg-dark-bg-secondary border border-gray-200 dark:border-dark-bg-tertiary rounded-lg p-6">
      <div className="flex items-start space-x-4">
        <HeartIcon className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-base font-medium text-gray-900 dark:text-dark-text-primary mb-2">
            {t("about.devMaintenance")}
          </h3>
          <p className="text-sm text-gray-600 dark:text-dark-text-secondary mb-4">
            {t("about.thanksDesc")}
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300">
              Made with ❤️
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-dark-bg-tertiary text-gray-800 dark:text-dark-text-secondary">
              Open Source
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
              Privacy First
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreditsCard
