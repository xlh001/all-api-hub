import { useTranslation } from "react-i18next"

import { FormField, SearchableSelect } from "~/components/ui"

export interface Account {
  id: string
  name: string
}

interface AccountSelectionProps {
  accountId: string
  handleSelectChange: (value: string) => void
  isEditMode: boolean
  availableAccounts: Account[]
  error?: string
}

export function AccountSelection({
  accountId,
  handleSelectChange,
  isEditMode,
  availableAccounts,
  error,
}: AccountSelectionProps) {
  const { t } = useTranslation("keyManagement")

  return (
    <FormField
      label={`${t("dialog.accountSelect")} *`}
      htmlFor="accountSelect"
      error={error}
      description={isEditMode ? t("dialog.editModeNoChange") : undefined}
    >
      <SearchableSelect
        options={[
          { value: "", label: t("pleaseSelectAccount") },
          ...availableAccounts.map((account) => ({
            value: account.id,
            label: account.name,
          })),
        ]}
        value={accountId || ""}
        onChange={handleSelectChange}
        placeholder={t("pleaseSelectAccount")}
        disabled={isEditMode}
      />
    </FormField>
  )
}
