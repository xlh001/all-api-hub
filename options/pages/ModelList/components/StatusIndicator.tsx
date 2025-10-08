import {
  ArrowPathIcon,
  CpuChipIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline"

import type { DisplaySiteData } from "~/types"

interface StatusIndicatorProps {
  selectedAccount: string
  isLoading: boolean
  dataFormatError: boolean
  currentAccount: DisplaySiteData | undefined
  loadPricingData: () => void
}

export function StatusIndicator({
  selectedAccount,
  isLoading,
  dataFormatError,
  currentAccount,
  loadPricingData
}: StatusIndicatorProps) {
  if (!selectedAccount) {
    return (
      <div className="text-center py-12">
        <CpuChipIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">请先选择一个账号查看模型列表</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <ArrowPathIcon className="w-8 h-8 text-blue-600 mx-auto mb-4 animate-spin" />
        <p className="text-gray-500">正在加载模型数据...</p>
      </div>
    )
  }

  if (dataFormatError && currentAccount) {
    return (
      <div className="mb-6 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-4">
          <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">
              数据格式不兼容
            </h3>
            <p className="text-yellow-700 mb-4">
              当前站点的模型数据接口返回格式不符合标准规范，可能是经过二次开发的站点。
              插件暂时无法解析该站点的模型定价信息。
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`${currentAccount.baseUrl}/pricing`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                <span>前往站点查看定价信息</span>
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M17 3l4 4m-5 0l5-5"
                  />
                </svg>
              </a>
              <button
                onClick={loadPricingData}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                <span>重新尝试加载</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
