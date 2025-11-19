import { UserIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import { BodySmall, Button, Heading2 } from "~/components/ui"
import AccountList from "~/features/AccountManagement/components/AccountList"
import { AccountManagementProvider } from "~/features/AccountManagement/hooks/AccountManagementProvider"
import { useDialogStateContext } from "~/features/AccountManagement/hooks/DialogStateContext"

function AccountManagementContent({ searchQuery }: { searchQuery?: string }) {
  const { t } = useTranslation("account")
  const { openAddAccount } = useDialogStateContext()

  return (
    <div className="flex flex-col bg-white p-6 dark:bg-dark-bg-secondary">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="mb-2 flex items-center space-x-3">
            <UserIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <Heading2>{t("title")}</Heading2>
          </div>
          <BodySmall>{t("description")}</BodySmall>
        </div>
        <Button onClick={openAddAccount}>{t("addAccount")}</Button>
      </div>

      {/* Account List */}
      <div className="flex flex-col bg-white dark:bg-dark-bg-secondary">
        <AccountList initialSearchQuery={searchQuery} />
      </div>
    </div>
  )
}

interface AccountManagementProps {
  refreshKey?: number
  routeParams?: Record<string, string>
}

function AccountManagement({
  refreshKey,
  routeParams
}: AccountManagementProps) {
  return (
    <AccountManagementProvider refreshKey={refreshKey}>
      <AccountManagementContent searchQuery={routeParams?.search} />
    </AccountManagementProvider>
  )
}

export default AccountManagement
