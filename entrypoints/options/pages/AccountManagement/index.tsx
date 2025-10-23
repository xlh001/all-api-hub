import { UserIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import { BodySmall, Heading2 } from "~/components/ui"
import AccountList from "~/features/AccountManagement/components/AccountList"
import { AccountManagementProvider } from "~/features/AccountManagement/hooks/AccountManagementProvider"

function AccountManagement({ refreshKey }: { refreshKey?: number }) {
  const { t } = useTranslation("account")
  return (
    <div className="flex flex-col bg-white p-6 dark:bg-dark-bg-secondary">
      {/* 页面标题 */}
      <div className="mb-6">
        <div className="mb-2 flex items-center space-x-3">
          <UserIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <Heading2>{t("title")}</Heading2>
        </div>
        <BodySmall>{t("description")}</BodySmall>
      </div>
      <AccountManagementProvider refreshKey={refreshKey}>
        <div className={`flex flex-col bg-white dark:bg-dark-bg-secondary`}>
          <AccountList />
        </div>
      </AccountManagementProvider>
    </div>
  )
}

export default AccountManagement
