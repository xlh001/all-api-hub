import "./style.css"

import { UI_CONSTANTS } from "~/constants/ui"
import { ThemeProvider } from "~/contexts/ThemeContext"
import {
  UserPreferencesProvider,
  useUserPreferencesContext
} from "~/contexts/UserPreferencesContext"
import AccountList from "~/features/AccountManagement/components/AccountList"
import { AccountManagementProvider } from "~/features/AccountManagement/hooks/AccountManagementProvider"
import ActionButtons from "~/popup/components/ActionButtons"
import BalanceSection from "~/popup/components/BalanceSection"
import HeaderSection from "~/popup/components/HeaderSection"

function PopupContent({ inSidePanel = false }) {
  const { isLoading } = useUserPreferencesContext()

  return (
    <div
      className={`${!inSidePanel && UI_CONSTANTS.POPUP.WIDTH} bg-white dark:bg-dark-bg-primary flex flex-col ${!inSidePanel && UI_CONSTANTS.POPUP.HEIGHT}`}>
      <HeaderSection />

      <div className="flex-1 overflow-y-auto">
        {!isLoading && <BalanceSection />}

        <ActionButtons inSidePanel={inSidePanel} />

        <AccountList />
      </div>
    </div>
  )
}

function IndexPopup({ inSidePanel = false }) {
  return (
    <UserPreferencesProvider>
      <ThemeProvider>
        <AccountManagementProvider>
          <PopupContent inSidePanel={inSidePanel} />
        </AccountManagementProvider>
      </ThemeProvider>
    </UserPreferencesProvider>
  )
}

export default IndexPopup
