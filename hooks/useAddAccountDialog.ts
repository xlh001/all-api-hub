import { useEffect, useState } from "react"
import toast from "react-hot-toast"

import {
  autoDetectAccount,
  getSiteName,
  validateAndSaveAccount
} from "~/services/accountOperations"
import type { AutoDetectError } from "~/utils/autoDetectUtils"

interface UseAddAccountDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function useAddAccountDialog({
  isOpen,
  onClose
}: UseAddAccountDialogProps) {
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
  const [showManualForm, setShowManualForm] = useState(false)
  const [exchangeRate, setExchangeRate] = useState("")
  const [currentTabUrl, setCurrentTabUrl] = useState<string | null>(null)
  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (isOpen) {
      // 重置状态
      setIsDetected(false)
      setSiteName("")
      setUsername("")
      setAccessToken("")
      setUserId("")
      setShowAccessToken(false)
      setDetectionError(null)
      setShowManualForm(false)
      setExchangeRate("")
      setCurrentTabUrl(null)
      setUrl("")
      setNotes("")

      // 获取当前标签页的 URL 作为初始参考
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
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
      })
    }
  }, [isOpen])

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

        if (result.data.exchangeRate) {
          setExchangeRate(result.data.exchangeRate.toString())
          console.log("获取到默认充值比例:", result.data.exchangeRate)
        } else {
          setExchangeRate("")
          console.log("未获取到默认充值比例，设置为空")
        }

        setIsDetected(true)

        console.log("自动识别成功:", {
          username: result.data.username,
          siteName,
          exchangeRate: result.data.exchangeRate
        })
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

  const handleSaveAccount = async () => {
    setIsSaving(true)

    try {
      await toast.promise(
        validateAndSaveAccount(
          url.trim(),
          siteName.trim(),
          username.trim(),
          accessToken.trim(),
          userId.trim(),
          exchangeRate,
          notes.trim()
        ),
        {
          loading: "正在添加账号...",
          success: (result) => {
            if (result.success) {
              onClose()
              return `账号 ${siteName} 添加成功!`
            } else {
              throw new Error(result.error || "保存失败")
            }
          },
          error: (err) => {
            const errorMsg = err.message || "添加失败"
            return `添加失败: ${errorMsg}`
          }
        }
      )
    } catch (error) {
      console.error("保存账号失败:", error)
    } finally {
      setIsSaving(false)
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
      setSiteName("")
    }
  }

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
      notes
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
      setNotes
    },
    handlers: {
      handleUseCurrentTabUrl,
      handleAutoDetect,
      handleSaveAccount,
      handleUrlChange
    }
  }
}
