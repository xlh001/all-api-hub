/**
 * 账号操作服务模块
 */

import { t } from "i18next"
import toast from "react-hot-toast"

import { UI_CONSTANTS } from "~/constants/ui.ts"
import { createApiToken, fetchAccountTokens } from "~/services/apiService"
import type { CreateTokenRequest } from "~/services/apiService/common/type"
import { importToNewApi } from "~/services/newApiService"
import { userPreferences } from "~/services/userPreferences"
import {
  ApiToken,
  AuthTypeEnum,
  SiteHealthStatus,
  type CheckInConfig,
  type DisplaySiteData,
  type SiteAccount
} from "~/types"
import {
  analyzeAutoDetectError,
  type AutoDetectError
} from "~/utils/autoDetectUtils"

import { getErrorMessage } from "../utils/error.ts"
import { accountStorage } from "./accountStorage"
import {
  extractDefaultExchangeRate,
  fetchAccountData,
  fetchSiteStatus,
  fetchSupportCheckIn,
  fetchUserInfo,
  getOrCreateAccessToken
} from "./apiService"

// 账号验证结果
export interface AccountValidationResult {
  success: boolean
  data?: {
    username: string
    accessToken: string
    userId: string
    exchangeRate: number | null
    checkIn: CheckInConfig
    siteType?: string
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

/**
 * 自动识别账号信息
 * 工作流程：
 * 1. 通过 background script 创建临时窗口访问目标站点
 * 2. 使用 content script 从站点获取用户信息
 * 3. 调用 API 获取访问令牌和账号数据
 * 4. 保存或更新账号信息到本地存储
 * @param url
 * @param authType
 */
export async function autoDetectAccount(
  url: string,
  authType: AuthTypeEnum
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

    let tokenPromise: Promise<any>

    // 根据 authType 选择对应的 Promise
    if (authType === AuthTypeEnum.Cookie) {
      tokenPromise = fetchUserInfo(url, userId)
    } else if (authType === AuthTypeEnum.AccessToken) {
      tokenPromise = getOrCreateAccessToken(url, userId)
    } else {
      // none 或其他情况
      tokenPromise = Promise.resolve(null)
    }

    // 并行执行 token 获取和 site 状态获取
    const [tokenInfo, siteStatus] = await Promise.all([
      tokenPromise,
      fetchSiteStatus(url, authType)
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

    const checkSupport = await fetchSupportCheckIn(url)

    return {
      success: true,
      data: {
        username: detectedUsername,
        accessToken: access_token,
        userId: userId.toString(),
        exchangeRate: defaultExchangeRate,
        checkIn: {
          enableDetection: checkSupport ?? false,
          isCheckedInToday: false,
          customCheckInUrl: ""
        },
        siteType: response.data.siteType
      }
    }
  } catch (error) {
    console.error("自动识别失败:", error)
    const detailedError = analyzeAutoDetectError(error)
    const errorMessage = getErrorMessage(error)
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
  exchangeRate: string,
  notes: string,
  checkInConfig: CheckInConfig,
  siteType: string,
  authType: AuthTypeEnum
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
      accessToken.trim(),
      checkInConfig,
      authType
    )

    const accountData: Omit<SiteAccount, "id" | "created_at" | "updated_at"> = {
      emoji: "", // 不再使用 emoji
      site_name: siteName.trim(),
      site_url: url.trim(),
      health: { status: SiteHealthStatus.Healthy }, // 成功获取数据说明状态正常
      site_type: siteType,
      authType: authType,
      exchange_rate:
        parseFloat(exchangeRate) || UI_CONSTANTS.EXCHANGE_RATE.DEFAULT, // 使用用户输入的汇率
      notes: notes || "",
      checkIn: freshAccountData.checkIn,
      account_info: {
        id: parsedUserId,
        access_token: accessToken.trim(),
        username: username.trim(),
        quota: freshAccountData.quota,
        today_prompt_tokens: freshAccountData.today_prompt_tokens,
        today_completion_tokens: freshAccountData.today_completion_tokens,
        today_quota_consumption: freshAccountData.today_quota_consumption,
        today_requests_count: freshAccountData.today_requests_count,
        today_income: freshAccountData.today_income
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
    const errorMessage = getErrorMessage(error)
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
  exchangeRate: string,
  notes: string,
  checkInConfig: CheckInConfig,
  siteType: string,
  authType: AuthTypeEnum
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
      accessToken.trim(),
      checkInConfig,
      authType
    )

    const updateData: Partial<Omit<SiteAccount, "id" | "created_at">> = {
      site_name: siteName.trim(),
      site_url: url.trim(),
      health: { status: SiteHealthStatus.Healthy }, // 成功获取数据说明状态正常
      site_type: siteType,
      authType: authType,
      exchange_rate:
        parseFloat(exchangeRate) || UI_CONSTANTS.EXCHANGE_RATE.DEFAULT, // 使用用户输入的汇率
      notes: notes,
      checkIn: freshAccountData.checkIn,
      account_info: {
        id: parsedUserId,
        access_token: accessToken.trim(),
        username: username.trim(),
        quota: freshAccountData.quota,
        today_prompt_tokens: freshAccountData.today_prompt_tokens,
        today_completion_tokens: freshAccountData.today_completion_tokens,
        today_quota_consumption: freshAccountData.today_quota_consumption,
        today_requests_count: freshAccountData.today_requests_count,
        today_income: freshAccountData.today_income
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
    const errorMessage = getErrorMessage(error)
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
  // 优先从标题获取
  const tabTitle = tab.title
  if (tabTitle && IsNotDefaultSiteName(tabTitle)) {
    siteName = tabTitle
    return siteName
  }
  const urlObj = new URL(tab.url!)
  // 包含端口
  const hostWithProtocol = `${urlObj.protocol}//${urlObj.host}`
  // 其次从站点状态获取
  const siteStatusInfo = await fetchSiteStatus(hostWithProtocol)
  const systemName = siteStatusInfo?.system_name
  if (systemName && IsNotDefaultSiteName(systemName)) {
    siteName = systemName
  } else {
    // 最后从域名获取
    siteName = extractDomainPrefix(urlObj.hostname)
  }
  return siteName
}

// 验证充值比例是否有效
export function isValidExchangeRate(rate: string): boolean {
  const num = parseFloat(rate)
  return !isNaN(num) && num > 0 && num <= 100
}

// Helper function to validate New API configuration
async function validateNewApiConfig(): Promise<{
  valid: boolean
  errors: string[]
}> {
  const prefs = await userPreferences.getPreferences()
  const errors = []

  if (!prefs.newApiBaseUrl) {
    errors.push("New API 基础 URL 未配置")
  }
  if (!prefs.newApiAdminToken) {
    errors.push("New API 管理员令牌未配置")
  }
  if (!prefs.newApiUserId) {
    errors.push("New API 用户 ID 未配置")
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * 生成默认的令牌信息
 *  该函数会返回一个 CreateTokenRequest 对象，用于生成一个默认的令牌
 *  该令牌的特性是：
 *    - 名称为 "user group (auto)"
 *    - 不限制调用次数
 *    - 永不过期
 *    - 不限制 IP
 *    - 不限制模型
 *    - 不指定分组，为用户分组
 */
function generateDefaultToken(): CreateTokenRequest {
  return {
    name: `user group (auto)`,
    unlimited_quota: true,
    expired_time: -1, // Never expires
    remain_quota: 0,
    allow_ips: "", // No IP restriction
    model_limits_enabled: false,
    model_limits: "", // All models allowed
    // 为空则是跟随用户分组
    group: ""
  }
}

export async function autoConfigToNewApi(
  account: SiteAccount,
  toastId?: string
) {
  const configValidation = await validateNewApiConfig()
  if (!configValidation.valid) {
    return { success: false, message: configValidation.errors.join(", ") }
  }

  const displaySiteData = accountStorage.convertToDisplayData(
    account
  ) as DisplaySiteData

  let lastError: any
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      toast.loading(t("toast.accountOperations.checkingApiKeys"), {
        id: toastId
      })
      // 1. Check for existing API token
      const tokens = await fetchAccountTokens(displaySiteData)
      let apiToken: ApiToken | undefined = tokens[0]

      // 2. Create a new token if one doesn't exist
      if (!apiToken) {
        const newTokenData = generateDefaultToken()
        const createApiTokenRsult = await createApiToken(
          account.site_url,
          account.account_info.id,
          account.account_info.access_token,
          newTokenData
        )
        if (!createApiTokenRsult) {
          return {
            success: false,
            message: t("toast.accountOperations.createTokenFailed")
          }
        }
        // Re-fetch tokens to get the newly created one
        const updatedTokens = await fetchAccountTokens(displaySiteData)
        apiToken = updatedTokens.at(-1)
      }

      if (!apiToken) {
        return {
          success: false,
          message: t("toast.accountOperations.tokenNotFound")
        }
      }

      // 3. Import to New API as a channel
      toast.loading(t("toast.accountOperations.importingToNewApi"), {
        id: toastId
      })
      const importResult = await importToNewApi(displaySiteData, apiToken)

      if (importResult.success) {
        toast.success(importResult.message, { id: toastId })
      } else {
        throw new Error(importResult.message)
      }

      return {
        token: apiToken,
        ...importResult
      }
    } catch (error) {
      lastError = error
      if (
        error instanceof Error &&
        (error.message.includes("network") ||
          error.message.includes("Failed to fetch")) &&
        attempt < 3
      ) {
        toast.error(getErrorMessage(lastError), { id: toastId })
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
        continue
      }
      throw error
    }
  }
  return {
    success: false,
    message: lastError?.message || t("errors.unknown")
  }
}
