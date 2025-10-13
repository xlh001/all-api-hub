import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"

import { fetchAvailableModels, fetchUserGroups } from "~/services/apiService"
import type { UserGroupInfo } from "~/services/apiService/common/type"
import type { DisplaySiteData } from "~/types"

import type { FormData } from "./useTokenForm"

export function useTokenData(
  isOpen: boolean,
  currentAccount: DisplaySiteData | undefined,
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
) {
  const [isLoading, setIsLoading] = useState(false)
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [groups, setGroups] = useState<Record<string, UserGroupInfo>>({})

  const loadInitialData = useCallback(async () => {
    if (!currentAccount) return

    setIsLoading(true)
    try {
      const [models, groupsData] = await Promise.all([
        fetchAvailableModels(currentAccount),
        fetchUserGroups(currentAccount)
      ])

      setAvailableModels(models)
      setGroups(groupsData)

      // Set default group
      if (groupsData.default) {
        setFormData((prev) => ({ ...prev, group: "default" }))
      } else {
        const firstGroup = Object.keys(groupsData)[0]
        if (firstGroup) {
          setFormData((prev) => ({ ...prev, group: firstGroup }))
        }
      }
    } catch (error) {
      console.error("Failed to load initial data:", error)
      toast.error("加载数据失败，请稍后重试")
    } finally {
      setIsLoading(false)
    }
  }, [currentAccount, setFormData])

  useEffect(() => {
    if (isOpen && currentAccount) {
      loadInitialData()
    }
  }, [isOpen, currentAccount, loadInitialData])

  const resetData = () => {
    setAvailableModels([])
    setGroups({})
  }

  return { isLoading, availableModels, groups, resetData }
}
