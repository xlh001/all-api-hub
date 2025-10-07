import React, { type ReactNode } from "react"

import { AccountActionsProvider } from "./AccountActionsContext"
import { AccountDataProvider } from "./AccountDataContext"
import { DialogStateProvider } from "./DialogStateContext"
import { UserPreferencesProvider } from "./UserPreferencesContext"

export const PopupProvider = ({ children }: { children: ReactNode }) => {
  return (
    <UserPreferencesProvider>
      <AccountDataProvider>
        <DialogStateProvider>
          <AccountActionsProvider>{children}</AccountActionsProvider>
        </DialogStateProvider>
      </AccountDataProvider>
    </UserPreferencesProvider>
  )
}
