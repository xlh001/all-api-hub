import { useCallback, useEffect } from "react"
import toast from "react-hot-toast"

import { useAccountData } from "~/hooks/useAccountData"
import { fetchModelPricing } from "~/services/apiService"
import type { PricingResponse } from "~/services/apiService/common/type"

interface UseModelDataProps {
  selectedAccount: string
  setSelectedGroup: (group: string) => void
  setIsLoading: (loading: boolean) => void
  setDataFormatError: (error: boolean) => void
  setPricingData: (data: PricingResponse | null) => void
  pricingData: PricingResponse | null
  selectedGroup: string
}

export function useModelData({
  selectedAccount,
  setSelectedGroup,
  setIsLoading,
  setDataFormatError,
  setPricingData,
  pricingData,
  selectedGroup
}: UseModelDataProps) {
  const { displayData } = useAccountData()
  const safeDisplayData = displayData || []

  const loadPricingData = useCallback(
    async (accountId: string) => {
      const account = safeDisplayData.find((acc) => acc.id === accountId)
      if (!account) return

      setIsLoading(true)
      setDataFormatError(false)
      try {
        const data = await fetchModelPricing(account, account.siteType)

        if (!Array.isArray(data.data)) {
          setDataFormatError(true)
          setPricingData(null)
          toast.error(
            "当前站点的模型数据格式不符合标准，请手动查看站点定价页面"
          )
          return
        }

        setPricingData(data)
        toast.success("模型数据加载成功")
      } catch (error) {
        console.error("加载模型数据失败:", error)
        toast.error("加载模型数据失败，请稍后重试")
        setPricingData(null)
        setDataFormatError(false)
      } finally {
        setIsLoading(false)
      }
    },
    [safeDisplayData, setIsLoading, setDataFormatError, setPricingData]
  )

  useEffect(() => {
    if (selectedAccount) {
      loadPricingData(selectedAccount)
    } else {
      setPricingData(null)
    }
  }, [selectedAccount, loadPricingData, setPricingData])

  useEffect(() => {
    if (pricingData && pricingData.group_ratio) {
      const availableGroupsList = Object.keys(pricingData.group_ratio).filter(
        (key) => key !== ""
      )

      if (
        selectedGroup !== "all" &&
        !availableGroupsList.includes(selectedGroup)
      ) {
        if (availableGroupsList.includes("default")) {
          setSelectedGroup("default")
        } else if (availableGroupsList.length > 0) {
          setSelectedGroup(availableGroupsList[0])
        } else {
          setSelectedGroup("all")
        }
      }
    }
  }, [pricingData, selectedGroup, setSelectedGroup])

  return { loadPricingData }
}
