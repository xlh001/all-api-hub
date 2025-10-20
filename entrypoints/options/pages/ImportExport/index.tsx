import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import ExportSection from "./components/ExportSection"
import ImportSection from "./components/ImportSection"
import PageHeader from "./components/PageHeader"
import WebDAVSettings from "./components/WebDAVSettings"
import { useImportExport } from "./hooks/useImportExport"

export default function ImportExport() {
  const { t } = useTranslation("importExport")
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
      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30 rounded-lg">
        <div className="flex items-start space-x-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-yellow-800 dark:text-yellow-200 font-medium mb-1">
              {t("notice.importantNotice")}
            </p>
            <ul className="text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>{t("notice.importWarning1")}</li>
              <li>{t("notice.importWarning2")}</li>
              <li>{t("notice.importWarning3")}</li>
              <li>{t("notice.importWarning4")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
