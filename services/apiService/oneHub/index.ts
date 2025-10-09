import type {
  BaseFetchParams,
  PricingResponse
} from "~/services/apiService/common/type"
import {
  apiRequestData,
  createTokenAuthRequest,
  fetchApi
} from "~/services/apiService/common/utils"
import type {
  OneHubModelPricing,
  OneHubUserGroupInfo,
  OneHubUserGroupMap,
  OneHubUserGroupsResponse,
  PaginatedTokenDate
} from "~/services/apiService/oneHub/type"
import type { ApiToken } from "~/types"
import {
  transformModelPricing,
  transformUserGroup
} from "~/utils/dataTransform/one-hub"
import { joinUrl } from "~/utils/url"

export const fetchAvailableModel = async (params: BaseFetchParams) => {
  return fetchApi<OneHubModelPricing>({
    ...params,
    endpoint: "/api/available_model"
  })
}

export const fetchUserGroupMap = async (params: BaseFetchParams) => {
  return fetchApi<OneHubUserGroupMap>({
    ...params,
    endpoint: "/api/user_group_map"
  })
}
export const fetchModelPricing = async (
  params: BaseFetchParams
): Promise<PricingResponse> => {
  try {
    const [availableModel, userGroupMap] = await Promise.all([
      fetchAvailableModel(params),
      fetchUserGroupMap(params)
    ])

    const result = transformModelPricing(availableModel, userGroupMap)
    console.log(result)

    return result
  } catch (error) {
    console.error("获取模型定价失败:", error)
    throw error
  }
}

/**
 * 获取账号令牌列表
 */
export const fetchAccountTokens = async (
  { baseUrl, userId, token: accessToken },
  page: number = 0,
  size: number = 100
): Promise<ApiToken[]> => {
  const params = new URLSearchParams({
    p: page.toString(),
    size: size.toString()
  })

  const url = joinUrl(baseUrl, `/api/token/?${params.toString()}`)
  const options = createTokenAuthRequest(userId, accessToken)

  try {
    // 尝试获取响应数据，可能是直接的数组或者分页对象
    const tokensData = await apiRequestData<PaginatedTokenDate>(
      url,
      options,
      "/api/token"
    )

    // 处理不同的响应格式
    if (Array.isArray(tokensData)) {
      // 直接返回数组格式
      return tokensData
    } else if (
      tokensData &&
      typeof tokensData === "object" &&
      "data" in tokensData
    ) {
      // 分页格式，返回 data 数组
      return tokensData.data || []
    } else {
      // 其他情况，返回空数组
      console.warn("Unexpected token response format:", tokensData)
      return []
    }
  } catch (error) {
    console.error("获取令牌列表失败:", error)
    throw error
  }
}

/**
 * 获取用户分组信息
 */
export const fetchUserGroups = async ({
  baseUrl,
  userId,
  token: accessToken
}): Promise<Record<string, OneHubUserGroupInfo>> => {
  const url = joinUrl(baseUrl, "/api/user_group_map")
  const options = createTokenAuthRequest(userId, accessToken)

  try {
    const response = await apiRequestData<OneHubUserGroupsResponse["data"]>(
      url,
      options,
      "/api/user_group_map"
    )
    return transformUserGroup(response)
  } catch (error) {
    console.error("获取分组信息失败:", error)
    throw error
  }
}

/**
 * 获取可用模型列表
 */
export const fetchAvailableModels = async (params: BaseFetchParams) => {
  const availableModel = await fetchAvailableModel(params)
  return Object.keys(availableModel)
}
