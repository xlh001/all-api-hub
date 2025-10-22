import "./style.css"

import { UI_CONSTANTS } from "~/constants/ui"
import { DeviceProvider } from "~/contexts/DeviceContext"
import {
  UserPreferencesProvider,
  useUserPreferencesContext
} from "~/contexts/UserPreferencesContext"
import AccountList from "~/features/AccountManagement/components/AccountList"
import { AccountManagementProvider } from "~/features/AccountManagement/hooks/AccountManagementProvider"
import { isMobileByUA } from "~/utils/browser.ts"

import ActionButtons from "./components/ActionButtons"
import BalanceSection from "./components/BalanceSection"
import HeaderSection from "./components/HeaderSection"

function PopupContent({ inSidePanel = false }) {
  const { isLoading } = useUserPreferencesContext()

  const popupWidthClass = isMobileByUA()
    ? "w-full"
    : inSidePanel
      ? ""
      : UI_CONSTANTS.POPUP.WIDTH

  const popupHeightClass = isMobileByUA()
    ? ""
    : inSidePanel
      ? ""
      : UI_CONSTANTS.POPUP.HEIGHT

  return (
    <div
      className={`${popupWidthClass} ${popupHeightClass} bg-white dark:bg-dark-bg-primary flex flex-col`}>
      <HeaderSection />

      <div className="flex-1 overflow-y-auto">
        {!isLoading && <BalanceSection />}

        <ActionButtons inSidePanel={inSidePanel} />

        <AccountList />
      </div>
    </div>
  )
}

function App({ inSidePanel = false }) {
  return (
    <DeviceProvider>
      <UserPreferencesProvider>
        <AccountManagementProvider>
          <PopupContent inSidePanel={inSidePanel} />
        </AccountManagementProvider>
      </UserPreferencesProvider>
    </DeviceProvider>
  )
}

export default App
