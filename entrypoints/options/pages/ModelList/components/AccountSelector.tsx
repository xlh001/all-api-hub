import { useTranslation } from "react-i18next"

import type { DisplaySiteData } from "~/types"

interface AccountSelectorProps {
  selectedAccount: string
  setSelectedAccount: (accountId: string) => void
  accounts: DisplaySiteData[]
}

export function AccountSelector({
  selectedAccount,
  setSelectedAccount,
  accounts
}: AccountSelectorProps) {
  const { t } = useTranslation()
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-2">
        {t("modelList.selectAccount")}
      </label>
      <select
        value={selectedAccount}
        onChange={(e) => setSelectedAccount(e.target.value)}
        className="w-full sm:w-80 px-3 py-2 border border-gray-300 dark:border-dark-bg-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text-primary">
        <option value="">{t("modelList.pleaseSelectAccount")}</option>
        {accounts.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name}
          </option>
        ))}
      </select>
    </div>
  )
}
