import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"

import {
  autoDetectAccount,
  isValidExchangeRate,
  validateAndUpdateAccount
} from "~/services/accountOperations"
import { accountStorage } from "~/services/accountStorage"
import type { DisplaySiteData } from "~/types"
import type { AutoDetectError } from "~/utils/autoDetectUtils"

interface UseEditAccountDialogProps {
  account: DisplaySiteData | null
  onClose: () => void
}

export function useEditAccountDialog({
  account,
  onClose
}: UseEditAccountDialogProps) {
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
  const [showManualForm, setShowManualForm] = useState(true) // 编辑模式默认显示
  const [exchangeRate, setExchangeRate] = useState("")
  const [notes, setNotes] = useState("")
  const [supportsCheckIn, setSupportsCheckIn] = useState(false)
  const [siteType, setSiteType] = useState("")

  const resetForm = useCallback(() => {
    setUrl("")
    setIsDetected(false)
    setSiteName("")
    setUsername("")
    setAccessToken("")
    setUserId("")
    setShowAccessToken(false)
    setDetectionError(null)
    setShowManualForm(true)
    setExchangeRate("")
    setNotes("")
    setSupportsCheckIn(false)
    setSiteType("")
  }, [])

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
    if (account) {
      resetForm()
      loadAccountData(account.id)
    } else {
      resetForm()
    }
  }, [account, loadAccountData, resetForm])

  const handleAutoDetect = async () => {
    if (!url.trim()) return
    setIsDetecting(true)
    setDetectionError(null)
    try {
      const result = await autoDetectAccount(url.trim())
      if (!result.success) {
        setDetectionError(result.detailedError || null)
        return
      }
      if (result.data) {
        setUsername(result.data.username)
        setAccessToken(result.data.accessToken)
        setUserId(result.data.userId)
        setSupportsCheckIn(result.data.checkSupport || false)
        if (result.data.exchangeRate) {
          setExchangeRate(result.data.exchangeRate.toString())
        }
        if (result.data.siteType) {
          setSiteType(result.data.siteType)
        }
        setIsDetected(true)
        toast.success("自动识别成功！")
      }
    } catch (error) {
      console.error("自动识别失败:", error)
      const message = error instanceof Error ? error.message : "未知错误"
      setDetectionError({ type: "unknown" as any, message, helpDocUrl: "#" })
    } finally {
      setIsDetecting(false)
    }
  }

  const handleSaveAccount = async () => {
    if (!account) {
      toast.error("账号信息错误")
      return
    }

    setIsSaving(true)
    try {
      await toast.promise(
        validateAndUpdateAccount(
          account.id,
          url.trim(),
          siteName.trim(),
          username.trim(),
          accessToken.trim(),
          userId.trim(),
          exchangeRate,
          notes.trim(),
          supportsCheckIn,
          siteType
        ),
        {
          loading: "正在保存更改...",
          success: (result) => {
            if (result.success) {
              onClose()
              return `账号 ${siteName} 更新成功!`
            }
            throw new Error(result.error || "更新失败")
          },
          error: (err) => `更新失败: ${err.message || "未知错误"}`
        }
      )
    } catch (error) {
      console.error("更新账号失败:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isDetected || showManualForm) {
      handleSaveAccount()
    } else {
      handleAutoDetect()
    }
  }

  const isFormValid =
    !!siteName.trim() &&
    !!username.trim() &&
    !!accessToken.trim() &&
    !!userId.trim() &&
    isValidExchangeRate(exchangeRate)

  return {
    url,
    setUrl,
    isDetecting,
    siteName,
    setSiteName,
    username,
    setUsername,
    accessToken,
    setAccessToken,
    userId,
    setUserId,
    isDetected,
    isSaving,
    showAccessToken,
    setShowAccessToken,
    detectionError,
    showManualForm,
    exchangeRate,
    setExchangeRate,
    notes,
    setNotes,
    supportsCheckIn,
    setSupportsCheckIn,
    siteType,
    setSiteType,
    handleAutoDetect,
    handleSubmit,
    isFormValid
  }
}
