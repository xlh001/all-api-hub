import { ArrowUpTrayIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardItem,
  CardList,
  CardTitle
} from "~/components/ui"

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
      <Card padding="none">
        <CardHeader className="px-6 py-4 border-b border-gray-200 dark:border-dark-bg-tertiary space-y-0">
          <div className="flex items-center space-x-2 mb-1">
            <ArrowUpTrayIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            <CardTitle className="mb-0">{t("export.title")}</CardTitle>
          </div>
          <CardDescription>{t("export.description")}</CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <CardList>
            {/* 导出所有数据 */}
            <CardItem
              title={t("export.fullBackup")}
              description={t("export.fullBackupDescription")}
              rightContent={
                <Button
                  onClick={() => handleExportAll(setIsExporting)}
                  disabled={isExporting}
                  variant="success"
                  size="sm"
                  loading={isExporting}>
                  {isExporting
                    ? t("common:status.exporting")
                    : t("common:actions.export")}
                </Button>
              }
            />

            {/* 导出账号数据 */}
            <CardItem
              title={t("export.accountData")}
              description={t("export.accountDataDescription")}
              rightContent={
                <Button
                  onClick={() => handleExportAccounts(setIsExporting)}
                  disabled={isExporting}
                  variant="default"
                  size="sm"
                  loading={isExporting}>
                  {isExporting
                    ? t("common:status.exporting")
                    : t("common:actions.export")}
                </Button>
              }
            />

            {/* 导出用户设置 */}
            <CardItem
              title={t("export.userSettings")}
              description={t("export.userSettingsDescription")}
              rightContent={
                <Button
                  onClick={() => handleExportPreferences(setIsExporting)}
                  disabled={isExporting}
                  variant="secondary"
                  size="sm"
                  loading={isExporting}
                  className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white">
                  {isExporting
                    ? t("common:status.exporting")
                    : t("common:actions.export")}
                </Button>
              }
            />
          </CardList>
        </CardContent>
      </Card>
    </section>
  )
}

export default ExportSection
