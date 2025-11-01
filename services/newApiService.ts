import { t } from "i18next"

import {
  DEFAULT_CHANNEL_FIELDS,
  DEFAULT_CHANNEL_MODE,
  resolveChannelTypeForSite
} from "~/config/channelDefaults"
import {
  fetchAvailableModels,
  fetchUpstreamModelsNameList
} from "~/services/apiService"
import { ApiError } from "~/services/apiService/common/errors"
import { fetchApi, fetchApiData } from "~/services/apiService/common/utils"
import type { ApiToken, DisplaySiteData } from "~/types"
import type {
  ChannelCreationPayload,
  ChannelFormData,
  ChannelMode
} from "~/types/newapi"
import type { ServiceResponse } from "~/types/serviceResponse"
import { isArraysEqual } from "~/utils"
import { getErrorMessage } from "~/utils/error"

import { UserPreferences, userPreferences } from "./userPreferences"

// 新 API 的返回类型定义
export interface NewApiChannel {
  id: number
  type: number
  key: string
  name: string
  base_url: string
  // models 是逗号分隔的字符串,示例: "gpt-3.5-turbo,gpt-4"
  models: string
  // groups 是逗号分隔的字符串,示例: "default,group1"
  groups: string
}

interface NewApiChannelData {
  items: NewApiChannel[]
  total: number
  type_counts: Record<string, number>
}

function parseDelimitedList(value?: string | null): string[] {
  if (!value) return []
  return value
    .split(/[,
]/)
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
): Promise<NewApiChannelData | null> {
  try {
    return await fetchApiData<NewApiChannelData>({
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
export function buildChannelName(account: DisplaySiteData, token: ApiToken): string {
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

  const baseForm: ChannelFormData = {
    name: overrides.name ?? buildChannelName(account, token),
    type: overrides.type ?? resolveChannelTypeForSite(account.siteType),
    key: overrides.key ?? token.key,
    base_url: overrides.base_url ?? account.baseUrl,
    models: normalizeList(overrides.models ? [...overrides.models] : availableModels),
    groups: normalizeList(overrides.groups ? [...overrides.groups] : resolvedGroups),
    priority: overrides.priority ?? DEFAULT_CHANNEL_FIELDS.priority,
    weight: overrides.weight ?? DEFAULT_CHANNEL_FIELDS.weight,
    status: overrides.status ?? DEFAULT_CHANNEL_FIELDS.status
  }

  return baseForm
}

/**
 * 构建渠道创建 payload
 */
export function buildChannelPayload(
  formData: ChannelFormData,
  mode: ChannelMode = DEFAULT_CHANNEL_MODE
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
  token: ApiToken,
  options: ImportToNewApiOptions = {}
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

    const formData = await prepareChannelFormData(
      account,
      token,
      options.formOverrides ?? {}
    )

    if (!options.skipExistingCheck) {
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
    }

    const payload = buildChannelPayload(
      formData,
      options.mode ?? DEFAULT_CHANNEL_MODE
    )

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
