import { UserIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import { BodySmall, Heading2 } from "~/components/ui"
import AccountList from "~/features/AccountManagement/components/AccountList"
import { AccountManagementProvider } from "~/features/AccountManagement/hooks/AccountManagementProvider"

function AccountManagement({ refreshKey }: { refreshKey?: number }) {
  const { t } = useTranslation("account")
  return (
    <div className="p-6 bg-white dark:bg-dark-bg-secondary flex flex-col">
      {/* 页面标题 */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <UserIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <Heading2>{t("title")}</Heading2>
        </div>
        <BodySmall>{t("description")}</BodySmall>
      </div>
      <AccountManagementProvider refreshKey={refreshKey}>
        <div className={`bg-white dark:bg-dark-bg-secondary flex flex-col`}>
          <AccountList />
        </div>
      </AccountManagementProvider>
    </div>
  )
}

export default AccountManagement
