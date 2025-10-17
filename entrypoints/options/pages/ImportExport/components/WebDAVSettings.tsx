import {
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon
} from "@heroicons/react/24/outline"
import { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

import { accountStorage } from "~/services/accountStorage"
import { userPreferences } from "~/services/userPreferences"
import {
  downloadBackup,
  testWebdavConnection,
  uploadBackup
} from "~/services/webdavService"

export default function WebDAVSettings() {
  const { t } = useTranslation()
  // 配置表单
  const [webdavUrl, setWebdavUrl] = useState("")
  const [webdavUsername, setWebdavUsername] = useState("")
  const [webdavPassword, setWebdavPassword] = useState("")

  // 独立的动作状态，避免互相影响
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const [showWebdavPassword, setShowWebdavPassword] = useState(false)

  const webdavConfigFilled = useMemo(
    () => Boolean(webdavUrl && webdavUsername && webdavPassword),
    [webdavUrl, webdavUsername, webdavPassword]
  )

  // 初始加载
  useEffect(() => {
    ;(async () => {
      const prefs = await userPreferences.getPreferences()
      setWebdavUrl(prefs.webdavUrl ?? "")
      setWebdavUsername(prefs.webdavUsername ?? "")
      setWebdavPassword(prefs.webdavPassword ?? "")
    })()
  }, [])

  return (
    <div className="bg-white dark:bg-dark-bg-secondary border border-gray-200 dark:border-dark-bg-tertiary rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-bg-tertiary">
        <div className="flex items-center space-x-2">
          <ArrowPathIcon className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary">
            {t("importExport.webdavBackupSync")}
          </h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
          {t("importExport.webdavConfigDesc")}
        </p>
      </div>

      <div className="p-6 space-y-4">
        {/* 配置表单 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">
              {t("importExport.webdavUrl")}
            </label>
            <input
              type="url"
              placeholder={t("importExport.webdavUrlExample")}
              value={webdavUrl}
              onChange={(e) => setWebdavUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-bg-tertiary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text-primary placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">
              {t("importExport.username")}
            </label>
            <input
              type="text"
              value={webdavUsername}
              onChange={(e) => setWebdavUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-bg-tertiary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text-primary placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">
              {t("importExport.password")}
            </label>
            <div className="relative">
              <input
                type={showWebdavPassword ? "text" : "password"}
                value={webdavPassword}
                onChange={(e) => setWebdavPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-bg-tertiary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text-primary placeholder-gray-400 dark:placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowWebdavPassword(!showWebdavPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                {showWebdavPassword ? (
                  <EyeSlashIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* 保存配置 */}
          <button
            onClick={async () => {
              setSaving(true)
              try {
                await userPreferences.updateWebdavSettings({
                  webdavUrl,
                  webdavUsername,
                  webdavPassword
                })
                toast.success(t("basicSettings.updateSuccess"))
              } catch (e) {
                console.error(e)
                toast.error(t("basicSettings.saveSettingsFailed"))
              } finally {
                setSaving(false)
              }
            }}
            disabled={saving}
            className="px-4 py-2 bg-gray-700 text-white text-sm font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50">
            {saving ? t("importExport.saving") : t("importExport.saveConfig")}
          </button>

          {/* 测试连接 */}
          <button
            onClick={async () => {
              setTesting(true)
              try {
                await userPreferences.updateWebdavSettings({
                  webdavUrl,
                  webdavUsername,
                  webdavPassword
                })
                await testWebdavConnection({
                  webdavUrl,
                  webdavUsername,
                  webdavPassword
                })
                toast.success(t("basicSettings.updateSuccess"))
              } catch (e: any) {
                console.error(e)
                toast.error(e?.message || t("basicSettings.updateFailed"))
              } finally {
                setTesting(false)
              }
            }}
            disabled={testing || !webdavConfigFilled}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50">
            {testing
              ? t("importExport.testing")
              : t("importExport.testConnection")}
          </button>

          {/* 上传备份 */}
          <button
            onClick={async () => {
              setUploading(true)
              try {
                const [accountData, preferencesData] = await Promise.all([
                  accountStorage.exportData(),
                  userPreferences.exportPreferences()
                ])
                const exportData = {
                  version: "1.0",
                  timestamp: Date.now(),
                  accounts: accountData,
                  preferences: preferencesData
                }
                await uploadBackup(JSON.stringify(exportData, null, 2), {
                  webdavUrl,
                  webdavUsername,
                  webdavPassword
                })
                toast.success(t("importExport.dataExported"))
              } catch (e: any) {
                console.error(e)
                toast.error(e?.message || t("importExport.exportFailed"))
              } finally {
                setUploading(false)
              }
            }}
            disabled={uploading || !webdavConfigFilled}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50">
            {uploading
              ? t("importExport.uploading")
              : t("importExport.uploadBackup")}
          </button>

          {/* 下载并导入 */}
          <button
            onClick={async () => {
              setDownloading(true)
              try {
                const content = await downloadBackup({
                  webdavUrl,
                  webdavUsername,
                  webdavPassword
                })
                const data = JSON.parse(content)

                let importSuccess = false
                if (data.accounts || !data.type) {
                  const accountsToImport =
                    data.accounts?.accounts || data.data?.accounts

                  const { migratedCount } = await accountStorage.importData({
                    accounts: accountsToImport
                  })

                  importSuccess = true
                  if (migratedCount > 0) {
                    toast.success(
                      `Imported and migrated ${migratedCount} account(s)`
                    )
                  } else {
                    toast.success("Import successful")
                  }
                }
                if (data.preferences || data.type === "preferences") {
                  const preferencesData = data.preferences || data.data
                  if (preferencesData) {
                    const success =
                      await userPreferences.importPreferences(preferencesData)
                    if (success) {
                      importSuccess = true
                      toast.success(t("importExport.importSuccess"))
                    }
                  }
                }
                if (!importSuccess)
                  throw new Error(t("importExport.noImportableDataFound"))
              } catch (e: any) {
                console.error(e)
                toast.error(
                  e?.message || t("importExport.downloadImportFailed")
                )
              } finally {
                setDownloading(false)
              }
            }}
            disabled={downloading || !webdavConfigFilled}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50">
            {downloading
              ? t("importExport.processing")
              : t("importExport.downloadImport")}
          </button>
        </div>
      </div>
    </div>
  )
}
