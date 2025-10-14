import { type ReactNode } from "react"

import { ThemeAwareToaster } from "~/components/ThemeAwareToaster"
import { ThemeProvider } from "~/contexts/ThemeContext"
import { UserPreferencesProvider } from "~/contexts/UserPreferencesContext"

import { AccountActionsProvider } from "./AccountActionsContext"
import { AccountDataProvider } from "./AccountDataContext"
import { DialogStateProvider } from "./DialogStateContext"

export const AccountManagementProvider = ({
  children,
  refreshKey
}: {
  children: ReactNode
  refreshKey?: number
}) => {
  return (
    <UserPreferencesProvider>
      <ThemeProvider>
        <AccountDataProvider refreshKey={refreshKey}>
          <DialogStateProvider>
            <AccountActionsProvider>{children}</AccountActionsProvider>
            <ThemeAwareToaster reverseOrder={true} />
          </DialogStateProvider>
        </AccountDataProvider>
      </ThemeProvider>
    </UserPreferencesProvider>
  )
}
