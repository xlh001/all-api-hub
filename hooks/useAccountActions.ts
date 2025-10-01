import { useCallback, useState } from "react"
import toast from "react-hot-toast"

import { accountStorage } from "~/services/accountStorage"
import type { DisplaySiteData } from "~/types"

/**
 * @description 管理与单个账号相关的操作，如刷新、删除等。
 * @param {() => Promise<void>} loadAccountData - 用于在操作成功后重新加载所有账号数据的回调函数。
 * @returns {{
 *   refreshingAccountId: string | null,
 *   handleRefreshAccount: (account: DisplaySiteData) => Promise<void>,
 *   handleDeleteAccount: (account: DisplaySiteData) => void,
 *   handleCopyUrl: (account: DisplaySiteData) => void
 * }}
 */
export const useAccountActions = (loadAccountData: () => Promise<void>) => {
  const [refreshingAccountId, setRefreshingAccountId] = useState<string | null>(
    null
  )

  const handleRefreshAccount = useCallback(
    async (account: DisplaySiteData) => {
      if (refreshingAccountId) return // 防止重复刷新

      setRefreshingAccountId(account.id)

      const refreshPromise = async () => {
        console.log("开始刷新账号:", account.name)
        const success = await accountStorage.refreshAccount(account.id)

        if (success) {
          console.log("账号刷新成功:", account.name)
          await loadAccountData()
          return success
        } else {
          console.warn("账号刷新失败:", account.name)
          throw new Error("刷新失败")
        }
      }

      try {
        await toast.promise(refreshPromise(), {
          loading: `正在刷新 ${account.name}...`,
          success: `${account.name} 刷新成功!`,
          error: `${account.name} 刷新失败`
        })
      } catch (error) {
        console.error("刷新账号时出错:", error)
      } finally {
        setRefreshingAccountId(null)
      }
    },
    [refreshingAccountId, loadAccountData]
  )

  const handleDeleteAccount = useCallback(
    (account: DisplaySiteData) => {
      console.log("删除账号:", account.name)
      loadAccountData() // 重新加载数据
    },
    [loadAccountData]
  )

  const handleCopyUrl = (account: DisplaySiteData) => {
    toast.success(`已复制 ${account.name} 的URL到剪贴板`)
  }

  return {
    refreshingAccountId,
    handleRefreshAccount,
    handleDeleteAccount,
    handleCopyUrl
  }
}
