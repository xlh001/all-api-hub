import { ThemeProvider } from "../../contexts/ThemeContext.tsx"
import { UserPreferencesProvider } from "../../contexts/UserPreferencesContext.tsx"
import Popup from "../popup/App.tsx"

function SidePanel() {
  return (
    <UserPreferencesProvider>
      <ThemeProvider>
        <Popup inSidePanel={true} />
      </ThemeProvider>
    </UserPreferencesProvider>
  )
}

export default SidePanel
