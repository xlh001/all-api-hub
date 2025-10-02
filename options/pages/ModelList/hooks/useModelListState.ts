import { useState } from "react"

import type { PricingResponse } from "~/services/apiService"
import type { ProviderType } from "~/utils/modelProviders"

export function useModelListState() {
  // 状态管理
  const [selectedAccount, setSelectedAccount] = useState<string>("") // 当前选中的账号ID
  const [searchTerm, setSearchTerm] = useState("") // 搜索关键词
  const [selectedProvider, setSelectedProvider] = useState<
    ProviderType | "all"
  >("all") // 当前选中的模型提供商
  const [selectedGroup, setSelectedGroup] = useState<string>("default") // 当前选中的用户分组
  const [isLoading, setIsLoading] = useState(false) // 是否正在加载数据

  // 数据状态
  const [pricingData, setPricingData] = useState<PricingResponse | null>(null) // 从API获取的定价数据
  const [dataFormatError, setDataFormatError] = useState<boolean>(false) // 是否发生数据格式错误

  // 显示选项
  const [showRealPrice, setShowRealPrice] = useState(false) // 是否显示真实价格
  const [showRatioColumn, setShowRatioColumn] = useState(true) // 是否显示倍率列
  const [showEndpointTypes, setShowEndpointTypes] = useState(true) // 是否显示端点类型

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
