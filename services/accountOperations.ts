/**
 * 账号操作服务模块
 *
 * 作用：
 * 1. 提供账号自动识别功能，通过 Chrome 扩展 API 获取站点用户信息
 * 2. 处理账号的验证、保存和更新操作
 * 3. 封装账号数据的存储逻辑，包括余额获取和数据同步
 *
 * 主要功能：
 * - autoDetectAccount: 自动识别站点账号信息（用户名、令牌、用户ID等）
 * - validateAndSaveAccount: 验证并保存新账号到本地存储
 * - validateAndUpdateAccount: 验证并更新现有账号信息
 * - extractDomainPrefix: 从域名提取站点名称
 * - isValidExchangeRate: 验证汇率输入的有效性
 *
 * 工作流程：
 * 1. 通过 background script 创建临时窗口访问目标站点
 * 2. 使用 content script 从站点获取用户信息
 * 3. 调用 API 获取访问令牌和账号数据
 * 4. 保存或更新账号信息到本地存储
 *
 * 依赖：
 * - accountStorage: 账号本地存储服务
 * - apiService: API 调用服务（获取令牌、余额等）
 * - autoDetectUtils: 错误处理工具
 */

import type { SiteAccount } from "../types"
import {
  analyzeAutoDetectError,
  type AutoDetectError
} from "../utils/autoDetectUtils"
import { accountStorage } from "./accountStorage"
import {
  extractDefaultExchangeRate,
  fetchAccountData,
  fetchSiteStatus,
  getOrCreateAccessToken
} from "./apiService"

// 账号验证结果
export interface AccountValidationResult {
  success: boolean
  data?: {
    username: string
    accessToken: string
    userId: string
    exchangeRate?: number
  }
  error?: string
  detailedError?: AutoDetectError
}

// 账号保存结果
export interface AccountSaveResult {
  success: boolean
  accountId?: string
  error?: string
}

// 自动检测账号信息
export async function autoDetectAccount(
  url: string
): Promise<AccountValidationResult> {
  if (!url.trim()) {
    return { success: false, error: "站点地址不能为空" }
  }

  try {
    // 生成唯一的请求ID
    const requestId = `auto-detect-${Date.now()}`

    // 尝试通过 background script 自动打开窗口并获取信息
    const response = await chrome.runtime.sendMessage({
      action: "autoDetectSite",
      url: url.trim(),
      requestId: requestId
    })

    if (!response.success) {
      const detailedError = analyzeAutoDetectError(
        response.error || "自动检测失败"
      )
      return {
        success: false,
        error:
          response.error ||
          "自动检测失败，请手动输入信息或确保已在目标站点登录",
        detailedError
      }
    }

    const userId = response.data.userId
    if (!userId) {
      const detailedError = analyzeAutoDetectError("无法获取用户 ID")
      return {
        success: false,
        error: "无法获取用户 ID",
        detailedError
      }
    }

    // 并行执行：获取用户信息和站点状态
    const [tokenInfo, siteStatus] = await Promise.all([
      getOrCreateAccessToken(url, userId),
      fetchSiteStatus(url.trim())
    ])

    const { username: detectedUsername, access_token } = tokenInfo

    if (!detectedUsername || !access_token) {
      const detailedError = analyzeAutoDetectError("未能获取到用户名或访问令牌")
      return {
        success: false,
        error: "未能获取到用户名或访问令牌",
        detailedError
      }
    }

    // 获取默认充值比例
    const defaultExchangeRate = extractDefaultExchangeRate(siteStatus)

    return {
      success: true,
      data: {
        username: detectedUsername,
        accessToken: access_token,
        userId: userId.toString(),
        exchangeRate: defaultExchangeRate
      }
    }
  } catch (error) {
    console.error("自动识别失败:", error)
    const detailedError = analyzeAutoDetectError(error)
    const errorMessage = error instanceof Error ? error.message : "未知错误"
    return {
      success: false,
      error: `自动识别失败: ${errorMessage}`,
      detailedError
    }
  }
}

// 验证并保存账号信息（用于新增）
export async function validateAndSaveAccount(
  url: string,
  siteName: string,
  username: string,
  accessToken: string,
  userId: string,
  exchangeRate: string
): Promise<AccountSaveResult> {
  // 表单验证
  if (
    !siteName.trim() ||
    !username.trim() ||
    !accessToken.trim() ||
    !userId.trim()
  ) {
    return { success: false, error: "请填写完整的账号信息" }
  }

  const parsedUserId = parseInt(userId.trim())
  if (isNaN(parsedUserId)) {
    return { success: false, error: "用户 ID 必须是数字" }
  }

  try {
    // 获取账号余额和今日使用情况
    console.log("正在获取账号数据...")
    const freshAccountData = await fetchAccountData(
      url.trim(),
      parsedUserId,
      accessToken.trim()
    )

    const accountData: Omit<SiteAccount, "id" | "created_at" | "updated_at"> = {
      emoji: "", // 不再使用 emoji
      site_name: siteName.trim(),
      site_url: url.trim(),
      health_status: "healthy", // 成功获取数据说明状态正常
      exchange_rate: parseFloat(exchangeRate) || 7.2, // 使用用户输入的汇率
      account_info: {
        id: parsedUserId,
        access_token: accessToken.trim(),
        username: username.trim(),
        quota: freshAccountData.quota,
        today_prompt_tokens: freshAccountData.today_prompt_tokens,
        today_completion_tokens: freshAccountData.today_completion_tokens,
        today_quota_consumption: freshAccountData.today_quota_consumption,
        today_requests_count: freshAccountData.today_requests_count
      },
      last_sync_time: Date.now()
    }

    const accountId = await accountStorage.addAccount(accountData)
    console.log("账号添加成功:", {
      id: accountId,
      siteName,
      freshAccountData
    })

    return { success: true, accountId }
  } catch (error) {
    console.error("保存账号失败:", error)
    const errorMessage = error instanceof Error ? error.message : "未知错误"
    return { success: false, error: `保存失败: ${errorMessage}` }
  }
}

