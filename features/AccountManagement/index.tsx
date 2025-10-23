import AccountList from "~/features/AccountManagement/components/AccountList"
import { AccountManagementProvider } from "~/features/AccountManagement/hooks/AccountManagementProvider"

function AccountManagement() {
  return (
    <AccountManagementProvider>
      <div className={`flex flex-col bg-white dark:bg-dark-bg-primary`}>
        <AccountList />
      </div>
    </AccountManagementProvider>
  )
}

export default AccountManagement
