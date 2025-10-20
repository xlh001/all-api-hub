import { useTranslation } from "react-i18next"

interface FormActionsProps {
  isSubmitting: boolean
  isEditMode: boolean
  onClose: () => void
  onSubmit: () => void
  canSubmit: boolean
}

export function FormActions({
  isSubmitting,
  isEditMode,
  onClose,
  onSubmit,
  canSubmit
}: FormActionsProps) {
  const { t } = useTranslation("keyManagement")

  return (
    <div className="flex justify-end space-x-3 pt-4">
      <button
        onClick={onClose}
        disabled={isSubmitting}
        className="px-4 py-2 text-gray-700 dark:text-dark-text-secondary bg-gray-100 dark:bg-dark-bg-tertiary hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50">
        {t("common:actions.cancel")}
      </button>
      <button
        onClick={onSubmit}
        disabled={isSubmitting || !canSubmit}
        className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center space-x-2">
        {isSubmitting && (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        )}
        <span>
          {isSubmitting
            ? isEditMode
              ? t("common:status.updating")
              : t("common:status.creating")
            : isEditMode
              ? t("dialog.updateToken")
              : t("dialog.createToken")}
        </span>
      </button>
    </div>
  )
}
