import "./style.css"

import { Toaster } from "react-hot-toast"

import { UI_CONSTANTS } from "~/constants/ui"
import { useUserPreferencesContext } from "~/contexts/UserPreferencesContext"
import AccountList from "~/options/pages/AccountManagement/components/AccountList"
import { AccountManagementProvider } from "~/options/pages/AccountManagement/hooks/AccountManagementProvider"
import ActionButtons from "~/popup/components/ActionButtons"
import BalanceSection from "~/popup/components/BalanceSection"
import HeaderSection from "~/popup/components/HeaderSection"

function PopupContent({ inSidePanel = false }) {
  const { isLoading } = useUserPreferencesContext()

  return (
    <div
      className={`${!inSidePanel && UI_CONSTANTS.POPUP.WIDTH} bg-white flex flex-col ${!inSidePanel && UI_CONSTANTS.POPUP.HEIGHT}`}>
      <HeaderSection />

      <div className="flex-1 overflow-y-auto">
        {!isLoading && <BalanceSection />}

        <ActionButtons inSidePanel={inSidePanel} />

        <AccountList />
      </div>

      <Toaster position="bottom-center" reverseOrder={true} />
    </div>
  )
}

function IndexPopup({ inSidePanel = false }) {
  return (
    <AccountManagementProvider>
      <PopupContent inSidePanel={inSidePanel} />
    </AccountManagementProvider>
  )
}

export default IndexPopup
