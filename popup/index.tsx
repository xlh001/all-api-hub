import "./style.css"
import { useState, useEffect, useRef } from "react"
import CountUp from "react-countup"
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
import Tooltip from "../components/Tooltip"
import AddAccountDialog from "../components/AddAccountDialog"
import { accountStorage } from "../services/accountStorage"
import type { SiteAccount, AccountStats, DisplaySiteData } from "../types"

type SortField = 'name' | 'balance' | 'consumption'
type SortOrder = 'asc' | 'desc'

function IndexPopup() {
  const [currencyType, setCurrencyType] = useState<'USD' | 'CNY'>('USD')
  const [sortField, setSortField] = useState<SortField>('balance')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false)
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const [, forceUpdate] = useState({}) // 用于强制更新相对时间显示
  
  // 真实数据状态
  const [accounts, setAccounts] = useState<SiteAccount[]>([])
  const [displayData, setDisplayData] = useState<DisplaySiteData[]>([])
  const [stats, setStats] = useState<AccountStats>({
    total_quota: 0,
    today_total_consumption: 0,
    today_total_requests: 0,
    today_total_prompt_tokens: 0,
    today_total_completion_tokens: 0
  })

  // 用于数字滚动动画的 ref 和状态
  const [prevTotalConsumption, setPrevTotalConsumption] = useState({ USD: 0, CNY: 0 })
  const [prevBalances, setPrevBalances] = useState<{ [id: string]: { USD: number, CNY: number } }>({})
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  
  // 初始化dayjs插件
  dayjs.extend(relativeTime)
  dayjs.locale('zh-cn')

  // 加载账号数据
  const loadAccountData = async () => {
    try {
      const allAccounts = await accountStorage.getAllAccounts()
      const accountStats = await accountStorage.getAccountStats()
      const displaySiteData = accountStorage.convertToDisplayData(allAccounts)
      

      // 计算新的余额数据
      const newBalances: { [id: string]: { USD: number, CNY: number } } = {}
      displaySiteData.forEach(site => {
        newBalances[site.id] = {
          USD: site.balance.USD,
          CNY: site.balance.CNY
        }
      })

      // 如果不是初始加载，保存之前的数值供动画使用
      if (!isInitialLoad) {
        setPrevTotalConsumption(prevTotalConsumption)
        setPrevBalances(prevBalances)
      }

      // 更新状态
      setAccounts(allAccounts)
      setStats(accountStats)
      setDisplayData(displaySiteData)
      
      // 更新最后同步时间为最近的一次同步时间
      if (allAccounts.length > 0) {
        const latestSyncTime = Math.max(...allAccounts.map(acc => acc.last_sync_time))
        if (latestSyncTime > 0) {
          setLastUpdateTime(new Date(latestSyncTime))
        }
      }

      // 标记为非初始加载
      if (isInitialLoad) {
        setIsInitialLoad(false)
      }
      
      console.log('账号数据加载完成:', { 
        accountCount: allAccounts.length, 
        stats: accountStats 
      })
    } catch (error) {
      console.error('加载账号数据失败:', error)
    }
  }

  // 组件初始化时加载数据
  useEffect(() => {
    loadAccountData()
  }, [])

  // 监听新账号添加，重新加载数据
  useEffect(() => {
    if (!isAddAccountOpen) {
      loadAccountData() // 当添加账号对话框关闭时重新加载数据
    }
  }, [isAddAccountOpen])

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
    try {
      // 刷新所有账号数据
      const refreshResult = await accountStorage.refreshAllAccounts()
      console.log('刷新结果:', refreshResult)
      
      // 重新加载显示数据
      await loadAccountData()
      setLastUpdateTime(new Date())
      
      // 如果有失败的账号，显示提示
      if (refreshResult.failed > 0) {
        console.warn(`${refreshResult.failed} 个账号刷新失败`)
      }
    } catch (error) {
      console.error('刷新数据失败:', error)
      // 即使刷新失败也尝试加载本地数据
      await loadAccountData()
    }
    setIsRefreshing(false)
  }

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
  const sortedSites = [...displayData].sort((a, b) => {
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

  // 计算总消耗和token数据（从 stats 计算）
  const totalConsumption = {
    USD: parseFloat((stats.today_total_consumption / 500000).toFixed(2)),
    CNY: parseFloat(accounts.reduce((sum, acc) => sum + ((acc.account_info.today_quota_consumption / 500000) * acc.exchange_rate), 0).toFixed(2))
  }

  const todayTokens = {
    upload: stats.today_total_prompt_tokens,
    download: stats.today_total_completion_tokens
  }

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
                  className="text-5xl font-bold text-gray-900 tracking-tight hover:text-blue-600 transition-colors cursor-pointer"
                  title={`点击切换到 ${currencyType === 'USD' ? '人民币' : '美元'}`}
                >
                  {totalConsumption[currencyType] > 0 ? '-' : ''}{currencyType === 'USD' ? '$' : '¥'}
                  <CountUp
                    start={isInitialLoad ? 0 : prevTotalConsumption[currencyType]}
                    end={totalConsumption[currencyType]}
                    duration={isInitialLoad ? 1.5 : 0.8}
                    decimals={2}
                    preserveValue
                  />
                </button>
              </div>
            </div>
            
            {/* Token 统计信息 */}
            <div>
              <Tooltip
                content={
                  <div>
                    <div>提示: {todayTokens.upload.toLocaleString()} tokens</div>
                    <div>补全: {todayTokens.download.toLocaleString()} tokens</div>
                  </div>
                }
              >
                <div className="flex items-center space-x-3 cursor-help">
                  <div className="flex items-center space-x-1">
                    <ArrowUpIcon className="w-4 h-4 text-green-500" />
                    <span className="font-medium text-gray-500">
                      {formatTokenCount(todayTokens.upload)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ArrowDownIcon className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-gray-500">
                      {formatTokenCount(todayTokens.download)}
                    </span>
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
            <button 
              onClick={() => setIsAddAccountOpen(true)}
              className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium shadow-sm"
            >
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
                    {currencyType === 'USD' ? '$' : '¥'}
                    <CountUp
                      start={isInitialLoad ? 0 : (prevBalances[site.id]?.[currencyType] || 0)}
                      end={site.balance[currencyType]}
                      duration={isInitialLoad ? 1.0 : 0.6}
                      decimals={2}
                      preserveValue
                    />
                  </div>
                  <div className={`text-xs ${site.todayConsumption[currencyType] > 0 ? 'text-green-500' : 'text-gray-400'}`}>
                    -{currencyType === 'USD' ? '$' : '¥'}
                    <CountUp
                      start={isInitialLoad ? 0 : 0} // 消耗金额总是从0开始动画
                      end={site.todayConsumption[currencyType]}
                      duration={isInitialLoad ? 1.0 : 0.6}
                      decimals={2}
                      preserveValue
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 空状态 */}
        {accounts.length === 0 && (
          <div className="px-6 py-12 text-center">
            <ChartBarIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 text-sm mb-4">暂无站点数据</p>
            <button 
              onClick={() => setIsAddAccountOpen(true)}
              className="px-6 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm"
            >
              添加第一个站点
            </button>
          </div>
        )}
      </div>

      {/* 新增账号弹窗 */}
      <AddAccountDialog 
        isOpen={isAddAccountOpen}
        onClose={() => setIsAddAccountOpen(false)}
      />
    </div>
  )
}

export default IndexPopup
