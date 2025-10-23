import {
  BoltIcon,
  CheckIcon,
  PencilIcon,
  SparklesIcon
} from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

interface ActionButtonsProps {
  mode: "add" | "edit"
  url: string
  isDetecting: boolean
  isSaving: boolean
  isFormValid: boolean
  isDetected?: boolean
  onAutoDetect: () => void
  onShowManualForm: () => void
  onClose: () => void
  onAutoConfig: () => Promise<void>
  isAutoConfiguring: boolean
  formId?: string
}

export default function ActionButtons({
  mode,
  url,
  isDetecting,
  isSaving,
  isFormValid,
  isDetected,
  onAutoDetect,
  onShowManualForm,
  onClose,
  onAutoConfig,
  isAutoConfiguring,
  formId
}: ActionButtonsProps) {
  const { t } = useTranslation(["accountDialog", "common"])
  const isAddMode = mode === "add"

  if (isAddMode && !isDetected && !isFormValid) {
    return (
      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onAutoDetect}
          disabled={!url.trim() || isDetecting}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
          {isDetecting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{t("accountDialog:mode.detecting")}</span>
            </>
          ) : (
            <>
              <SparklesIcon className="w-4 h-4" />
              <span>{t("accountDialog:mode.autoDetect")}</span>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onShowManualForm}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-dark-text-secondary bg-white dark:bg-dark-bg-secondary border border-gray-300 dark:border-dark-bg-tertiary rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm">
          <PencilIcon className="w-4 h-4" />
          <span>{t("accountDialog:mode.manualAdd")}</span>
        </button>
      </div>
    )
  }

  return (
    <div className="flex space-x-3 pt-2">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-dark-text-secondary bg-gray-100 dark:bg-dark-bg-tertiary rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500">
        {t("common:actions.cancel")}
      </button>

      {mode === "edit" && !isDetected && (
        <button
          type="button"
          onClick={onAutoDetect}
          disabled={!url.trim() || isDetecting}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
          {isDetecting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{t("accountDialog:mode.detecting")}</span>
            </>
          ) : (
            <>
              <SparklesIcon className="w-4 h-4" />
              <span>{t("accountDialog:mode.reDetect")}</span>
            </>
          )}
        </button>
      )}

      {isAddMode && isDetected && (
        <button
          type="button"
          onClick={onAutoConfig}
          disabled={isAutoConfiguring || isSaving}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          aria-label={t("accountDialog:actions.autoConfigAriaLabel")}
          title={t("accountDialog:actions.autoConfigTitle")}>
          {isAutoConfiguring ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{t("accountDialog:actions.configuring")}</span>
            </>
          ) : (
            <>
              <BoltIcon className="w-4 h-4" />
              <span>{t("accountDialog:actions.configToNewApi")}</span>
            </>
          )}
        </button>
      )}

      <button
        type="submit"
        {...(formId ? { form: formId } : {})}
        disabled={!isFormValid || isSaving || isAutoConfiguring}
        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
        {isSaving ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>{t("common:status.saving")}</span>
          </>
        ) : (
          <>
            <CheckIcon className="w-4 h-4" />
            <span>
              {isAddMode
                ? isDetected
                  ? t("accountDialog:actions.confirmAdd")
                  : t("accountDialog:actions.saveAccount")
                : t("accountDialog:actions.saveChanges")}
            </span>
          </>
        )}
      </button>
    </div>
  )
}
