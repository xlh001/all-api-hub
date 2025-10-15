import { KeyIcon, PlusIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import { UI_CONSTANTS } from "~/constants/ui"

interface HeaderProps {
  onAddToken: () => void
  onRefresh: () => void
  isLoading: boolean
  isAddTokenDisabled: boolean
}

export function Header({
  onAddToken,
  onRefresh,
  isLoading,
  isAddTokenDisabled
}: HeaderProps) {
  const { t } = useTranslation()
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <KeyIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-dark-text-primary">
            {t("keyManagement.title")}
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onAddToken}
            disabled={isAddTokenDisabled}
            className={UI_CONSTANTS.STYLES.BUTTON.SUCCESS}>
            <PlusIcon className="w-4 h-4" />
            <span>{t("keyManagement.addToken")}</span>
          </button>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg-primary transition-colors disabled:opacity-50">
            {isLoading
              ? t("keyManagement.refreshing")
              : t("keyManagement.refreshTokenList")}
          </button>
        </div>
      </div>
      <p className="text-gray-500 dark:text-dark-text-secondary">
        {t("keyManagement.description")}
      </p>
    </div>
  )
}
