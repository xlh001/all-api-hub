import {
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  ClipboardDocumentListIcon,
  CpuChipIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline"
import toast from "react-hot-toast"

import { UI_CONSTANTS } from "~/constants/ui"

interface ControlPanelProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedGroup: string
  setSelectedGroup: (group: string) => void
  availableGroups: string[]
  pricingData: any
  loadPricingData: () => void
  isLoading: boolean
  showRealPrice: boolean
  setShowRealPrice: (show: boolean) => void
  showRatioColumn: boolean
  setShowRatioColumn: (show: boolean) => void
  showEndpointTypes: boolean
  setShowEndpointTypes: (show: boolean) => void
  totalModels: number
  filteredModels: any[]
}

export function ControlPanel({
  searchTerm,
  setSearchTerm,
  selectedGroup,
  setSelectedGroup,
  availableGroups,
  pricingData,
  loadPricingData,
  isLoading,
  showRealPrice,
  setShowRealPrice,
  showRatioColumn,
  setShowRatioColumn,
  showEndpointTypes,
  setShowEndpointTypes,
  totalModels,
  filteredModels
}: ControlPanelProps) {
  const handleCopyModelNames = () => {
    if (filteredModels.length === 0) {
      toast.error("没有可复制的模型")
      return
    }
    const modelNames = filteredModels
      .map((item) => item.model.model_name)
      .join(",")
    navigator.clipboard.writeText(modelNames)
    toast.success("模型名称已复制到剪贴板")
  }

  return (
    <div className="mb-6 bg-white dark:bg-dark-bg-secondary border border-gray-200 dark:border-dark-bg-tertiary rounded-lg p-4 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-2">
            搜索模型
          </label>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-dark-text-tertiary" />
            <input
              type="text"
              placeholder="输入模型名称或描述..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={UI_CONSTANTS.STYLES.INPUT.SEARCH}
            />
          </div>
        </div>

        <div className="w-full lg:w-64">
          <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-2">
            用户分组
          </label>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="w-full px-3 py-2.5 border dark:bg-dark-bg-secondary dark:border-dark-bg-tertiary dark:text-dark-text-primary border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="all">所有分组</option>
            {availableGroups.map((group) => (
              <option key={group} value={group}>
                {group} ({pricingData?.group_ratio?.[group] || 1}x)
              </option>
            ))}
          </select>
        </div>

        <div className="w-full lg:w-auto lg:flex lg:items-end">
          <button
            onClick={loadPricingData}
            disabled={isLoading}
            className="w-full lg:w-auto leading-6 px-3 py-2.5 border border-transparent bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2 text-sm font-medium  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg-primary">
            <ArrowPathIcon
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>刷新数据</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-4 border-t border-gray-100 dark:border-dark-bg-tertiary">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <AdjustmentsHorizontalIcon className="w-4 h-4 text-gray-400 dark:text-dark-text-tertiary" />
            <span className="text-gray-700 dark:text-dark-text-secondary font-medium">
              显示选项:
            </span>
          </div>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showRealPrice}
              onChange={(e) => setShowRealPrice(e.target.checked)}
              className={UI_CONSTANTS.STYLES.INPUT.CHECKBOX}
            />
            <span className="text-gray-700 dark:text-dark-text-primary">
              真实充值金额
            </span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showRatioColumn}
              onChange={(e) => setShowRatioColumn(e.target.checked)}
              className={UI_CONSTANTS.STYLES.INPUT.CHECKBOX}
            />
            <span className="text-gray-700 dark:text-dark-text-primary">
              显示倍率
            </span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showEndpointTypes}
              onChange={(e) => setShowEndpointTypes(e.target.checked)}
              className={UI_CONSTANTS.STYLES.INPUT.CHECKBOX}
            />
            <span className="text-gray-700 dark:text-dark-text-primary">
              端点类型
            </span>
          </label>

          <button
            onClick={handleCopyModelNames}
            className={UI_CONSTANTS.STYLES.BUTTON.COPY}>
            <ClipboardDocumentListIcon className="w-4 h-4" />
            <span>复制所有模型名称</span>
          </button>
        </div>

        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-dark-text-secondary">
            <CpuChipIcon className="w-4 h-4 text-gray-600 dark:text-dark-text-secondary" />
            <span>
              总计{" "}
              <span className="font-medium text-gray-900 dark:text-dark-text-primary">
                {totalModels}
              </span>{" "}
              个模型
            </span>
          </div>
          <div className="h-4 w-px bg-gray-300 dark:bg-dark-bg-tertiary"></div>
          <div className="text-blue-600 dark:text-blue-400">
            <span>
              显示 <span className="font-medium">{filteredModels.length}</span>{" "}
              个
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
