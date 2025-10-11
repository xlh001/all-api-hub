import React, { type ReactNode } from "react"

import { UserPreferencesProvider } from "../../../contexts/UserPreferencesContext"
import { AccountActionsProvider } from "./AccountActionsContext"
import { AccountDataProvider } from "./AccountDataContext"
import { DialogStateProvider } from "./DialogStateContext"

export const AccountManagementProvider = ({
  children
}: {
  children: ReactNode
}) => {
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
