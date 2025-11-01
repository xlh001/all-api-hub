/**
 * New API Site Metadata Service
 * Fetches groups and models from configured New API sites
 */

import { fetchApi } from "~/services/apiService/common/utils"
import { userPreferences } from "~/services/userPreferences"
import type { ChannelGroup, ChannelModel } from "~/types/newapi"

interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
}

async function resolveConfig(baseUrl?: string, token?: string, userId?: string) {
  if (baseUrl && token) {
    return { baseUrl, token, userId }
  }

  const prefs = await userPreferences.getPreferences()
  return {
    baseUrl: baseUrl || prefs.newApiBaseUrl,
    token: token || prefs.newApiAdminToken,
    userId: userId || prefs.newApiUserId
  }
}

function mapGroups(groups: string[] | ChannelGroup[] | undefined): ChannelGroup[] {
  if (!groups) return []
  if (typeof groups[0] === "string") {
    return (groups as string[]).map((name) => ({ id: name, name }))
  }
  return groups as ChannelGroup[]
}

function mapModels(models: Array<string | ChannelModel> | undefined): ChannelModel[] {
  if (!models) return []
  return models.map((item) =>
    typeof item === "string"
      ? { id: item, name: item }
      : { id: item.id || item.name, name: item.name, provider: item.provider }
  )
}

/**
 * Get available groups from New API site
 */
export async function getNewApiGroups(
  baseUrl?: string,
  token?: string,
  userId?: string
): Promise<ChannelGroup[]> {
  try {
    const config = await resolveConfig(baseUrl, token, userId)

    if (!config.baseUrl || !config.token) {
      console.warn("[NewAPI] Missing baseUrl or token for fetching groups")
      return []
    }

    const response = await fetchApi<ApiResponse<string[] | ChannelGroup[]>>(
      {
        baseUrl: config.baseUrl,
        endpoint: "/api/group",
        token: config.token,
        userId: config.userId
      },
      false
    )

    if (response.success) {
      return mapGroups(response.data)
    }

    console.warn("[NewAPI] Failed to fetch groups:", response.message)
    return []
  } catch (error) {
    console.error("[NewAPI] Error fetching groups:", error)
    return []
  }
}

/**
 * Get available models from New API site
 */
export async function getNewApiModels(
  baseUrl?: string,
  token?: string,
  userId?: string
): Promise<ChannelModel[]> {
  try {
    const config = await resolveConfig(baseUrl, token, userId)

    if (!config.baseUrl || !config.token) {
      console.warn("[NewAPI] Missing baseUrl or token for fetching models")
      return []
    }

    const response = await fetchApi<ApiResponse<Array<string | ChannelModel>>>(
      {
        baseUrl: config.baseUrl,
        endpoint: "/api/model",
        token: config.token,
        userId: config.userId
      },
      false
    )

    if (response.success) {
      return mapModels(response.data)
    }

    console.warn("[NewAPI] Failed to fetch models:", response.message)
    return []
  } catch (error) {
    console.error("[NewAPI] Error fetching models:", error)
    return []
  }
}

/**
 * Fetch models for a specific channel
 */
export async function fetchChannelModels(
  channelId: number,
  baseUrl?: string,
  token?: string,
  userId?: string
): Promise<ChannelModel[]> {
  try {
    const config = await resolveConfig(baseUrl, token, userId)

    if (!config.baseUrl || !config.token) {
      throw new Error("Missing baseUrl or token for fetching channel models")
    }

    const response = await fetchApi<ApiResponse<Array<string | ChannelModel>>>(
      {
        baseUrl: config.baseUrl,
        endpoint: `/api/channel/fetch_models/${channelId}`,
        token: config.token,
        userId: config.userId
      },
      false
    )

    if (response.success) {
      return mapModels(response.data)
    }

    throw new Error(response.message || "Failed to fetch channel models")
  } catch (error) {
    console.error("[NewAPI] Error fetching channel models:", error)
    throw error
  }
}

/**
 * Get common model names as suggestions (fallback)
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
 * Validate New API configuration
 */
export async function hasValidNewApiConfig(): Promise<boolean> {
  try {
    const prefs = await userPreferences.getPreferences()
    return Boolean(
      prefs.newApiBaseUrl && prefs.newApiAdminToken && prefs.newApiUserId
    )
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
    if (prefs.newApiBaseUrl && prefs.newApiAdminToken && prefs.newApiUserId) {
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
