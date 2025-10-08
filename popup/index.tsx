import "./style.css"

import { Toaster } from "react-hot-toast"

import AccountList from "~/components/AccountList"
import ActionButtons from "~/components/ActionButtons"
import BalanceSection from "~/components/BalanceSection"
import HeaderSection from "~/components/HeaderSection"
import { UI_CONSTANTS } from "~/constants/ui"
import { PopupProvider, useUserPreferencesContext } from "~/contexts"

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
    <PopupProvider>
      <PopupContent inSidePanel={inSidePanel} />
    </PopupProvider>
  )
}

export default IndexPopup
