import { useCallback, useState } from "react"

import type { DisplaySiteData } from "~/types"

/**
 * @description 管理应用中所有弹窗状态和相关逻辑的自定义 Hook。
 * @param {() => void} [onCloseCallback] - 关闭弹窗时触发的回调函数，例如用于重新加载数据。
 * @returns {{
 *   isAddAccountOpen: boolean,
 *   isEditAccountOpen: boolean,
 *   isFirefoxWarningOpen: boolean,
 *   editingAccount: DisplaySiteData | null,
 *   openAddAccount: () => void,
 *   closeAddAccount: () => void,
 *   openEditAccount: (account: DisplaySiteData) => void,
 *   closeEditAccount: () => void,
 *   openFirefoxWarning: () => void,
 *   closeFirefoxWarning: () => void
 * }}
 */
export const usePopupManager = (onCloseCallback?: () => void) => {
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false)
  const [isEditAccountOpen, setIsEditAccountOpen] = useState(false)
  const [isFirefoxWarningOpen, setIsFirefoxWarningOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<DisplaySiteData | null>(
    null
  )

  const openAddAccount = useCallback(() => setIsAddAccountOpen(true), [])
  const closeAddAccount = useCallback(() => {
    setIsAddAccountOpen(false)
    onCloseCallback?.()
  }, [onCloseCallback])

  const openEditAccount = useCallback((account: DisplaySiteData) => {
    setEditingAccount(account)
    setIsEditAccountOpen(true)
  }, [])

  const closeEditAccount = useCallback(() => {
    setIsEditAccountOpen(false)
    setEditingAccount(null)
    onCloseCallback?.()
  }, [onCloseCallback])

  const openFirefoxWarning = useCallback(
    () => setIsFirefoxWarningOpen(true),
    []
  )
  const closeFirefoxWarning = useCallback(
    () => setIsFirefoxWarningOpen(false),
    []
  )

  return {
    isAddAccountOpen,
    isEditAccountOpen,
    isFirefoxWarningOpen,
    editingAccount,
    openAddAccount,
    closeAddAccount,
    openEditAccount,
    closeEditAccount,
    openFirefoxWarning,
    closeFirefoxWarning
  }
}
