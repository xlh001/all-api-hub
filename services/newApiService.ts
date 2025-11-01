import { t } from "i18next"
import toast from "react-hot-toast"

import { DEFAULT_CHANNEL_FIELDS } from "~/constants/newApi.ts"
import { ensureAccountApiToken } from "~/services/accountOperations.ts"
import { accountStorage } from "~/services/accountStorage.ts"
import {
  fetchAvailableModels,
  fetchUpstreamModelsNameList
} from "~/services/apiService"
import { ApiError } from "~/services/apiService/common/errors"
import { fetchApi, fetchApiData } from "~/services/apiService/common/utils"
import {
  ApiToken,
  AutoConfigToNewApiResponse,
  DisplaySiteData,
  NewApiChannel,
  NewApiChannelListData,
  SiteAccount
} from "~/types"
import type {
  ChannelCreationPayload,
  ChannelFormData,
  ChannelMode
} from "~/types/newapi"
import type { ServiceResponse } from "~/types/serviceResponse"
import { isArraysEqual } from "~/utils"
import { getErrorMessage } from "~/utils/error"

import { UserPreferences, userPreferences } from "./userPreferences"

function parseDelimitedList(value?: string | null): string[] {
  if (!value) return []
  return value
    .split(/[,]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function normalizeList(values: string[] = []): string[] {
  return Array.from(new Set(values.map((item) => item.trim()).filter(Boolean)))
}

/**
 * 搜索指定关键词的渠道
 * @param baseUrl New API 的基础 URL
 * @param accessToken 管理员令牌
 * @param userId 用户 ID
 * @param keyword 搜索关键词
 */
export async function searchChannel(
  baseUrl: string,
  accessToken: string,
  userId: number | string,
  keyword: string
): Promise<NewApiChannelListData | null> {
  try {
    return await fetchApiData<NewApiChannelListData>({
      baseUrl,
      endpoint: `/api/channel/search?keyword=${keyword}`,
      userId,
      token: accessToken
    })
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`API 请求失败: ${error.message}`)
    } else {
      console.error("搜索渠道失败:", error)
    }
    return null
  }
}

/**
 * 创建新渠道
 * @param baseUrl New API 的基础 URL
 * @param adminToken 管理员令牌
 * @param userId 用户 ID
 * @param channelData 渠道数据
 */
export async function createChannel(
  baseUrl: string,
  adminToken: string,
  userId: number | string,
  channelData: ChannelCreationPayload
) {
  try {
    channelData.channel.group = channelData.channel.groups.join(",")
    return await fetchApi<void>({
      baseUrl,
      endpoint: "/api/channel",
      userId,
      token: adminToken,
      options: {
        method: "POST",
        body: JSON.stringify(channelData)
      }
    })
  } catch (error) {
    console.error("创建渠道失败:", error)
    throw new Error("创建渠道失败，请检查网络或 New API 配置。")
  }
}

export function hasValidNewApiConfig(
  prefs: Partial<UserPreferences>
): prefs is Required<
  Pick<UserPreferences, "newApiBaseUrl" | "newApiAdminToken" | "newApiUserId">
> {
  const { newApiBaseUrl, newApiAdminToken, newApiUserId } = prefs
  return Boolean(newApiBaseUrl && newApiAdminToken && newApiUserId)
}

/**
 * Validate New API configuration
 */
export async function checkValidNewApiConfig(): Promise<boolean> {
  try {
    const prefs = await userPreferences.getPreferences()
    return hasValidNewApiConfig(prefs)
  } catch (error) {
    console.error("[NewAPI] Error checking config:", error)
    return false
  }
}

/**
 * Get New API configuration from user preferences
 */
export async function getNewApiConfig(): Promise<{
  baseUrl: string
  token: string
  userId: string
} | null> {
  try {
    const prefs = await userPreferences.getPreferences()
    if (hasValidNewApiConfig(prefs)) {
      return {
        baseUrl: prefs.newApiBaseUrl,
        token: prefs.newApiAdminToken,
        userId: prefs.newApiUserId
      }
    }
    return null
  } catch (error) {
    console.error("[NewAPI] Error getting config:", error)
    return null
  }
}

