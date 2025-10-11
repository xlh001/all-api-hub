import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"

import {
  autoDetectAccount,
  getSiteName,
  isValidExchangeRate,
  validateAndSaveAccount,
  validateAndUpdateAccount
} from "~/services/accountOperations"
import { accountStorage } from "~/services/accountStorage"
import type { DisplaySiteData } from "~/types"
import type { AutoDetectError } from "~/utils/autoDetectUtils"

interface UseAccountDialogProps {
  mode: "add" | "edit"
  account?: DisplaySiteData | null
  isOpen: boolean
  onClose: () => void
}

export function useAccountDialog({
  mode,
  account,
  isOpen,
  onClose
}: UseAccountDialogProps) {
  const [url, setUrl] = useState("")
  const [isDetecting, setIsDetecting] = useState(false)
  const [siteName, setSiteName] = useState("")
  const [username, setUsername] = useState("")
  const [accessToken, setAccessToken] = useState("")
  const [userId, setUserId] = useState("")
  const [isDetected, setIsDetected] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showAccessToken, setShowAccessToken] = useState(false)
  const [detectionError, setDetectionError] = useState<AutoDetectError | null>(
    null
  )
  const [showManualForm, setShowManualForm] = useState(mode === "edit")
  const [exchangeRate, setExchangeRate] = useState("")
  const [currentTabUrl, setCurrentTabUrl] = useState<string | null>(null)
  const [notes, setNotes] = useState("")
  const [supportsCheckIn, setSupportsCheckIn] = useState(false)
  const [siteType, setSiteType] = useState("unknown")

  const resetForm = useCallback(() => {
    setUrl("")
    setIsDetected(false)
    setSiteName("")
    setUsername("")
    setAccessToken("")
    setUserId("")
    setShowAccessToken(false)
    setDetectionError(null)
    setShowManualForm(mode === "edit")
    setExchangeRate("")
    setCurrentTabUrl(null)
    setNotes("")
    setSupportsCheckIn(false)
    setSiteType("unknown")
  }, [mode])

  const loadAccountData = useCallback(async (accountId: string) => {
    try {
      const siteAccount = await accountStorage.getAccountById(accountId)
      if (siteAccount) {
        setUrl(siteAccount.site_url)
        setSiteName(siteAccount.site_name)
        setUsername(siteAccount.account_info.username)
        setAccessToken(siteAccount.account_info.access_token)
        setUserId(siteAccount.account_info.id.toString())
        setExchangeRate(siteAccount.exchange_rate.toString())
        setNotes(siteAccount.notes || "")
        setSupportsCheckIn(siteAccount.supports_check_in || false)
        setSiteType(siteAccount.site_type || "")
      }
    } catch (error) {
      console.error("加载账号数据失败:", error)
      toast.error("加载账号数据失败")
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      resetForm()
      if (mode === "edit" && account) {
        loadAccountData(account.id)
      } else {
        // Get current tab URL for add mode
        chrome.tabs.query(
          { active: true, currentWindow: true },
          async (tabs) => {
            const tab = tabs[0]
            if (tab.url) {
              try {
                const urlObj = new URL(tab.url)
                const baseUrl = `${urlObj.protocol}//${urlObj.host}`
                if (!baseUrl.startsWith("http")) {
                  return
                }
                setCurrentTabUrl(baseUrl)
                setSiteName(await getSiteName(tab))
              } catch (error) {
                console.log("无法解析 URL:", error)
                setCurrentTabUrl(null)
                setSiteName("")
              }
            }
          }
        )
      }
    }
  }, [isOpen, mode, account, resetForm, loadAccountData])

  const handleUseCurrentTabUrl = () => {
    if (currentTabUrl) {
      setUrl(currentTabUrl)
    }
  }

  const handleAutoDetect = async () => {
    if (!url.trim()) {
      return
    }

    setIsDetecting(true)
    setDetectionError(null)

    try {
      const result = await autoDetectAccount(url.trim())

      if (!result.success) {
        setDetectionError(result.detailedError || null)
        setShowManualForm(true)
        return
      }

      if (result.data) {
        setUsername(result.data.username)
        setAccessToken(result.data.accessToken)
        setUserId(result.data.userId)
        setSupportsCheckIn(result.data.checkSupport || false)

        if (result.data.exchangeRate) {
          setExchangeRate(result.data.exchangeRate.toString())
        } else if (mode === "add") {
          setExchangeRate("")
        }

        if (result.data.siteType) {
          setSiteType(result.data.siteType)
        }

        setIsDetected(true)
        if (mode === "edit") {
          toast.success("自动识别成功！")
        }
      }
    } catch (error) {
      console.error("自动识别失败:", error)
      const errorMessage = error instanceof Error ? error.message : "未知错误"
      setDetectionError({
        type: "unknown" as any,
        message: `自动识别失败: ${errorMessage}`,
        helpDocUrl: "#"
      })
      setShowManualForm(true)
    } finally {
      setIsDetecting(false)
    }
  }

  const handleSaveAccount = () => {
    return new Promise(async (resolve, reject) => {
      setIsSaving(true)
      try {
        const result =
          mode === "add"
            ? await validateAndSaveAccount(
                url.trim(),
                siteName.trim(),
                username.trim(),
                accessToken.trim(),
                userId.trim(),
                exchangeRate,
                notes.trim(),
                supportsCheckIn,
                siteType
              )
            : await validateAndUpdateAccount(
                account!.id,
                url.trim(),
                siteName.trim(),
                username.trim(),
                accessToken.trim(),
                userId.trim(),
                exchangeRate,
                notes.trim(),
                supportsCheckIn,
                siteType
              )

        if (result.success) {
          toast.success(
            mode === "add"
              ? `账号 ${siteName} 添加成功!`
              : `账号 ${siteName} 更新成功!`
          )
          resolve(result)
        } else {
          toast.error(`操作失败: ${result.error || "未知错误"}`)
          reject(new Error(result.error || "保存失败"))
        }
      } catch (error) {
        toast.error(`操作失败: ${error.message}`)
        reject(error)
      } finally {
        setIsSaving(false)
      }
    })
  }

  const handleUrlChange = (newUrl: string) => {
    if (newUrl.trim()) {
      try {
        const urlObj = new URL(newUrl)
        const baseUrl = `${urlObj.protocol}//${urlObj.host}`
        setUrl(baseUrl)
      } catch (error) {
        setUrl(newUrl)
      }
    } else {
      setUrl("")
      if (mode === "add") {
        setSiteName("")
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSaveAccount()
  }

  const isFormValid =
    !!siteName.trim() &&
    !!username.trim() &&
    !!accessToken.trim() &&
    !!userId.trim() &&
    isValidExchangeRate(exchangeRate)

  return {
    state: {
      url,
      isDetecting,
      siteName,
      username,
      accessToken,
      userId,
      isDetected,
      isSaving,
      showAccessToken,
      detectionError,
      showManualForm,
      exchangeRate,
      currentTabUrl,
      notes,
      supportsCheckIn,
      siteType,
      isFormValid
    },
    setters: {
      setUrl,
      setSiteName,
      setUsername,
      setAccessToken,
      setUserId,
      setShowAccessToken,
      setShowManualForm,
      setExchangeRate,
      setNotes,
      setSupportsCheckIn,
      setSiteType
    },
    handlers: {
      handleUseCurrentTabUrl,
      handleAutoDetect,
      handleSaveAccount,
      handleUrlChange,
      handleSubmit
    }
  }
}
