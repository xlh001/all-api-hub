import { ArrowPathIcon } from "@heroicons/react/24/outline"
import { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"

import { accountStorage } from "~/services/accountStorage"
import { userPreferences } from "~/services/userPreferences"
import {
  downloadBackup,
  testWebdavConnection,
  uploadBackup
} from "~/services/webdavService"

export default function WebDAVSettings() {
  // 配置表单
  const [webdavUrl, setWebdavUrl] = useState("")
  const [webdavUsername, setWebdavUsername] = useState("")
  const [webdavPassword, setWebdavPassword] = useState("")

  // 独立的动作状态，避免互相影响
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [downloading, setDownloading] = useState(false)

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
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <ArrowPathIcon className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-medium text-gray-900">
            WebDAV 备份与同步（手动）
          </h2>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          配置 WebDAV 并手动上传/下载备份文件
        </p>
      </div>

      <div className="p-6 space-y-4">
        {/* 配置表单 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Webdav 地址
            </label>
            <input
              type="url"
              placeholder="例如：https://dav.example.com/backups/ 或 完整文件 URL"
              value={webdavUrl}
              onChange={(e) => setWebdavUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              用户名
            </label>
            <input
              type="text"
              value={webdavUsername}
              onChange={(e) => setWebdavUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              密码
            </label>
            <input
              type="password"
              value={webdavPassword}
              onChange={(e) => setWebdavPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
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
                toast.success("WebDAV 配置已保存")
              } catch (e) {
                console.error(e)
                toast.error("保存失败")
              } finally {
                setSaving(false)
              }
            }}
            disabled={saving}
            className="px-4 py-2 bg-gray-700 text-white text-sm font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50">
            {saving ? "保存中..." : "保存配置"}
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
                toast.success("连接成功")
              } catch (e: any) {
                console.error(e)
                toast.error(e?.message || "连接失败")
              } finally {
                setTesting(false)
              }
            }}
            disabled={testing || !webdavConfigFilled}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50">
            {testing ? "测试中..." : "测试连接"}
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
                toast.success("上传成功")
              } catch (e: any) {
                console.error(e)
                toast.error(e?.message || "上传失败")
              } finally {
                setUploading(false)
              }
            }}
            disabled={uploading || !webdavConfigFilled}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50">
            {uploading ? "上传中..." : "上传备份"}
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
                  const accountsData = data.accounts || data.data
                  if (accountsData) {
                    const success =
                      await accountStorage.importData(accountsData)
                    if (success) {
                      importSuccess = true
                      toast.success("账号数据导入成功")
                    }
                  }
                }
                if (data.preferences || data.type === "preferences") {
                  const preferencesData = data.preferences || data.data
                  if (preferencesData) {
                    const success =
                      await userPreferences.importPreferences(preferencesData)
                    if (success) {
                      importSuccess = true
                      toast.success("用户设置导入成功")
                    }
                  }
                }
                if (!importSuccess) throw new Error("没有找到可导入的数据")
              } catch (e: any) {
                console.error(e)
                toast.error(e?.message || "下载/导入失败")
              } finally {
                setDownloading(false)
              }
            }}
            disabled={downloading || !webdavConfigFilled}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50">
            {downloading ? "处理中..." : "下载并导入"}
          </button>
        </div>
      </div>
    </div>
  )
}
