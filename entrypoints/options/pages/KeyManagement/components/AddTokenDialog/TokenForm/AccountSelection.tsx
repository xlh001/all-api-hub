import { useTranslation } from "react-i18next"

import type { FormData } from "../hooks/useTokenForm"

export interface Account {
  id: string
  name: string
}

interface AccountSelectionProps {
  accountId: string
  handleInputChange: (
    field: keyof FormData
  ) => (e: React.ChangeEvent<HTMLSelectElement>) => void
  isEditMode: boolean
  availableAccounts: Account[]
  error?: string
}

export function AccountSelection({
  accountId,
  handleInputChange,
  isEditMode,
  availableAccounts,
  error
}: AccountSelectionProps) {
  const { t } = useTranslation()

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">
        {t("keyManagement.accountSelect")}{" "}
        <span className="text-red-500">*</span>
      </label>
      <select
        value={accountId}
        onChange={handleInputChange("accountId")}
        disabled={isEditMode}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text-primary ${
          error
            ? "border-red-300"
            : "border-gray-300 dark:border-dark-bg-tertiary"
        } ${isEditMode ? "bg-gray-100 dark:bg-dark-bg-tertiary cursor-not-allowed" : ""}`}>
        <option value="">{t("keyManagement.pleaseSelectAccount")}</option>
        {availableAccounts.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
      {isEditMode && (
        <p className="mt-1 text-xs text-gray-500 dark:text-dark-text-tertiary">
          {t("keyManagement.editModeNoChange")}
        </p>
      )}
    </div>
  )
}
