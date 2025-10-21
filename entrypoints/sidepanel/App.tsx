import { DeviceProvider } from "../../contexts/DeviceContext.tsx"
import { ThemeProvider } from "../../contexts/ThemeContext.tsx"
import { UserPreferencesProvider } from "../../contexts/UserPreferencesContext.tsx"
import Popup from "../popup/App.tsx"

function SidePanel() {
  return (
    <DeviceProvider>
      <UserPreferencesProvider>
        <ThemeProvider>
          <Popup inSidePanel={true} />
        </ThemeProvider>
      </UserPreferencesProvider>
    </DeviceProvider>
  )
}

export default SidePanel
