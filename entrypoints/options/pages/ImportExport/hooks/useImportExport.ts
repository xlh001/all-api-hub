import { useState } from "react"
import toast from "react-hot-toast"

import { accountStorage } from "~/services/accountStorage"
import { userPreferences } from "~/services/userPreferences"

export const useImportExport = () => {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importData, setImportData] = useState("")

  // 处理文件导入
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setImportData(content)
    }
    reader.readAsText(file)
  }

  // 导入数据
  const handleImport = async () => {
    if (!importData.trim()) {
      toast.error("请选择要导入的文件或输入数据")
      return
    }

    try {
      setIsImporting(true)

      const data = JSON.parse(importData)

      // 验证数据格式
      if (!data.version || !data.timestamp) {
        throw new Error("数据格式不正确")
      }

      let importSuccess = false

      // 根据数据类型进行导入
      if (data.accounts || !data.type) {
        const accountsToImport = data.accounts?.accounts || data.data?.accounts

        const { migratedCount } = await accountStorage.importData({
          accounts: accountsToImport
        })

        importSuccess = true
        if (migratedCount > 0) {
          toast.success(`Imported and migrated ${migratedCount} account(s)`)
        } else {
          toast.success("Import successful")
        }
      }

      if (data.preferences || data.type === "preferences") {
        // 导入用户设置
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

      if (!importSuccess) {
        throw new Error("没有找到可导入的数据")
      }

      // 清空输入框
      setImportData("")
    } catch (error) {
      console.error("导入失败:", error)
      if (error instanceof SyntaxError) {
        toast.error("数据格式错误，请检查JSON格式")
      } else {
        toast.error(`导入失败: ${getErrorMessage(error)}`)
      }
    } finally {
      setIsImporting(false)
    }
  }

  // 验证导入数据
  const validateImportData = () => {
    if (!importData.trim()) return null

    try {
      const data = JSON.parse(importData)
      return {
        valid: true,
        hasAccounts: !!(
          data.accounts ||
          (data.type !== "preferences" && data.data)
        ),
        hasPreferences: !!(data.preferences || data.type === "preferences"),
        timestamp: data.timestamp
          ? new Date(data.timestamp).toLocaleString("zh-CN")
          : "未知"
      }
    } catch {
      return { valid: false }
    }
  }

  return {
    isExporting,
    setIsExporting,
    isImporting,
    importData,
    setImportData,
    handleFileImport,
    handleImport,
    validateImportData
  }
}
