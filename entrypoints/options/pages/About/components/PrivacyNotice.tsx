import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

const PrivacyNotice = () => {
  const { t } = useTranslation("about")
  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <InformationCircleIcon className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="text-base text-green-800 dark:text-green-300 font-medium mb-1">
            {t("privacyTitle")}
          </p>
          <p className="text-green-700 dark:text-green-400">
            {t("privacyText")}
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyNotice
