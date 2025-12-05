import { useQueries, useQuery } from "@tanstack/react-query"
import { useCallback, useMemo, useState } from "react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

import { fetchModelPricing } from "~/services/apiService"
import type { PricingResponse } from "~/services/apiService/common/type"
import type { DisplaySiteData } from "~/types"

type SelectedAccountValue = string | "all"

interface UseModelDataProps {
  selectedAccount: SelectedAccountValue
  accounts: DisplaySiteData[]
  selectedGroup: string
}

export interface AccountPricingContext {
  account: DisplaySiteData
  pricing: PricingResponse
}

interface UseModelDataReturn {
  pricingData: PricingResponse | null
  pricingContexts: AccountPricingContext[]
  isLoading: boolean
  dataFormatError: boolean
  loadPricingData: (accountId: string) => Promise<void>
}

function useSingleAccountModelData({
  selectedAccount,
  accounts,
}: {
  selectedAccount: string
  accounts: DisplaySiteData[]
}): UseModelDataReturn {
  const { t } = useTranslation("modelList")
  const [dataFormatError, setDataFormatError] = useState(false)

  const safeDisplayData = useMemo(() => accounts || [], [accounts])

  const currentAccount = useMemo(
    () => safeDisplayData.find((acc) => acc.id === selectedAccount),
    [safeDisplayData, selectedAccount],
  )

  const queryKey = useMemo(
    () =>
      currentAccount
        ? [
            "model-pricing",
            currentAccount.id,
            currentAccount.baseUrl,
            currentAccount.userId,
          ]
        : ["model-pricing", "none"],
    [currentAccount],
  )

  const query = useQuery<PricingResponse, Error>({
    queryKey,
    enabled: !!currentAccount,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
    queryFn: async () => {
      if (!currentAccount) {
        throw new Error("No account selected")
      }

      const data = await fetchModelPricing(currentAccount)

      if (!Array.isArray(data.data)) {
        const error = new Error("INVALID_FORMAT")
        ;(error as { code?: string }).code = "INVALID_FORMAT"
        throw error
      }

      return data
    },
    onSuccess: () => {
      setDataFormatError(false)
      toast.success(t("status.dataLoaded"))
    },
    onError: (error) => {
      const typedError = error as { code?: string }

      if (typedError.code === "INVALID_FORMAT") {
        setDataFormatError(true)
        toast.error(t("status.formatNotStandard"))
        return
      }

      setDataFormatError(false)
      toast.error(t("status.loadFailed"))
    },
  })

  const loadPricingData = useCallback(
    async (_accountId: string) => {
      if (!currentAccount) return
      await query.refetch()
    },
    [currentAccount, query],
  )

  const pricingContexts: AccountPricingContext[] = useMemo(
    () =>
      currentAccount && query.data
        ? [{ account: currentAccount, pricing: query.data }]
        : [],
    [currentAccount, query.data],
  )

  return {
    pricingData: query.data ?? null,
    pricingContexts,
    isLoading: query.isFetching,
    dataFormatError,
    loadPricingData,
  }
}

function useAllAccountsModelData(
  accounts: DisplaySiteData[],
): UseModelDataReturn {
  const safeDisplayData = useMemo(() => accounts || [], [accounts])

  const queries = useQueries({
    queries: safeDisplayData.map((account) => ({
      queryKey: ["model-pricing", account.id, account.baseUrl, account.userId],
      enabled: safeDisplayData.length > 0,
      staleTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
      queryFn: async () => {
        const data = await fetchModelPricing(account)

        if (!Array.isArray(data.data)) {
          const error = new Error("INVALID_FORMAT")
          ;(error as { code?: string }).code = "INVALID_FORMAT"
          throw error
        }

        return data
      },
    })),
  })

  const pricingContexts: AccountPricingContext[] = useMemo(() => {
    return safeDisplayData
      .map((account, index) => {
        const query = queries[index]
        if (!query || !query.data) return null
        return {
          account,
          pricing: query.data,
        }
      })
      .filter((item): item is AccountPricingContext => item !== null)
  }, [queries, safeDisplayData])

  const isLoading = queries.some((query) => query.isFetching)

  const dataFormatError = queries.some((query) => {
    const error = query.error as { code?: string } | null | undefined
    return error?.code === "INVALID_FORMAT"
  })

  const loadPricingData = useCallback(async () => {
    await Promise.all(queries.map((query) => query.refetch()))
  }, [queries])

  return {
    pricingData: null,
    pricingContexts,
    isLoading,
    dataFormatError,
    loadPricingData,
  }
}

export function useModelData({
  selectedAccount,
  accounts,
}: UseModelDataProps): UseModelDataReturn {
  const safeDisplayData = useMemo(() => accounts || [], [accounts])
  const isAllAccounts = selectedAccount === "all"

  const singleAccountResult = useSingleAccountModelData({
    selectedAccount: isAllAccounts ? "" : selectedAccount,
    accounts: safeDisplayData,
  })

  const allAccountsResult = useAllAccountsModelData(safeDisplayData)

  return isAllAccounts ? allAccountsResult : singleAccountResult
}
