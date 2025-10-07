import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from "react"

import { useAccountDataContext } from "~/contexts/AccountDataContext"
import type { DisplaySiteData } from "~/types"

// 1. 定义 Context 的值类型
interface DialogStateContextType {
  isAddAccountOpen: boolean
  isEditAccountOpen: boolean
  editingAccount: DisplaySiteData | null
  openAddAccount: () => void
  closeAddAccount: () => void
  openEditAccount: (account: DisplaySiteData) => void
  closeEditAccount: () => void
}

// 2. 创建 Context
const DialogStateContext = createContext<DialogStateContextType | undefined>(
  undefined
)

// 3. 创建 Provider 组件
export const DialogStateProvider = ({ children }: { children: ReactNode }) => {
  const { loadAccountData } = useAccountDataContext()
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false)
  const [isEditAccountOpen, setIsEditAccountOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<DisplaySiteData | null>(
    null
  )

  const openAddAccount = useCallback(() => setIsAddAccountOpen(true), [])

  const closeAddAccount = useCallback(() => {
    setIsAddAccountOpen(false)
    loadAccountData()
  }, [loadAccountData])

  const openEditAccount = useCallback((account: DisplaySiteData) => {
    setEditingAccount(account)
    setIsEditAccountOpen(true)
  }, [])

  const closeEditAccount = useCallback(() => {
    setIsEditAccountOpen(false)
    setEditingAccount(null)
    loadAccountData()
  }, [loadAccountData])

  const value = useMemo(
    () => ({
      isAddAccountOpen,
      isEditAccountOpen,
      editingAccount,
      openAddAccount,
      closeAddAccount,
      openEditAccount,
      closeEditAccount
    }),
    [
      isAddAccountOpen,
      isEditAccountOpen,
      editingAccount,
      openAddAccount,
      closeAddAccount,
      openEditAccount,
      closeEditAccount
    ]
  )

  return (
    <DialogStateContext.Provider value={value}>
      {children}
    </DialogStateContext.Provider>
  )
}

// 4. 创建自定义 Hook
export const useDialogStateContext = () => {
  const context = useContext(DialogStateContext)
  if (
    context === undefined ||
    !context.openAddAccount ||
    !context.closeAddAccount ||
    !context.openEditAccount ||
    !context.closeEditAccount
  ) {
    throw new Error(
      "useDialogStateContext 必须在 DialogStateProvider 中使用，并且必须提供所有必需的函数"
    )
  }
  return context
}
