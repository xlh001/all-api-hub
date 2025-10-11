import { Toaster } from "react-hot-toast"

import AccountList from "~/features/AccountManagement/components/AccountList"
import { AccountManagementProvider } from "~/features/AccountManagement/hooks/AccountManagementProvider"

function AccountManagement() {
  return (
    <AccountManagementProvider>
      <div className={`bg-white flex flex-col`}>
        <AccountList />
        <Toaster position="bottom-center" reverseOrder={true} />
      </div>
    </AccountManagementProvider>
  )
}

export default AccountManagement
