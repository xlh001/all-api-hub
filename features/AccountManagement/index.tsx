import { Toaster } from "react-hot-toast"

import AccountList from "~/features/AccountManagement/components/AccountList"
import { AccountManagementProvider } from "~/features/AccountManagement/hooks/AccountManagementProvider"

function AccountManagement() {
  return (
    <AccountManagementProvider>
      <div className={`bg-white flex flex-col`}>
        <AccountList />
      </div>
    </AccountManagementProvider>
  )
}

export default AccountManagement
