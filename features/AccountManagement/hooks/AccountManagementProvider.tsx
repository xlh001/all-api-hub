import React, { type ReactNode } from "react"
import { Toaster } from "react-hot-toast"

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
      <AccountDataProvider refreshKey={refreshKey}>
        <DialogStateProvider>
          <AccountActionsProvider>{children}</AccountActionsProvider>
          <Toaster position="bottom-center" reverseOrder={true} />
        </DialogStateProvider>
      </AccountDataProvider>
    </UserPreferencesProvider>
  )
}
