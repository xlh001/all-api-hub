import { useCallback, useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

import {
  autoConfigToNewApi,
  autoDetectAccount,
  getSiteName,
  isValidExchangeRate,
  validateAndSaveAccount,
  validateAndUpdateAccount
} from "~/services/accountOperations"
import { accountStorage } from "~/services/accountStorage"
import { AuthTypeEnum, type CheckInConfig, type DisplaySiteData } from "~/types"
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
  const [checkIn, setCheckIn] = useState<CheckInConfig>({
    enableDetection: false,
    isCheckedInToday: false,
    customCheckInUrl: ""
  })
  const [siteType, setSiteType] = useState("unknown")
  const [authType, setAuthType] = useState(AuthTypeEnum.AccessToken)
  const [isAutoConfiguring, setIsAutoConfiguring] = useState(false)

  // useRef 保存跨渲染引用
  const newAccountRef = useRef(null)

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
    setCheckIn({
      enableDetection: false,
      isCheckedInToday: false,
      customCheckInUrl: ""
    })
    setSiteType("unknown")
    setAuthType(AuthTypeEnum.AccessToken)
    setIsAutoConfiguring(false)
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
        setCheckIn(
          siteAccount.checkIn || {
            enableDetection: false,
            isCheckedInToday: false,
            customCheckInUrl: ""
          }
        )
        setSiteType(siteAccount.site_type || "")
        setAuthType(siteAccount.authType || AuthTypeEnum.AccessToken)
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
      const result = await autoDetectAccount(url.trim(), authType)

      if (!result.success) {
        setDetectionError(result.detailedError || null)
        setShowManualForm(true)
        return
      }

      if (result.data) {
        setUsername(result.data.username)
        setAccessToken(result.data.accessToken)
        setUserId(result.data.userId)
        setCheckIn(
          result.data.checkIn || {
            enableDetection: false,
            isCheckedInToday: false,
            customCheckInUrl: ""
          }
        )

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
      const errorMessage = getErrorMessage(error)
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

  const handleSaveAccount = async () => {
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
              checkIn,
              siteType,
              authType
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
              checkIn,
              siteType,
              authType
            )

      if (result.success) {
        toast.success(
          mode === "add"
            ? `账号 ${siteName} 添加成功!`
            : `账号 ${siteName} 更新成功!`
        )
        return result
      } else {
        toast.error(`操作失败: ${result.error || "未知错误"}`)
        throw new Error(result.error || "保存失败")
      }
    } catch (error: any) {
      toast.error(`操作失败: ${error.message}`)
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  const handleAutoConfig = async () => {
    setIsAutoConfiguring(true)
    const toastId = toast.loading("正在开始自动配置到 New API...")
    try {
      let targetAccount: any = account || newAccountRef.current
      // 如果是新增（account 不存在），就先保存
      if (!targetAccount) {
        targetAccount = await handleSaveAccount()
        if (!targetAccount) {
          toast.error("保存账号失败", { id: toastId })
          return
        }
        // 缓存到 ref，避免重复保存
        newAccountRef.current = targetAccount
      }

      // 获取账户详细信息
      const siteAccount = await accountStorage.getAccountById(
        targetAccount.accountId
      )
      if (!siteAccount) {
        toast.error("Could not find account details.", { id: toastId })
        setIsAutoConfiguring(false)
        return
      }

      // 检查 API 密钥并 导入到 New API
      const result = await autoConfigToNewApi(siteAccount, toastId)
      if (result.success) {
        toast.success(result.message, { id: toastId })
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      toast.error(`自动配置到 New API失败: ${getErrorMessage(error)}`, {
        id: toastId
      })
    } finally {
      setIsAutoConfiguring(false)
    }
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

  const handleClose = () => {
    onClose()
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
      checkIn,
      siteType,
      authType,
      isFormValid,
      isAutoConfiguring
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
      setCheckIn,
      setSiteType,
      setAuthType
    },
    handlers: {
      handleUseCurrentTabUrl,
      handleAutoDetect,
      handleSaveAccount,
      handleUrlChange,
      handleSubmit,
      handleAutoConfig,
      handleClose
    }
  }
}
