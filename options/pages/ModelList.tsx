import { useState, useEffect, useMemo, useRef } from "react"
import { 
  CpuChipIcon, 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline"
import { Tab } from '@headlessui/react'
import toast from 'react-hot-toast'
import { useAccountData } from "../../hooks/useAccountData"
import { 
  fetchModelPricing, 
  type ModelPricing, 
  type PricingResponse 
} from "../../services/apiService"
import {
  getAllProviders,
  filterModelsByProvider,
  getProviderConfig,
  type ProviderType 
} from "../../utils/modelProviders"
import { 
  calculateModelPrice,
  type CalculatedPrice 
} from "../../utils/modelPricing"
import ModelItem from "../../components/ModelItem"

export default function ModelList() {
  const { displayData } = useAccountData()
  
  // 状态管理
  const [selectedAccount, setSelectedAccount] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProvider, setSelectedProvider] = useState<ProviderType | 'all'>('all')
  const [selectedGroup, setSelectedGroup] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(false)
  
  // 数据状态
  const [pricingData, setPricingData] = useState<PricingResponse | null>(null)
  
  // 显示选项
  const [showRealPrice, setShowRealPrice] = useState(false)
  const [showRatioColumn, setShowRatioColumn] = useState(false)
  const [showEndpointTypes, setShowEndpointTypes] = useState(false)
  
  // 安全获取账号数据
  const safeDisplayData = displayData || []
  
  // 获取当前选中的账号信息
  const currentAccount = safeDisplayData.find(acc => acc.id === selectedAccount)
  
  // 获取厂商列表
  const providers = getAllProviders()
  
  // Tab滚动相关
  const tabListRef = useRef<HTMLDivElement>(null)
  
  // 自动滚动到选中的Tab
  const scrollToSelectedTab = (selectedIndex: number) => {
    if (!tabListRef.current) return
    
    const tabList = tabListRef.current
    const tabs = tabList.children
    
    if (selectedIndex >= 0 && selectedIndex < tabs.length) {
      const selectedTab = tabs[selectedIndex] as HTMLElement
      const tabListRect = tabList.getBoundingClientRect()
      const selectedTabRect = selectedTab.getBoundingClientRect()
      
      // 计算当前tab相对于容器的位置
      const tabLeft = selectedTabRect.left - tabListRect.left + tabList.scrollLeft
      const tabRight = tabLeft + selectedTabRect.width
      
      // 计算理想的滚动位置（让选中的tab居中显示）
      const containerWidth = tabList.clientWidth
      const idealScrollLeft = tabLeft - (containerWidth / 2) + (selectedTabRect.width / 2)
      
      // 平滑滚动到目标位置
      tabList.scrollTo({
        left: Math.max(0, idealScrollLeft),
        behavior: 'smooth'
      })
    }
  }
  
  // 当选中的厂商改变时，自动滚动到对应位置
  useEffect(() => {
    const selectedIndex = selectedProvider === 'all' ? 0 : Math.max(0, providers.indexOf(selectedProvider as ProviderType) + 1)
    setTimeout(() => scrollToSelectedTab(selectedIndex), 100)
  }, [selectedProvider, providers])
  
  // 加载模型定价数据
  const loadPricingData = async (accountId: string) => {
    const account = safeDisplayData.find(acc => acc.id === accountId)
    if (!account) return
    
    setIsLoading(true)
    try {
      const data = await fetchModelPricing(account.baseUrl, account.userId, account.token)
      console.log('API 响应数据:', data)
      console.log('模型数据:', data.data)
      console.log('分组比率:', data.group_ratio)
      console.log('可用分组:', data.usable_group)
      setPricingData(data)
      toast.success('模型数据加载成功')
    } catch (error) {
      console.error('加载模型数据失败:', error)
      toast.error('加载模型数据失败，请稍后重试')
      setPricingData(null)
    } finally {
      setIsLoading(false)
    }
  }
  
  // 账号变化时重新加载数据
  useEffect(() => {
    if (selectedAccount) {
      loadPricingData(selectedAccount)
    } else {
      setPricingData(null)
    }
  }, [selectedAccount, safeDisplayData])
  
  // 计算模型价格
  const modelsWithPricing = useMemo(() => {
    console.log('计算模型价格 - pricingData:', pricingData)
    console.log('计算模型价格 - currentAccount:', currentAccount)
    
    if (!pricingData || !pricingData.data || !currentAccount) {
      console.log('缺少必要数据，返回空数组')
      return []
    }
    
    console.log('开始处理模型数据，模型数量:', pricingData.data.length)
    
    return pricingData.data.map(model => {
      // 安全的汇率计算
      const exchangeRate = currentAccount?.balance?.USD > 0 
        ? currentAccount.balance.CNY / currentAccount.balance.USD 
        : 7 // 默认汇率
        
      const calculatedPrice = calculateModelPrice(
        model,
        pricingData.group_ratio || {},
        exchangeRate,
        'default' // 用户分组，这里暂时用默认值
      )
      
      return {
        model,
        calculatedPrice
      }
    })
  }, [pricingData, currentAccount])
  
  // 过滤和搜索模型
  const filteredModels = useMemo(() => {
    console.log('过滤模型 - modelsWithPricing:', modelsWithPricing)
    let filtered = modelsWithPricing
    
    // 按厂商过滤
    if (selectedProvider !== 'all') {
      console.log('按厂商过滤:', selectedProvider)
      filtered = filtered.filter(item => 
        filterModelsByProvider([item.model], selectedProvider).length > 0
      )
      console.log('厂商过滤后:', filtered.length)
    }
    
    // 按分组过滤
    if (selectedGroup !== 'all') {
      console.log('按分组过滤:', selectedGroup)
      filtered = filtered.filter(item => 
        item.model.enable_groups.includes(selectedGroup)
      )
      console.log('分组过滤后:', filtered.length)
    }
    
    // 搜索过滤
    if (searchTerm) {
      console.log('搜索过滤:', searchTerm)
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(item => 
        item.model.model_name.toLowerCase().includes(searchLower) ||
        (item.model.model_description?.toLowerCase().includes(searchLower) || false)
      )
      console.log('搜索过滤后:', filtered.length)
    }
    
    console.log('最终过滤结果:', filtered)
    return filtered
  }, [modelsWithPricing, selectedProvider, selectedGroup, searchTerm])
  
  // 获取可用分组列表
  const availableGroups = useMemo(() => {
    console.log('处理可用分组 - pricingData:', pricingData)
    if (!pricingData || !pricingData.usable_group) {
      console.log('没有分组数据，返回空数组')
      return []
    }
    // 过滤掉空键和"用户分组"这样的描述性键
    const groups = Object.keys(pricingData.usable_group).filter(key => 
      key !== '' && key !== '用户分组'
    )
    console.log('原始分组数据:', pricingData.usable_group)
    console.log('处理后的分组列表:', groups)
    return groups
  }, [pricingData])

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <CpuChipIcon className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-semibold text-gray-900">模型列表</h1>
        </div>
        <p className="text-gray-500">查看和管理可用的AI模型</p>
      </div>

      {/* 账号选择 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          选择账号
        </label>
        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="w-full sm:w-80 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">请选择账号</option>
          {safeDisplayData.map(account => (
            <option key={account.id} value={account.id}>{account.name}</option>
          ))}
        </select>
      </div>

      {/* 如果没有选择账号，显示提示 */}
      {!selectedAccount && (
        <div className="text-center py-12">
          <CpuChipIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">请先选择一个账号查看模型列表</p>
        </div>
      )}

      {/* 加载状态 */}
      {selectedAccount && isLoading && (
        <div className="text-center py-12">
          <ArrowPathIcon className="w-8 h-8 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-500">正在加载模型数据...</p>
        </div>
      )}

      {/* 模型数据展示 */}
      {selectedAccount && !isLoading && pricingData && (
        <>
          {/* 控制面板 */}
          <div className="mb-6 space-y-4">
            {/* 搜索和过滤 */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* 搜索框 */}
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索模型名称或描述..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* 分组筛选 */}
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">所有分组</option>
                {availableGroups.map(group => (
                  <option key={group} value={group}>
                    {pricingData?.usable_group?.[group] || group}
                  </option>
                ))}
              </select>

              {/* 刷新按钮 */}
              <button
                onClick={() => loadPricingData(selectedAccount)}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
              >
                <ArrowPathIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>刷新</span>
              </button>
            </div>

            {/* 显示选项 */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <AdjustmentsHorizontalIcon className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700 font-medium">显示选项:</span>
              </div>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showRealPrice}
                  onChange={(e) => setShowRealPrice(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>以真实充值金额显示</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showRatioColumn}
                  onChange={(e) => setShowRatioColumn(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>显示倍率列</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showEndpointTypes}
                  onChange={(e) => setShowEndpointTypes(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>显示端点类型</span>
              </label>
            </div>

            {/* 统计信息 */}
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <span>总计 {pricingData?.data?.length || 0} 个模型</span>
              <span>显示 {filteredModels.length} 个</span>
            </div>
          </div>

          {/* 厂商 Tabs */}
          <Tab.Group 
            selectedIndex={(() => {
              const index = selectedProvider === 'all' ? 0 : Math.max(0, providers.indexOf(selectedProvider as ProviderType) + 1)
              console.log('当前 selectedProvider:', selectedProvider, '计算的索引:', index)
              return index
            })()}
            onChange={(index) => {
              console.log('Tab 切换到索引:', index)
              if (index === 0) {
                console.log('切换到所有厂商')
                setSelectedProvider('all')
              } else {
                const provider = providers[index - 1]
                console.log('切换到厂商:', provider)
                if (provider) {
                  setSelectedProvider(provider)
                }
              }
              // 滚动到选中的tab
              setTimeout(() => scrollToSelectedTab(index), 50)
            }}
          >
            <Tab.List 
              ref={tabListRef}
              className="flex space-x-1 rounded-xl bg-gray-100 p-1 mb-6 overflow-x-auto overflow-y-hidden scrollbar-hide touch-pan-x"
            >
              <Tab
                className={({ selected }) =>
                  `flex-shrink-0 rounded-lg py-2.5 px-4 text-sm font-medium leading-5 transition-all ${
                    selected
                      ? 'bg-white text-blue-700 shadow'
                      : 'text-gray-700 hover:bg-white/60 hover:text-gray-900'
                  }`
                }
              >
                <div className="flex items-center justify-center space-x-2">
                  <CpuChipIcon className="w-4 h-4" />
                  <span>所有厂商 ({modelsWithPricing.length})</span>
                </div>
              </Tab>
              {providers.map((provider) => {
                // 直接使用 PROVIDER_CONFIGS 获取配置
                const providerConfig = getProviderConfig(
                  provider === 'OpenAI' ? 'gpt-4' :
                  provider === 'Claude' ? 'claude-3' :
                  provider === 'Gemini' ? 'gemini-pro' :
                  provider === 'Grok' ? 'grok' :
                  provider === 'Qwen' ? 'qwen' :
                  provider === 'DeepSeek' ? 'deepseek' :
                  'unknown'
                )
                const IconComponent = providerConfig.icon
                return (
                  <Tab
                    key={provider}
                    className={({ selected }) =>
                      `flex-shrink-0 rounded-lg py-2.5 px-4 text-sm font-medium leading-5 transition-all ${
                        selected
                          ? 'bg-white text-blue-700 shadow'
                          : 'text-gray-700 hover:bg-white/60 hover:text-gray-900'
                      }`
                    }
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <IconComponent className="w-4 h-4" />
                      <span>{provider} ({pricingData?.data ? filterModelsByProvider(pricingData.data, provider).length : 0})</span>
                    </div>
                  </Tab>
                )
              })}
            </Tab.List>

            <Tab.Panels>
              {/* 所有厂商的面板 */}
              <Tab.Panel>
                <div className="space-y-3">
                  {filteredModels.length === 0 ? (
                    <div className="text-center py-12">
                      <CpuChipIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">没有找到匹配的模型</p>
                    </div>
                  ) : (
                    filteredModels.map((item, index) => (
                      <ModelItem
                        key={`${item.model.model_name}-${index}`}
                        model={item.model}
                        calculatedPrice={item.calculatedPrice}
                        exchangeRate={currentAccount?.balance?.USD > 0 ? currentAccount.balance.CNY / currentAccount.balance.USD : 7}
                        showRealPrice={showRealPrice}
                        showRatioColumn={showRatioColumn}
                        showEndpointTypes={showEndpointTypes}
                        userGroup="default"
                      />
                    ))
                  )}
                </div>
              </Tab.Panel>
              
              {/* 为每个厂商创建对应的面板 */}
              {providers.map((provider) => (
                <Tab.Panel key={provider}>
                  <div className="space-y-3">
                    {filteredModels.length === 0 ? (
                      <div className="text-center py-12">
                        <CpuChipIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">没有找到匹配的模型</p>
                      </div>
                    ) : (
                      filteredModels.map((item, index) => (
                        <ModelItem
                          key={`${item.model.model_name}-${index}`}
                          model={item.model}
                          calculatedPrice={item.calculatedPrice}
                          exchangeRate={currentAccount?.balance?.USD > 0 ? currentAccount.balance.CNY / currentAccount.balance.USD : 7}
                          showRealPrice={showRealPrice}
                          showRatioColumn={showRatioColumn}
                          showEndpointTypes={showEndpointTypes}
                          userGroup="default"
                        />
                      ))
                    )}
                  </div>
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </>
      )}

      {/* 说明文字 */}
      {selectedAccount && pricingData && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <CpuChipIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-blue-800 font-medium mb-1">模型定价说明</p>
              <p className="text-blue-700">
                价格信息来源于站点提供的 API 接口，实际费用以各站点公布的价格为准。
                按量计费模型的价格为每 1M tokens 的费用，按次计费模型显示每次调用的费用。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}