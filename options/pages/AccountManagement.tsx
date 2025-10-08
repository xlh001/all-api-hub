import { Toaster } from "react-hot-toast"

import AccountList from "~/components/AccountList"
import { PopupProvider } from "~/contexts"

function AccountManagement() {
  return (
    <PopupProvider>
      <div className={`bg-white flex flex-col`}>
        <AccountList />
        <Toaster position="bottom-center" reverseOrder={true} />
      </div>
    </PopupProvider>
  )
}

export default AccountManagement
