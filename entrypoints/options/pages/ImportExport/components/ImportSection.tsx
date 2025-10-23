import { ArrowDownTrayIcon, DocumentIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import {
  Alert,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FormField,
  Textarea
} from "~/components/ui"

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
  const { t } = useTranslation("importExport")
  return (
    <section className="flex h-full">
      <Card padding="none" className="flex flex-col flex-1">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ArrowDownTrayIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <CardTitle className="mb-0">{t("import.title")}</CardTitle>
          </div>
          <CardDescription>{t("import.description")}</CardDescription>
        </CardHeader>

        <CardContent padding="default" className="space-y-4">
          {/* 文件选择 */}
          <FormField label={t("import.selectBackupFile")}>
            <div className="flex items-center space-x-3">
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50"
              />
              <DocumentIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
          </FormField>

          {/* 数据预览 */}
          <FormField label={t("import.dataPreview")}>
            <Textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder={t("import.pasteJsonData")}
              className="w-full h-32 font-mono resize-none"
            />
          </FormField>

          {/* 数据验证结果 */}
          {validation && (
            <Alert variant={validation.valid ? "success" : "destructive"}>
              <div>
                {validation.valid ? (
                  <>
                    <p className="font-medium mb-1">{t("import.dataValid")}</p>
                    <div className="text-sm space-y-1">
                      {validation.hasAccounts && (
                        <p>• {t("import.containsAccountData")}</p>
                      )}
                      {validation.hasPreferences && (
                        <p>• {t("import.containsUserSettings")}</p>
                      )}
                      <p>
                        • {t("import.backupTime")}: {validation.timestamp}
                      </p>
                    </div>
                  </>
                ) : (
                  <p>{t("import.dataInvalid")}</p>
                )}
              </div>
            </Alert>
          )}

          {/* 导入按钮 */}
          <Button
            onClick={handleImport}
            disabled={isImporting || !validation?.valid}
            loading={isImporting}
            variant="default"
            className="w-full">
            {isImporting
              ? t("common:status.importing")
              : t("common:actions.import")}
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}

export default ImportSection
