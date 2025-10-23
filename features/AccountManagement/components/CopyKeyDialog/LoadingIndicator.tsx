import { useTranslation } from "react-i18next"

export function LoadingIndicator() {
  const { t } = useTranslation("ui")

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-purple-300 border-t-purple-600" />
      <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
        {t("dialog.copyKey.loading")}
      </p>
    </div>
  )
}
