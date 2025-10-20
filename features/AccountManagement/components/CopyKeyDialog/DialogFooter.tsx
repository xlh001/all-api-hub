import { KeyIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

interface DialogFooterProps {
  tokenCount: number
  onClose: () => void
}

export function DialogFooter({ tokenCount, onClose }: DialogFooterProps) {
  const { t } = useTranslation(["ui", "common"])

  return (
    <div className="px-4 py-3 border-t border-gray-100 dark:border-dark-bg-tertiary bg-gray-50/50 dark:bg-dark-bg-secondary">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {tokenCount > 0 && (
            <div className="flex items-center space-x-1.5 text-xs text-gray-500 dark:text-dark-text-secondary">
              <KeyIcon className="w-3 h-3" />
              <span>{t("ui:dialog.copyKey.totalKeys", { count: tokenCount })}</span>
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-dark-text-secondary bg-white dark:bg-dark-bg-secondary border border-gray-300 dark:border-dark-bg-tertiary rounded hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
          {t("common:actions.close")}
        </button>
      </div>
    </div>
  )
}