/**
 * Common model names as suggestions (fallback)
 */
export function getCommonModelSuggestions(): string[] {
  return [
    "gpt-4o",
    "gpt-4o-mini",
    "gpt-4-turbo",
    "gpt-4",
    "gpt-3.5-turbo",
    "o1",
    "o1-mini",
    "o1-preview",
    "o3-mini",
    "claude-3-5-sonnet-20241022",
    "claude-3-5-haiku-20241022",
    "claude-3-opus-20240229",
    "claude-3-sonnet-20240229",
    "claude-3-haiku-20240307",
    "gemini-2.0-flash-exp",
    "gemini-1.5-pro",
    "gemini-1.5-flash",
    "deepseek-chat",
    "deepseek-coder",
    "grok-2",
    "llama-3.3-70b",
    "qwen-max",
    "glm-4"
  ]
}

/**
 * 获取账号支持的模型列表
 */
export async function fetchAccountAvailableModels(
  account: DisplaySiteData,
  token: ApiToken
): Promise<string[]> {
  const candidateSources: string[][] = []

  const tokenModelList = parseDelimitedList(token.models)
  if (tokenModelList.length > 0) {
    candidateSources.push(tokenModelList)
  }

  const upstreamModels = await fetchUpstreamModelsNameList({
    baseUrl: account.baseUrl,
    apiKey: token.key
  })
  if (upstreamModels && upstreamModels.length > 0) {
    candidateSources.push(upstreamModels)
  }

  const fallbackModels = await fetchAvailableModels(account)
  if (fallbackModels && fallbackModels.length > 0) {
    candidateSources.push(fallbackModels)
  }

  const merged = candidateSources.flat()
  return normalizeList(merged)
}

/**
 * 构建默认渠道名称
 */
export function buildChannelName(
  account: DisplaySiteData,
  token: ApiToken
): string {
  let channelName = `${account.name} | ${token.name}`.trim()
  if (!channelName.endsWith("(auto)")) {
    channelName += " (auto)"
  }
  return channelName
}

/**
 * 构建渠道表单默认值
 */
export async function prepareChannelFormData(
  account: DisplaySiteData,
  token: ApiToken,
  overrides: Partial<ChannelFormData> = {}
): Promise<ChannelFormData> {
  const availableModels = await fetchAccountAvailableModels(account, token)

  if (!availableModels.length) {
    throw new Error(t("messages:newapi.noAnyModels"))
  }

  const resolvedGroups = token.group
    ? [token.group]
    : [...DEFAULT_CHANNEL_FIELDS.groups]

  return {
    name: overrides.name ?? buildChannelName(account, token),
    type: overrides.type ?? DEFAULT_CHANNEL_FIELDS.type,
    key: overrides.key ?? token.key,
    base_url: overrides.base_url ?? account.baseUrl,
    models: normalizeList(
      overrides.models ? [...overrides.models] : availableModels
    ),
    groups: normalizeList(
      overrides.groups ? [...overrides.groups] : resolvedGroups
    ),
    priority: overrides.priority ?? DEFAULT_CHANNEL_FIELDS.priority,
    weight: overrides.weight ?? DEFAULT_CHANNEL_FIELDS.weight,
    status: overrides.status ?? DEFAULT_CHANNEL_FIELDS.status
  }
}

/**
 * 构建渠道创建 payload
 */
export function buildChannelPayload(
  formData: ChannelFormData,
  mode: ChannelMode = DEFAULT_CHANNEL_FIELDS.mode
): ChannelCreationPayload {
  const trimmedBaseUrl = formData.base_url?.trim()
  const groups = normalizeList(
    formData.groups && formData.groups.length > 0
      ? [...formData.groups]
      : [...DEFAULT_CHANNEL_FIELDS.groups]
  )
  const models = normalizeList(formData.models ?? [])

  return {
    mode,
    channel: {
      name: formData.name.trim(),
      type: formData.type,
      key: formData.key.trim(),
      base_url: trimmedBaseUrl || undefined,
      models: models.join(","),
      groups,
      priority: formData.priority,
      weight: formData.weight,
      status: formData.status
    }
  }
}

