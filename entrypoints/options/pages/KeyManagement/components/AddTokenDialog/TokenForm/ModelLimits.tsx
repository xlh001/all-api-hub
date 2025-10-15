import { Switch } from "@headlessui/react"
import { useTranslation } from "react-i18next"

import type { FormData } from "../hooks/useTokenForm"

interface ModelLimitsProps {
  modelLimitsEnabled: boolean
  modelLimits: string[]
  availableModels: string[]
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
  handleModelSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export function ModelLimits({
  modelLimitsEnabled,
  modelLimits,
  availableModels,
  setFormData,
  handleModelSelectChange
}: ModelLimitsProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
          {t("keyManagement.modelLimits")}
        </label>
        <Switch
          checked={modelLimitsEnabled}
          onChange={(enabled) => {
            setFormData((prev) => ({
              ...prev,
              modelLimitsEnabled: enabled,
              modelLimits: enabled ? prev.modelLimits : []
            }))
          }}
          className={`${
            modelLimitsEnabled
              ? "bg-blue-600"
              : "bg-gray-200 dark:bg-dark-bg-tertiary"
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}>
          <span
            className={`${
              modelLimitsEnabled ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>

      {modelLimitsEnabled && (
        <div>
          <select
            multiple
            value={modelLimits}
            onChange={handleModelSelectChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-bg-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text-primary h-32">
            {availableModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500 dark:text-dark-text-tertiary">
            {t("keyManagement.modelSelectHint", { count: modelLimits.length })}
          </p>
        </div>
      )}
    </div>
  )
}
