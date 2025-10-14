import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"

import { fetchModelPricing } from "~/services/apiService"
import type { PricingResponse } from "~/services/apiService/common/type"
import type { DisplaySiteData } from "~/types"

interface UseModelDataProps {
  selectedAccount: string
  accounts: DisplaySiteData[] // ✅ Pass data instead of setState
  selectedGroup: string
}

interface UseModelDataReturn {
  pricingData: PricingResponse | null
  isLoading: boolean
  dataFormatError: boolean
  loadPricingData: (accountId: string) => Promise<void>
}

export function useModelData({
  selectedAccount,
  accounts
}: UseModelDataProps): UseModelDataReturn {
  const [pricingData, setPricingData] = useState<PricingResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [dataFormatError, setDataFormatError] = useState(false)

  const safeDisplayData = accounts || []

  const loadPricingData = useCallback(
    async (accountId: string) => {
      const account = safeDisplayData.find((acc) => acc.id === accountId)
      if (!account) return

      setIsLoading(true)
      setDataFormatError(false)
      try {
        const data = await fetchModelPricing(account)

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
    [safeDisplayData]
  )

  useEffect(() => {
    if (selectedAccount) {
      loadPricingData(selectedAccount)
    } else {
      setPricingData(null)
    }
  }, [selectedAccount, loadPricingData])

  return {
    pricingData,
    isLoading,
    dataFormatError,
    loadPricingData
  }
}
