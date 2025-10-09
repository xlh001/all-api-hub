import { fetchAvailableModels } from "~/services/apiService/common"
import type { ApiToken, DisplaySiteData } from "~/types"

import { userPreferences } from "./userPreferences"

// 新 API 的返回类型定义
interface NewApiChannel {
  id: number
  type: number
  key: string
  name: string
  base_url: string
  models: string[]
  groups: string[]
}

interface NewApiChannelData {
  items: NewApiChannel[]
  total: number
  type_counts: Record<string, number>
}

interface NewApiResponse<T> {
  success: boolean
  message: string
  data: T
}

/**
 * 搜索指定关键词的渠道
 * @param baseUrl New API 的基础 URL
 * @param adminToken 管理员令牌
 * @param userId 用户 ID
 * @param keyword 搜索关键词
 */
export async function searchChannel(
  baseUrl: string,
  adminToken: string,
  userId: string,
  keyword: string
) {
  try {
    const response = await fetch(
      `${baseUrl}/api/channel/search?keyword=${keyword}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "New-Api-User": userId
        }
      }
    )

    if (!response.ok) {
      throw new Error(`网络响应错误: ${response.statusText}`)
    }

    const result: NewApiResponse<NewApiChannelData> = await response.json()
    if (result.success) {
      return result.data
    }
    return null
  } catch (error) {
    console.error("搜索渠道失败:", error)
    throw new Error("搜索渠道失败，请检查网络或 New API 配置。")
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
  userId: string,
  channelData: object
): Promise<NewApiChannel> {
  try {
    const response = await fetch(`${baseUrl}/api/channel/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
        "New-Api-User": userId
      },
      body: JSON.stringify(channelData)
    })

    if (!response.ok) {
      throw new Error(`网络响应错误: ${response.statusText}`)
    }

    const result: NewApiResponse<NewApiChannel> = await response.json()
    if (result.success) {
      return result.data
    }
    throw new Error(result.message || "创建渠道失败。")
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
): Promise<{ success: boolean; message: string }> {
  try {
    const prefs = await userPreferences.getPreferences()
    const { newApiBaseUrl, newApiAdminToken, newApiUserId } = prefs

    if (!newApiBaseUrl || !newApiAdminToken || !newApiUserId) {
      return {
        success: false,
        message: "请先在基础设置中配置 New API 的地址、管理员令牌和用户 ID。"
      }
    }

    // 1. 搜索现有渠道
    const searchResults = await searchChannel(
      newApiBaseUrl,
      newApiAdminToken,
      newApiUserId,
      account.baseUrl
    )

    // 2. 检查是否有匹配的渠道
    if (searchResults.total > 0) {
      const existingChannel = searchResults.items.find(
        (channel) => channel.base_url === account.baseUrl
      )
      if (existingChannel) {
        return {
          success: true,
          message: `渠道 ${existingChannel.name} 已存在，无需重复导入。`
        }
      }
    }

    const availableModels = await fetchAvailableModels({
      baseUrl: account.baseUrl,
      userId: account.userId,
      token: account.token
    })

    // 3. 如果没有匹配项，则创建新渠道
    const newChannelData = {
      mode: "single",
      channel: {
        name: `${account.name} - ${token.name}`,
        type: 1, // 默认为 OpenAI 类型
        key: token.key,
        base_url: account.baseUrl,
        models: availableModels ? availableModels.join(",") : "",
        groups: token.group ? [token.group] : ["default"],
        priority: 0,
        weight: 0
      }
    }

    const createdChannel = await createChannel(
      newApiBaseUrl,
      newApiAdminToken,
      newApiUserId,
      newChannelData
    )

    return {
      success: true,
      message: `成功导入新渠道 ${createdChannel.name}。`
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || "导入失败，发生未知错误。"
    }
  }
}
