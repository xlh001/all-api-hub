import { ArrowUpTrayIcon } from "@heroicons/react/24/outline"

import {
  handleExportAccounts,
  handleExportAll,
  handleExportPreferences
} from "~/options/pages/ImportExport/utils"

interface ExportSectionProps {
  isExporting: boolean
  setIsExporting: (isExporting: boolean) => void
}

const ExportSection = ({ isExporting, setIsExporting }: ExportSectionProps) => {
  return (
    <section>
      <div className="h-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <ArrowUpTrayIcon className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-medium text-gray-900">导出数据</h2>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            将数据导出为JSON文件进行备份
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* 导出所有数据 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">完整备份</h3>
                <p className="text-sm text-gray-500">
                  导出所有账号数据和用户设置，推荐用于完整备份
                </p>
              </div>
              <button
                onClick={() => handleExportAll(setIsExporting)}
                disabled={isExporting}
                className="ml-4 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50">
                {isExporting ? "导出中..." : "导出"}
              </button>
            </div>
          </div>

          {/* 导出账号数据 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">账号数据</h3>
                <p className="text-sm text-gray-500">
                  仅导出账号信息和相关数据
                </p>
              </div>
              <button
                onClick={() => handleExportAccounts(setIsExporting)}
                disabled={isExporting}
                className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50">
                {isExporting ? "导出中..." : "导出"}
              </button>
            </div>
          </div>

          {/* 导出用户设置 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">用户设置</h3>
                <p className="text-sm text-gray-500">
                  仅导出界面设置和偏好配置
                </p>
              </div>
              <button
                onClick={() => handleExportPreferences(setIsExporting)}
                disabled={isExporting}
                className="ml-4 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50">
                {isExporting ? "导出中..." : "导出"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ExportSection
