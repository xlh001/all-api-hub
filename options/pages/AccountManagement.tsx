import { Toaster } from "react-hot-toast"

import AccountList from "~/components/AccountList"
import AddAccountDialog from "~/components/AddAccountDialog"
import EditAccountDialog from "~/components/EditAccountDialog"
import { PopupProvider } from "~/contexts"

function AccountManagement() {
  return (
    <PopupProvider>
      <div
        className={`bg-white flex flex-col`}>
        <AccountList />
        <AddAccountDialog />
        <EditAccountDialog />

        <Toaster position="bottom-center" reverseOrder={true} />
      </div>
    </PopupProvider>
  )
}

export default AccountManagement