// 验证并更新账号信息（用于编辑）
export async function validateAndUpdateAccount(
  accountId: string,
  url: string,
  siteName: string,
  username: string,
  accessToken: string,
  userId: string,
  exchangeRate: string
): Promise<AccountSaveResult> {
  // 表单验证
  if (
    !siteName.trim() ||
    !username.trim() ||
    !accessToken.trim() ||
    !userId.trim()
  ) {
    return { success: false, error: "请填写完整的账号信息" }
  }

  const parsedUserId = parseInt(userId.trim())
  if (isNaN(parsedUserId)) {
    return { success: false, error: "用户 ID 必须是数字" }
  }

  try {
    // 获取账号余额和今日使用情况
    console.log("正在获取账号数据...")
    const freshAccountData = await fetchAccountData(
      url.trim(),
      parsedUserId,
      accessToken.trim()
    )

    const updateData: Partial<Omit<SiteAccount, "id" | "created_at">> = {
      site_name: siteName.trim(),
      site_url: url.trim(),
      health_status: "healthy", // 成功获取数据说明状态正常
      exchange_rate: parseFloat(exchangeRate) || 7.2, // 使用用户输入的汇率
      account_info: {
        id: parsedUserId,
        access_token: accessToken.trim(),
        username: username.trim(),
        quota: freshAccountData.quota,
        today_prompt_tokens: freshAccountData.today_prompt_tokens,
        today_completion_tokens: freshAccountData.today_completion_tokens,
        today_quota_consumption: freshAccountData.today_quota_consumption,
        today_requests_count: freshAccountData.today_requests_count
      },
      last_sync_time: Date.now()
    }

    const success = await accountStorage.updateAccount(accountId, updateData)
    if (!success) {
      return { success: false, error: "更新账号失败" }
    }

    console.log("账号更新成功:", {
      id: accountId,
      siteName,
      freshAccountData
    })

    return { success: true, accountId }
  } catch (error) {
    console.error("更新账号失败:", error)
    const errorMessage = error instanceof Error ? error.message : "未知错误"
    return { success: false, error: `更新失败: ${errorMessage}` }
  }
}

// 提取域名的主要部分（一级域名前缀）
export function extractDomainPrefix(hostname: string): string {
  if (!hostname) return ""

  // 移除 www. 前缀
  const withoutWww = hostname.replace(/^www\./, "")

  // 处理子域名情况，例如：xxx.xx.google.com -> google
  const parts = withoutWww.split(".")
  if (parts.length >= 2) {
    // 如果是常见的二级域名（如 .com.cn, .co.uk 等），取倒数第三个部分
    const lastPart = parts[parts.length - 1]
    const secondLastPart = parts[parts.length - 2]

    // 检查是否为双重后缀
    const doubleSuffixes = ["com", "net", "org", "gov", "edu", "co"]
    if (
      parts.length >= 3 &&
      doubleSuffixes.includes(secondLastPart) &&
      lastPart.length === 2
    ) {
      // 首字母大写
      return (
        parts[parts.length - 3].charAt(0).toUpperCase() +
        parts[parts.length - 3].slice(1)
      )
    }

    // 否则返回倒数第二个部分
    return secondLastPart.charAt(0).toUpperCase() + secondLastPart.slice(1)
  }

  return withoutWww.charAt(0).toUpperCase() + withoutWww.slice(1)
}

// 就是各个站点的system_name
const defaultSiteNameList = [
  "One API",
  "New API",
  "Veloera",
  "One Hub",
  "Done Hub",
  // 闭源未知，只能已进行猜测
  "VoAPI",
  "Super API",
  "Super-API"
]

function IsNotDefaultSiteName(siteName: string) {
  return !defaultSiteNameList.includes(siteName)
}

export async function getSiteName(tab: chrome.tabs.Tab) {
  let siteName = ""
  const tabTitle = tab.title
  if (IsNotDefaultSiteName(tabTitle)) {
    siteName = tabTitle
  }
  const urlObj = new URL(tab.url!)
  // 包含端口
  const hostWithProtocol = `${urlObj.protocol}//${urlObj.host}`
  const systemName = (await fetchSiteStatus(hostWithProtocol)).system_name
  if (IsNotDefaultSiteName(tabTitle)) {
    siteName = systemName
  } else {
    siteName = extractDomainPrefix(urlObj.hostname)
  }
  return siteName
}

// 验证充值比例是否有效
export function isValidExchangeRate(rate: string): boolean {
  const num = parseFloat(rate)
  return !isNaN(num) && num > 0 && num <= 100
}
