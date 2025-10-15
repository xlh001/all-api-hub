import { ArrowPathIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

const PageHeader = () => {
  const { t } = useTranslation()
  return (
    <div className="mb-8">
      <div className="flex items-center space-x-3 mb-2">
        <ArrowPathIcon className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-dark-text-primary">
          {t("importExport.title")}
        </h1>
      </div>
      <p className="text-gray-500 dark:text-dark-text-secondary">
        {t("importExport.description")}
      </p>
    </div>
  )
}

export default PageHeader
