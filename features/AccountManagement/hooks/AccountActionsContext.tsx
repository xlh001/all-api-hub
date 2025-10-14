import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from "react"
import toast from "react-hot-toast"

import { accountStorage } from "~/services/accountStorage"
import type { DisplaySiteData } from "~/types"

import { useAccountDataContext } from "./AccountDataContext"

// 1. 定义 Context 的值类型
interface AccountActionsContextType {
  refreshingAccountId: string | null
  handleRefreshAccount: (
    account: DisplaySiteData,
    force?: boolean
  ) => Promise<void>
  handleDeleteAccount: (account: DisplaySiteData) => void
  handleCopyUrl: (account: DisplaySiteData) => void
}

// 2. 创建 Context
const AccountActionsContext = createContext<
  AccountActionsContextType | undefined
>(undefined)

// 3. 创建 Provider 组件
export const AccountActionsProvider = ({
  children
}: {
  children: ReactNode
}) => {
  const { loadAccountData } = useAccountDataContext()
  const [refreshingAccountId, setRefreshingAccountId] = useState<string | null>(
    null
  )

  const handleRefreshAccount = useCallback(
    async (account: DisplaySiteData, force: boolean = true) => {
      if (refreshingAccountId) return

      setRefreshingAccountId(account.id)

      const refreshPromise = async () => {
        const result = await accountStorage.refreshAccount(account.id, force)
        if (result) {
          await loadAccountData()
          return result
        } else {
          throw new Error("刷新失败")
        }
      }

      try {
        await toast.promise(
          refreshPromise().then((result) => {
            if (!result.refreshed) {
              return "刷新间隔未到，已跳过"
            }
            return `${account.name} 刷新成功！`
          }),
          {
            loading: `正在刷新 ${account.name}...`,
            success: (message) => message,
            error: `刷新 ${account.name} 失败`
          }
        )
      } catch (error) {
        console.error("Error refreshing account:", error)
      } finally {
        setRefreshingAccountId(null)
      }
    },
    [refreshingAccountId, loadAccountData]
  )

  const handleDeleteAccount = useCallback(() => {
    // The actual deletion logic is in DelAccountDialog,
    // this just reloads the data after deletion.
    loadAccountData()
  }, [loadAccountData])

  const handleCopyUrl = useCallback((account: DisplaySiteData) => {
    navigator.clipboard.writeText(account.baseUrl)
    toast.success(`已复制 ${account.name} 的 URL 到剪贴板`)
  }, [])

  const value = useMemo(
    () => ({
      refreshingAccountId,
      handleRefreshAccount,
      handleDeleteAccount,
      handleCopyUrl
    }),
    [
      refreshingAccountId,
      handleRefreshAccount,
      handleDeleteAccount,
      handleCopyUrl
    ]
  )

  return (
    <AccountActionsContext.Provider value={value}>
      {children}
    </AccountActionsContext.Provider>
  )
}

// 4. 创建自定义 Hook
export const useAccountActionsContext = () => {
  const context = useContext(AccountActionsContext)
  if (
    context === undefined ||
    !context.handleRefreshAccount ||
    !context.handleDeleteAccount ||
    !context.handleCopyUrl
  ) {
    throw new Error(
      "useAccountActionsContext 必须在 AccountActionsProvider 中使用，并且必须提供所有必需的函数"
    )
  }
  return context
}
