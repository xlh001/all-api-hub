import { ChevronUpIcon, ChevronDownIcon, ChartBarIcon, PlusIcon } from "@heroicons/react/24/outline"
import CountUp from "react-countup"
import { UI_CONSTANTS, HEALTH_STATUS_MAP } from "../constants/ui"
import { getCurrencySymbol } from "../utils/formatters"
import type { DisplaySiteData } from "../types"

type SortField = 'name' | 'balance' | 'consumption'
type SortOrder = 'asc' | 'desc'

interface AccountListProps {
  // 数据
  sites: DisplaySiteData[]
  currencyType: 'USD' | 'CNY'
  
  // 排序状态
  sortField: SortField
  sortOrder: SortOrder
  
  // 动画相关
  isInitialLoad: boolean
  prevBalances: { [id: string]: { USD: number, CNY: number } }
  
  // 事件处理
  onSort: (field: SortField) => void
  onAddAccount: () => void
}

export default function AccountList({
  sites,
  currencyType,
  sortField,
  sortOrder,
  isInitialLoad,
  prevBalances,
  onSort,
  onAddAccount
}: AccountListProps) {
  if (sites.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <ChartBarIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <p className="text-gray-500 text-sm mb-4">暂无站点数据</p>
        <button 
          onClick={onAddAccount}
          className="px-6 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm"
        >
          添加第一个站点
        </button>
      </div>
    )
  }

  const renderSortButton = (field: SortField, label: string) => (
    <button
      onClick={() => onSort(field)}
      className="flex items-center space-x-1 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
    >
      <span>{label}</span>
      {sortField === field && (
        sortOrder === 'asc' ? 
          <ChevronUpIcon className="w-3 h-3" /> : 
          <ChevronDownIcon className="w-3 h-3" />
      )}
    </button>
  )

  return (
    <div className="flex flex-col">
      {/* 表头 */}
      <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            {renderSortButton('name', '账号')}
          </div>
          <div className="text-right flex-shrink-0">
            <div className="flex items-center space-x-1">
              {renderSortButton('balance', '余额')}
              <span className="text-xs text-gray-400">/</span>
              {renderSortButton('consumption', '今日消耗')}
            </div>
          </div>
        </div>
      </div>
      
      {/* 账号列表 */}
      {sites.map((site) => (
        <div key={site.id} className="px-5 py-4 border-b border-gray-50 hover:bg-gray-25 transition-colors">
          <div className="flex items-center space-x-4">
            {/* 站点信息 */}
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-0.5">
                  {/* 站点状态指示器 */}
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    HEALTH_STATUS_MAP[site.healthStatus]?.color || UI_CONSTANTS.STYLES.STATUS_INDICATOR.UNKNOWN
                  }`}></div>
                  <div className="font-medium text-gray-900 text-sm truncate">{site.name}</div>
                </div>
                <div className="text-xs text-gray-500 truncate ml-4">{site.username}</div>
              </div>
            </div>
            
            {/* 余额和统计 */}
            <div className="text-right flex-shrink-0">
              <div className="font-semibold text-gray-900 text-lg mb-0.5">
                {getCurrencySymbol(currencyType)}
                <CountUp
                  start={isInitialLoad ? 0 : (prevBalances[site.id]?.[currencyType] || 0)}
                  end={site.balance[currencyType]}
                  duration={isInitialLoad ? UI_CONSTANTS.ANIMATION.SLOW_DURATION : UI_CONSTANTS.ANIMATION.FAST_DURATION}
                  decimals={2}
                  preserveValue
                />
              </div>
              <div className={`text-xs ${site.todayConsumption[currencyType] > 0 ? 'text-green-500' : 'text-gray-400'}`}>
                -{getCurrencySymbol(currencyType)}
                <CountUp
                  start={isInitialLoad ? 0 : 0}
                  end={site.todayConsumption[currencyType]}
                  duration={isInitialLoad ? UI_CONSTANTS.ANIMATION.SLOW_DURATION : UI_CONSTANTS.ANIMATION.FAST_DURATION}
                  decimals={2}
                  preserveValue
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}