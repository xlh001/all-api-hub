import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"

import WebDAVSettings from "~/components/WebDAVSettings"
import ExportSection from "~/options/pages/ImportExport/ExportSection"
import { useImportExport } from "~/options/pages/ImportExport/hooks/useImportExport"
import ImportSection from "~/options/pages/ImportExport/ImportSection"
import PageHeader from "~/options/pages/ImportExport/PageHeader"

export default function ImportExport() {
  const {
    isExporting,
    setIsExporting,
    isImporting,
    importData,
    setImportData,
    handleFileImport,
    handleImport,
    validateImportData
  } = useImportExport()

  const validation = validateImportData()

  return (
    <div className="p-6">
      <PageHeader />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ExportSection
          isExporting={isExporting}
          setIsExporting={setIsExporting}
        />
        <ImportSection
          importData={importData}
          setImportData={setImportData}
          handleFileImport={handleFileImport}
          handleImport={handleImport}
          isImporting={isImporting}
          validation={validation}
        />
      </div>

      {/* WebDAV 备份/同步 */}
      <div className="mt-8">
        <WebDAVSettings />
      </div>

      {/* 重要提示 */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-yellow-800 font-medium mb-1">重要提示</p>
            <ul className="text-yellow-700 space-y-1">
              <li>• 导入数据将覆盖现有的相同类型数据，请谨慎操作</li>
              <li>• 建议在导入前先导出当前数据进行备份</li>
              <li>• 仅支持本插件导出的JSON格式文件</li>
              <li>• 导入的账号数据包含敏感信息，请确保文件来源可信</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
