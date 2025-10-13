import {
  ArrowDownTrayIcon,
  CheckCircleIcon,
  DocumentIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline"

interface ImportSectionProps {
  importData: string
  setImportData: (data: string) => void
  handleFileImport: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleImport: () => void
  isImporting: boolean
  validation: {
    valid: boolean
    hasAccounts?: boolean
    hasPreferences?: boolean
    timestamp?: string
  } | null
}

const ImportSection = ({
  importData,
  setImportData,
  handleFileImport,
  handleImport,
  isImporting,
  validation
}: ImportSectionProps) => {
  return (
    <section>
      <div className="h-full bg-white dark:bg-dark-bg-secondary border border-gray-200 dark:border-dark-bg-tertiary rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-bg-tertiary">
          <div className="flex items-center space-x-2">
            <ArrowDownTrayIcon className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary">
              导入数据
            </h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
            从备份文件恢复数据
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* 文件选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-2">
              选择备份文件
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50"
              />
              <DocumentIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
          </div>

          {/* 数据预览 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-2">
              数据内容预览
            </label>
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="粘贴JSON数据或通过上面的文件选择器导入..."
              className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-dark-bg-tertiary rounded-lg text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text-primary placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* 数据验证结果 */}
          {validation && (
            <div
              className={`p-3 rounded-lg ${
                validation.valid
                  ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30"
                  : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30"
              }`}>
              <div className="flex items-start space-x-2">
                {validation.valid ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                )}
                <div className="text-sm">
                  {validation.valid ? (
                    <div>
                      <p className="text-green-800 dark:text-green-200 font-medium">
                        数据格式正确
                      </p>
                      <div className="mt-1 text-green-700 dark:text-green-300">
                        {validation.hasAccounts && <p>• 包含账号数据</p>}
                        {validation.hasPreferences && <p>• 包含用户设置</p>}
                        <p>• 备份时间: {validation.timestamp}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-red-800 dark:text-red-200">
                      数据格式错误，请检查JSON格式
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 导入按钮 */}
          <button
            onClick={handleImport}
            disabled={isImporting || !validation?.valid}
            className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {isImporting ? "导入中..." : "导入数据"}
          </button>
        </div>
      </div>
    </section>
  )
}

export default ImportSection
