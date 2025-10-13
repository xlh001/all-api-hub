import { ThemeProvider } from "~/contexts/ThemeContext"
import { UserPreferencesProvider } from "~/contexts/UserPreferencesContext"
import IndexPopup from "~/popup"

function IndexSidePanel() {
  return (
    <UserPreferencesProvider>
      <ThemeProvider>
        <IndexPopup inSidePanel={true} />
      </ThemeProvider>
    </UserPreferencesProvider>
  )
}

export default IndexSidePanel
