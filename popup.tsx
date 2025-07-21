import "./style.css"
import { useState } from "react"
import { 
  Cog6ToothIcon, 
  ArrowsPointingOutIcon,
  PlusIcon,
  KeyIcon,
  DocumentChartBarIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowsRightLeftIcon
} from "@heroicons/react/24/outline"

function IndexPopup() {
  const [currencyType, setCurrencyType] = useState<'USD' | 'CNY'>('USD')
  const [showTooltip, setShowTooltip] = useState(false)
  
  // 格式化 Token 数量
  const formatTokenCount = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M'
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K'
    }
    return count.toString()
  }
  
  // 模拟数据
  const mockData = {
    totalConsumption: { USD: 23.45, CNY: 167.23 },
    todayTokens: { upload: 125640, download: 89420 },
    todayRequests: 342,
    sites: [
      {
        id: 1,
        icon: "🤖",
        name: "OpenAI API",
        username: "user@email.com", 
        balance: { USD: 12.34, CNY: 88.15 },
        todayConsumption: { USD: 5.67, CNY: 40.45 },
        todayTokens: { upload: 45200, download: 32100 }
      },
      {
        id: 2,
        icon: "🌟",
        name: "Claude API",
        username: "myaccount",
        balance: { USD: 45.67, CNY: 326.12 },
        todayConsumption: { USD: 12.34, CNY: 88.15 },
        todayTokens: { upload: 56300, download: 41200 }
      }
    ]
  }

  const handleOpenTab = () => {
    // TODO: 打开标签页
    console.log('打开完整管理页面')
  }

  return (
    <div className="w-96 bg-white">
      {/* 顶部导航栏 */}
      <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm">
            API
          </div>
          <span className="font-semibold text-gray-900">One API Manager</span>
        </div>
        
        <div className="flex items-center space-x-2">
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

      {/* 基本信息展示 */}
      <div className="px-6 py-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/30">
        <div className="space-y-3">
          {/* 今日消耗标题 */}
          <div>
            <p className="text-sm text-gray-500 mb-2">今日消耗</p>
            
            {/* 主要消耗金额 */}
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold text-gray-900 tracking-tight">
                {currencyType === 'USD' ? '$' : '¥'}{mockData.totalConsumption[currencyType]}
              </span>
              <button 
                onClick={() => setCurrencyType(currencyType === 'USD' ? 'CNY' : 'USD')}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-all duration-200"
                title={`切换到 ${currencyType === 'USD' ? 'CNY' : 'USD'}`}
              >
                <ArrowsRightLeftIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Token 统计信息 */}
          <div className="relative">
            <div className="flex items-center">
              <div 
                className="flex items-center space-x-3 cursor-help"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <div className="flex items-center space-x-1">
                  <ArrowUpIcon className="w-4 h-4 text-green-500" />
                  <span className="font-medium text-gray-500">{formatTokenCount(mockData.todayTokens.upload)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ArrowDownIcon className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-gray-500">{formatTokenCount(mockData.todayTokens.download)}</span>
                </div>
              </div>
            </div>
            
            {/* 自定义 Tooltip */}
            {showTooltip && (
              <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10 whitespace-nowrap">
                上传: {mockData.todayTokens.upload.toLocaleString()} tokens，下载: {mockData.todayTokens.download.toLocaleString()} tokens
                <div className="absolute top-full left-4 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 操作按钮组 */}
      <div className="px-5 py-4 bg-gray-50/50">
        <div className="flex space-x-2">
          <button className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium shadow-sm">
            <PlusIcon className="w-4 h-4" />
            <span>新增站点</span>
          </button>
          <button className="flex items-center justify-center py-2.5 px-3 bg-white text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium border border-gray-200">
            <KeyIcon className="w-4 h-4" />
          </button>
          <button className="flex items-center justify-center py-2.5 px-3 bg-white text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium border border-gray-200">
            <DocumentChartBarIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 站点账号列表 */}
      <div className="max-h-72 overflow-y-auto">
        {mockData.sites.map((site) => (
          <div key={site.id} className="px-5 py-4 border-b border-gray-50 hover:bg-gray-25 transition-colors">
            <div className="flex items-center space-x-4">
              {/* 站点信息 */}
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="text-xl flex-shrink-0">{site.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm truncate mb-0.5">{site.name}</div>
                  <div className="text-xs text-gray-500 truncate">{site.username}</div>
                </div>
              </div>
              
              {/* 余额和统计 */}
              <div className="text-right flex-shrink-0">
                <div className="font-semibold text-gray-900 text-base mb-0.5">
                  {currencyType === 'USD' ? '$' : '¥'}{site.balance[currencyType]}
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  今日 -{currencyType === 'USD' ? '$' : '¥'}{site.todayConsumption[currencyType]}
                </div>
                <div className="flex items-center justify-end space-x-2 text-xs text-gray-400">
                  <div className="flex items-center space-x-1">
                    <ArrowUpIcon className="w-3 h-3 text-green-500" />
                    <span>{formatTokenCount(site.todayTokens.upload)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ArrowDownIcon className="w-3 h-3 text-blue-500" />
                    <span>{formatTokenCount(site.todayTokens.download)}</span>
                  </div>
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
  )
}

export default IndexPopup
