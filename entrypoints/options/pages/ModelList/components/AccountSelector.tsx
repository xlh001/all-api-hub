import { useTranslation } from "react-i18next"

import { Heading3, Select } from "~/components/ui"
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
  const { t } = useTranslation("modelList")
  return (
    <div className="mb-6">
      <Heading3 className="mb-3">{t("selectAccount")}</Heading3>
      <Select
        value={selectedAccount}
        onChange={(e) => setSelectedAccount(e.target.value)}
        className="w-full sm:w-80">
        <option value="">{t("pleaseSelectAccount")}</option>
        {accounts.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name}
          </option>
        ))}
      </Select>
    </div>
  )
}
