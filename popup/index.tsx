import "./style.css"
import { useState, useEffect } from "react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import "dayjs/locale/zh-cn"
import { 
  Cog6ToothIcon, 
  ArrowsPointingOutIcon,
  PlusIcon,
  UserIcon,
  DocumentChartBarIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline"
import Tooltip from "components/Tooltip"
import { mockSiteAccounts, convertToLegacyFormat } from "data/mockData"

type SortField = 'name' | 'balance' | 'consumption'
type SortOrder = 'asc' | 'desc'

function IndexPopup() {
  const [currencyType, setCurrencyType] = useState<'USD' | 'CNY'>('USD')
  const [sortField, setSortField] = useState<SortField>('balance')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  // 暂时设定为固定时间
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(
    new Date('2025-07-12 12:12:12')
  )
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const [, forceUpdate] = useState({}) // 用于强制更新相对时间显示
  
  // 初始化dayjs插件
  dayjs.extend(relativeTime)
  dayjs.locale('zh-cn')

  // 定时更新相对时间显示
  useEffect(() => {
    const updateInterval = setInterval(() => {
      forceUpdate({}) // 触发重新渲染来更新相对时间
    }, 30000) // 每30秒更新一次，类似微信的更新频率

    return () => clearInterval(updateInterval)
  }, [])
  
  // 格式化 Token 数量
  const formatTokenCount = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M'
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K'
    }
    return count.toString()
  }

  // 格式化相对时间
  const formatRelativeTime = (date: Date): string => {
    const now = dayjs()
    const targetTime = dayjs(date)
    const diffInSeconds = now.diff(targetTime, 'second')
    
    if (diffInSeconds < 5) {
      return '刚刚'
    }
    return targetTime.fromNow()
  }

  // 格式化具体时间
  const formatFullTime = (date: Date): string => {
    return dayjs(date).format('YYYY/MM/DD HH:mm:ss')
  }

  // 刷新数据
  const handleRefresh = async () => {
    setIsRefreshing(true)
    // TODO: 调用实际的数据刷新API
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟API调用
    setLastUpdateTime(new Date())
    setIsRefreshing(false)
  }
  
  // 使用新的模拟数据
  const mockData = convertToLegacyFormat(mockSiteAccounts)

  // 处理排序
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  // 排序站点数据
  const sortedSites = [...mockData.sites].sort((a, b) => {
    let aValue: string | number, bValue: string | number
    
    switch (sortField) {
      case 'name':
        aValue = a.name
        bValue = b.name
        break
      case 'balance':
        aValue = a.balance[currencyType]
        bValue = b.balance[currencyType]
        break
      case 'consumption':
        aValue = a.todayConsumption[currencyType]
        bValue = b.todayConsumption[currencyType]
        break
      default:
        return 0
    }
    
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  const handleOpenTab = () => {
    // TODO: 打开标签页
    console.log('打开完整管理页面')
  }

  return (
    <div className="w-96 bg-white flex flex-col h-[600px]">
      {/* 顶部导航栏 */}
      <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm">
            API
          </div>
          <span className="font-semibold text-gray-900">One API Manager</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Tooltip content="刷新数据">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200 ${isRefreshing ? 'animate-spin' : ''}`}
              title="刷新数据"
            >
              <ArrowPathIcon className="w-4 h-4" />
            </button>
          </Tooltip>
          <button
            onClick={handleOpenTab}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
            title="打开完整管理页面"
          >
            <ArrowsPointingOutIcon className="w-4 h-4" />
          </button>
          <button
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
            title="设置"
          >
            <Cog6ToothIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 滚动内容区域 */}
      <div className="flex-1 overflow-y-auto">
        {/* 基本信息展示 */}
        <div className="px-6 py-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/30">
          <div className="space-y-3">
            {/* 今日消耗标题 */}
            <div>
              <p className="text-sm text-gray-500 mb-2">今日消耗</p>
              
              {/* 主要消耗金额 */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setCurrencyType(currencyType === 'USD' ? 'CNY' : 'USD')}
                  className="text-3xl font-bold text-gray-900 tracking-tight hover:text-blue-600 transition-colors cursor-pointer"
                  title={`点击切换到 ${currencyType === 'USD' ? '人民币' : '美元'}`}
                >
                  {mockData.totalConsumption[currencyType] > 0 ? '-' : ''}{currencyType === 'USD' ? '$' : '¥'}{mockData.totalConsumption[currencyType].toFixed(2)}
                </button>
              </div>
            </div>
            
            {/* Token 统计信息 */}
            <div>
              <Tooltip
                content={
                  <div>
                    <div>提示: {mockData.todayTokens.upload.toLocaleString()} tokens</div>
                    <div>补全: {mockData.todayTokens.download.toLocaleString()} tokens</div>
                  </div>
                }
              >
                <div className="flex items-center space-x-3 cursor-help">
                  <div className="flex items-center space-x-1">
                    <ArrowUpIcon className="w-4 h-4 text-green-500" />
                    <span className="font-medium text-gray-500">{formatTokenCount(mockData.todayTokens.upload)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ArrowDownIcon className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-gray-500">{formatTokenCount(mockData.todayTokens.download)}</span>
                  </div>
                </div>
              </Tooltip>
            </div>
          </div>
          
          {/* 最后更新时间 */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="ml-2">
              <Tooltip content={formatFullTime(lastUpdateTime)}>
                <p className="text-xs text-gray-400 cursor-help">
                  更新于 {formatRelativeTime(lastUpdateTime)}
                </p>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* 操作按钮组 */}
        <div className="px-5 py-4 bg-gray-50/50">
          <div className="flex space-x-2">
            <button className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium shadow-sm">
              <PlusIcon className="w-4 h-4" />
              <span>新增账号</span>
            </button>
            <Tooltip content="账号管理">
              <button className="flex items-center justify-center py-2.5 px-3 bg-white text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium border border-gray-200">
                <UserIcon className="w-4 h-4" />
              </button>
            </Tooltip>
            <Tooltip content="用量统计">
              <button className="flex items-center justify-center py-2.5 px-3 bg-white text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium border border-gray-200">
                <DocumentChartBarIcon className="w-4 h-4" />
              </button>
            </Tooltip>
          </div>
        </div>

        {/* 站点账号列表 */}
        <div className="flex flex-col">
          {/* 表头 */}
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <span>账号</span>
                  {sortField === 'name' && (
                    sortOrder === 'asc' ? 
                      <ChevronUpIcon className="w-3 h-3" /> : 
                      <ChevronDownIcon className="w-3 h-3" />
                  )}
                </button>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleSort('balance')}
                    className="flex items-center space-x-1 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <span>余额</span>
                    {sortField === 'balance' && (
                      sortOrder === 'asc' ? 
                        <ChevronUpIcon className="w-3 h-3" /> : 
                        <ChevronDownIcon className="w-3 h-3" />
                    )}
                  </button>
                  <span className="text-xs text-gray-400">/</span>
                  <button
                    onClick={() => handleSort('consumption')}
                    className="flex items-center space-x-1 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <span>今日消耗</span>
                    {sortField === 'consumption' && (
                      sortOrder === 'asc' ? 
                        <ChevronUpIcon className="w-3 h-3" /> : 
                        <ChevronDownIcon className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {sortedSites.map((site) => (
            <div key={site.id} className="px-5 py-4 border-b border-gray-50 hover:bg-gray-25 transition-colors">
              <div className="flex items-center space-x-4">
                {/* 站点信息 */}
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="text-xl flex-shrink-0">{site.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-0.5">
                      {/* 站点状态指示器 */}
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        site.healthStatus === 'healthy' ? 'bg-green-500' :
                        site.healthStatus === 'error' ? 'bg-red-500' :
                        site.healthStatus === 'warning' ? 'bg-yellow-500' :
                        'bg-gray-400'
                      }`}></div>
                      <div className="font-medium text-gray-900 text-sm truncate">{site.name}</div>
                    </div>
                    <div className="text-xs text-gray-500 truncate ml-4">{site.username}</div>
                  </div>
                </div>
                
                {/* 余额和统计 */}
                <div className="text-right flex-shrink-0">
                  <div className="font-semibold text-gray-900 text-lg mb-0.5">
                    {currencyType === 'USD' ? '$' : '¥'}{site.balance[currencyType].toFixed(2)}
                  </div>
                  <div className={`text-xs ${site.todayConsumption[currencyType] > 0 ? 'text-green-500' : 'text-gray-400'}`}>
                    -{currencyType === 'USD' ? '$' : '¥'}{site.todayConsumption[currencyType].toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 空状态 */}
        {mockData.sites.length === 0 && (
          <div className="px-6 py-12 text-center">
            <ChartBarIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 text-sm mb-4">暂无站点数据</p>
            <button className="px-6 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm">
              添加第一个站点
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default IndexPopup
