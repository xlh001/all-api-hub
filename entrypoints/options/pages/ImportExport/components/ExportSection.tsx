import { ArrowUpTrayIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import {
  handleExportAccounts,
  handleExportAll,
  handleExportPreferences
} from "../utils"

interface ExportSectionProps {
  isExporting: boolean
  setIsExporting: (isExporting: boolean) => void
}

const ExportSection = ({ isExporting, setIsExporting }: ExportSectionProps) => {
  const { t } = useTranslation()
  return (
    <section>
      <div className="h-full bg-white dark:bg-dark-bg-secondary border border-gray-200 dark:border-dark-bg-tertiary rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-bg-tertiary">
          <div className="flex items-center space-x-2">
            <ArrowUpTrayIcon className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary">
              {t("importExport.exportData")}
            </h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
            {t("importExport.exportDescription")}
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* 导出所有数据 */}
          <div className="border border-gray-200 dark:border-dark-bg-tertiary rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-dark-text-primary mb-1">
                  {t("importExport.fullBackup")}
                </h3>
                <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
                  {t("importExport.fullBackupDescription")}
                </p>
              </div>
              <button
                onClick={() => handleExportAll(setIsExporting)}
                disabled={isExporting}
                className="ml-4 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50">
                {isExporting
                  ? t("importExport.exporting")
                  : t("importExport.export")}
              </button>
            </div>
          </div>

          {/* 导出账号数据 */}
          <div className="border border-gray-200 dark:border-dark-bg-tertiary rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-dark-text-primary mb-1">
                  {t("importExport.accountData")}
                </h3>
                <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
                  {t("importExport.accountDataDescription")}
                </p>
              </div>
              <button
                onClick={() => handleExportAccounts(setIsExporting)}
                disabled={isExporting}
                className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50">
                {isExporting
                  ? t("importExport.exporting")
                  : t("importExport.export")}
              </button>
            </div>
          </div>

          {/* 导出用户设置 */}
          <div className="border border-gray-200 dark:border-dark-bg-tertiary rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-dark-text-primary mb-1">
                  {t("importExport.userSettings")}
                </h3>
                <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
                  {t("importExport.userSettingsDescription")}
                </p>
              </div>
              <button
                onClick={() => handleExportPreferences(setIsExporting)}
                disabled={isExporting}
                className="ml-4 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50">
                {isExporting
                  ? t("importExport.exporting")
                  : t("importExport.export")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ExportSection
