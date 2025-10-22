import { useTranslation } from "react-i18next"

import { FormField, Select } from "~/components/ui"

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
  const { t } = useTranslation("keyManagement")

  return (
    <FormField
      label={`${t("dialog.accountSelect")} *`}
      htmlFor="accountSelect"
      error={error}
      description={isEditMode ? t("dialog.editModeNoChange") : undefined}>
      <Select
        id="accountSelect"
        value={accountId}
        onChange={handleInputChange("accountId")}
        disabled={isEditMode}>
        <option value="">{t("pleaseSelectAccount")}</option>
        {availableAccounts.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name}
          </option>
        ))}
      </Select>
    </FormField>
  )
}
