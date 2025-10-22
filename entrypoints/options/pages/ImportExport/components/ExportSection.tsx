import { ArrowUpTrayIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import { BodySmall, Heading4, Heading6 } from "~/components/ui"

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
  const { t } = useTranslation("importExport")
  return (
    <section>
      <div className="h-full bg-white dark:bg-dark-bg-secondary border border-gray-200 dark:border-dark-bg-tertiary rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-bg-tertiary">
          <div className="flex items-center space-x-2">
            <ArrowUpTrayIcon className="w-5 h-5 text-green-600" />
            <Heading4 className="text-gray-900 dark:text-dark-text-primary">
              {t("export.title")}
            </Heading4>
          </div>
          <BodySmall className="text-gray-500 dark:text-dark-text-secondary mt-1">
            {t("export.description")}
          </BodySmall>
        </div>

        <div className="p-6 space-y-4">
          {/* 导出所有数据 */}
          <div className="border border-gray-200 dark:border-dark-bg-tertiary rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Heading6 className="mb-1">{t("export.fullBackup")}</Heading6>
                <BodySmall className="text-gray-500 dark:text-dark-text-secondary">
                  {t("export.fullBackupDescription")}
                </BodySmall>
              </div>
              <button
                onClick={() => handleExportAll(setIsExporting)}
                disabled={isExporting}
                className="ml-4 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50">
                {isExporting
                  ? t("common:status.exporting")
                  : t("common:actions.export")}
              </button>
            </div>
          </div>

          {/* 导出账号数据 */}
          <div className="border border-gray-200 dark:border-dark-bg-tertiary rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Heading6 className="mb-1">{t("export.accountData")}</Heading6>
                <BodySmall className="text-gray-500 dark:text-dark-text-secondary">
                  {t("export.accountDataDescription")}
                </BodySmall>
              </div>
              <button
                onClick={() => handleExportAccounts(setIsExporting)}
                disabled={isExporting}
                className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50">
                {isExporting
                  ? t("common:status.exporting")
                  : t("common:actions.export")}
              </button>
            </div>
          </div>

          {/* 导出用户设置 */}
          <div className="border border-gray-200 dark:border-dark-bg-tertiary rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Heading6 className="mb-1">{t("export.userSettings")}</Heading6>
                <BodySmall className="text-gray-500 dark:text-dark-text-secondary">
                  {t("export.userSettingsDescription")}
                </BodySmall>
              </div>
              <button
                onClick={() => handleExportPreferences(setIsExporting)}
                disabled={isExporting}
                className="ml-4 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50">
                {isExporting
                  ? t("common:status.exporting")
                  : t("common:actions.export")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ExportSection
