import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"

import { fetchAccountTokens } from "../services/apiService"
import type { ApiToken, DisplaySiteData } from "../types"

export function useCopyKeyDialog(
  isOpen: boolean,
  account: DisplaySiteData | null
) {
  const [tokens, setTokens] = useState<ApiToken[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [expandedTokens, setExpandedTokens] = useState<Set<number>>(new Set())

  const fetchTokens = useCallback(async () => {
    if (!account) return

    setIsLoading(true)
    setError(null)

    try {
      const tokensResponse = await fetchAccountTokens(
        account.baseUrl,
        account.userId,
        account.token
      )
      if (Array.isArray(tokensResponse)) {
        setTokens(tokensResponse)
      } else {
        console.warn("Token response is not an array:", tokensResponse)
        setTokens([])
      }
    } catch (error) {
      console.error("获取密钥列表失败:", error)
      const errorMessage = error instanceof Error ? error.message : "未知错误"
      setError(`获取密钥列表失败: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }, [account])

  useEffect(() => {
    if (isOpen && account) {
      fetchTokens()
    } else {
      setTokens([])
      setError(null)
      setCopiedKey(null)
      setExpandedTokens(new Set())
    }
  }, [isOpen, account, fetchTokens])

  const copyKey = async (key: string) => {
    try {
      const textToCopy = key.startsWith("sk-") ? key : "sk-" + key
      await navigator.clipboard.writeText(textToCopy)
      setCopiedKey(key)
      toast.success("密钥已复制到剪贴板")

      setTimeout(() => {
        setCopiedKey(null)
      }, 2000)
    } catch (error) {
      console.error("复制失败:", error)
      toast.error("复制失败，请手动复制")
    }
  }

  const toggleTokenExpansion = (tokenId: number) => {
    setExpandedTokens((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(tokenId)) {
        newSet.delete(tokenId)
      } else {
        newSet.add(tokenId)
      }
      return newSet
    })
  }

  return {
    tokens,
    isLoading,
    error,
    copiedKey,
    expandedTokens,
    fetchTokens,
    copyKey,
    toggleTokenExpansion
  }
}
