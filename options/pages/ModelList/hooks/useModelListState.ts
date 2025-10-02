import { useState } from "react"
import type { ProviderType } from "~/utils/modelProviders"
import type { PricingResponse } from "~/services/apiService"

export function useModelListState() {
  const [selectedAccount, setSelectedAccount] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProvider, setSelectedProvider] = useState<
    ProviderType | "all"
  >("all")
  const [selectedGroup, setSelectedGroup] = useState<string>("default")
  const [isLoading, setIsLoading] = useState(false)
  const [pricingData, setPricingData] = useState<PricingResponse | null>(null)
  const [dataFormatError, setDataFormatError] = useState<boolean>(false)
  const [showRealPrice, setShowRealPrice] = useState(false)
  const [showRatioColumn, setShowRatioColumn] = useState(false)
  const [showEndpointTypes, setShowEndpointTypes] = useState(false)

  return {
    selectedAccount,
    setSelectedAccount,
    searchTerm,
    setSearchTerm,
    selectedProvider,
    setSelectedProvider,
    selectedGroup,
    setSelectedGroup,
    isLoading,
    setIsLoading,
    pricingData,
    setPricingData,
    dataFormatError,
    setDataFormatError,
    showRealPrice,
    setShowRealPrice,
    showRatioColumn,
    setShowRatioColumn,
    showEndpointTypes,
    setShowEndpointTypes
  }
}