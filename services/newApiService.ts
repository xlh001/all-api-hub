import { t } from "i18next"

import {
  fetchAvailableModels,
  fetchUpstreamModelsNameList
} from "~/services/apiService"
import { ApiError } from "~/services/apiService/common/errors"
import { fetchApi, fetchApiData } from "~/services/apiService/common/utils"
import type { ApiToken, DisplaySiteData } from "~/types"
import type { NewApiResponse, ServiceResponse } from "~/types/serviceResponse"
import { isArraysEqual, isNotEmptyArray } from "~/utils"

import { userPreferences } from "./userPreferences"

// 新 API 的返回类型定义
interface NewApiChannel {
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
  channelData: object
) {
  try {
    return await fetchApi<NewApiResponse<undefined>>({
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
    const { newApiBaseUrl, newApiAdminToken, newApiUserId } = prefs

    if (!newApiBaseUrl || !newApiAdminToken || !newApiUserId) {
      return {
        success: false,
        message: t("messages:newapi.configMissing")
      }
    }

    // 搜索现有渠道
    const searchResults = await searchChannel(
      newApiBaseUrl,
      newApiAdminToken,
      newApiUserId,
      account.baseUrl
    )

    if (!searchResults) {
      return {
        success: false,
        message: t("messages:newapi.dataFetchFailed")
      }
    }

    // 获取账户支持的模型列表
    const availableModels =
      (await fetchUpstreamModelsNameList({
        baseUrl: account.baseUrl,
        apiKey: token.key
      })) ?? (await fetchAvailableModels(account))

    // 检查是否有匹配的渠道
    if (searchResults.total > 0) {
      const existingChannel = searchResults.items.find(
        (channel) =>
          channel.base_url === account.baseUrl &&
          isArraysEqual(channel.models.split(","), availableModels)
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

    if (availableModels.length === 0) {
      return {
        success: false,
        message: t("messages:newapi.noAnyModels")
      }
    }

    let newChannelName = `${account.name} | ${token.name}`.trim()
    if (!newChannelName.endsWith("(auto)")) {
      newChannelName += " (auto)"
    }

    // 如果没有匹配项，则创建新渠道
    const newChannelData = {
      mode: "single",
      channel: {
        name: newChannelName,
        type: 1, // 默认为 OpenAI 类型
        key: token.key,
        base_url: account.baseUrl,
        models: isNotEmptyArray(availableModels)
          ? availableModels.join(",")
          : "",
        groups: token.group ? [token.group] : ["default"],
        priority: 0,
        weight: 0
      }
    }

    const createdChannelResponse = await createChannel(
      newApiBaseUrl,
      newApiAdminToken,
      newApiUserId,
      newChannelData
    )

    if (createdChannelResponse.success) {
      return {
        success: true,
        message: t("messages:newapi.importSuccess", {
          channelName: newChannelName
        })
      }
    } else {
      return {
        success: false,
        message: createdChannelResponse.message
      }
    }
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error) || t("messages:newapi.importFailed")
    }
  }
}