/**
 * 查找是否存在匹配的渠道
 */
export async function findMatchingChannel(
  baseUrl: string,
  adminToken: string,
  userId: number | string,
  accountBaseUrl: string,
  models: string[]
): Promise<NewApiChannel | null> {
  const searchResults = await searchChannel(
    baseUrl,
    adminToken,
    userId,
    accountBaseUrl
  )

  if (!searchResults) {
    return null
  }

  return (
    searchResults.items.find(
      (channel) =>
        channel.base_url === accountBaseUrl &&
        isArraysEqual(channel.models.split(","), models)
    ) ?? null
  )
}

/**
 * Additional options for importToNewApi to allow customization.
 */
export interface ImportToNewApiOptions {
  formOverrides?: Partial<ChannelFormData>
  mode?: ChannelMode
  skipExistingCheck?: boolean
}

/**
 * 将账户导入到 New API
 * @param account 站点数据
 * @param token API 令牌
 */
export async function importToNewApi(
  account: DisplaySiteData,
  token: ApiToken
): Promise<ServiceResponse<void>> {
  try {
    const prefs = await userPreferences.getPreferences()

    if (!hasValidNewApiConfig(prefs)) {
      return {
        success: false,
        message: t("messages:newapi.configMissing")
      }
    }

    const { newApiBaseUrl, newApiAdminToken, newApiUserId } = prefs

    const formData = await prepareChannelFormData(account, token)

    const existingChannel = await findMatchingChannel(
      newApiBaseUrl,
      newApiAdminToken,
      newApiUserId,
      account.baseUrl,
      formData.models
    )

    if (existingChannel) {
      return {
        success: false,
        message: t("messages:newapi.channelExists", {
          channelName: existingChannel.name
        })
      }
    }

    const payload = buildChannelPayload(formData)

    const createdChannelResponse = await createChannel(
      newApiBaseUrl,
      newApiAdminToken,
      newApiUserId,
      payload
    )

    if (createdChannelResponse.success) {
      return {
        success: true,
        message: t("messages:newapi.importSuccess", {
          channelName: formData.name
        })
      }
    }

    return {
      success: false,
      message: createdChannelResponse.message
    }
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error) || t("messages:newapi.importFailed")
    }
  }
}

// Helper function to validate New API configuration
async function validateNewApiConfig(): Promise<{
  valid: boolean
  errors: string[]
}> {
  const prefs = await userPreferences.getPreferences()
  const errors = []

  if (!prefs.newApiBaseUrl) {
    errors.push(t("messages:errors.validation.newApiBaseUrlRequired"))
  }
  if (!prefs.newApiAdminToken) {
    errors.push(t("messages:errors.validation.newApiAdminTokenRequired"))
  }
  if (!prefs.newApiUserId) {
    errors.push(t("messages:errors.validation.newApiUserIdRequired"))
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

export async function autoConfigToNewApi(
  account: SiteAccount,
  toastId?: string
): Promise<AutoConfigToNewApiResponse<{ token?: ApiToken }>> {
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
      const apiToken = await ensureAccountApiToken(
        account,
        displaySiteData,
        toastId
      )

      // 3. Import to New API as a channel
      toast.loading(t("messages:accountOperations.importingToNewApi"), {
        id: toastId
      })
      const importResult = await importToNewApi(displaySiteData, apiToken)

      if (importResult.success) {
        toast.success(importResult.message, { id: toastId })
      } else {
        throw new Error(importResult.message)
      }

      return {
        success: importResult.success,
        message: importResult.message,
        data: { token: apiToken }
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
    message: lastError?.message || t("messages:errors.unknown")
  }
}
