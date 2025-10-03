import type { PricingResponse } from "~/services/apiService/common/type"
import {
  apiRequest,
  createTokenAuthRequest
} from "~/services/apiService/common/utils"
import { transformModelPricing } from "~/utils/dataTransform/one-hub"
import { joinUrl } from "~/utils/url"

export const fetchModelPricing = async ({
  baseUrl,
  userId,
  token: accessToken
}): Promise<PricingResponse> => {
  try {
    const options = createTokenAuthRequest(userId, accessToken)
    const [availableModel, modelOwnedBy, userGroupMap] = await Promise.all([
      apiRequest(joinUrl(baseUrl, "/api/available_model")),
      apiRequest(joinUrl(baseUrl, "/api/model_ownedby")),
      apiRequest(joinUrl(baseUrl, "/api/user_group_map"))
    ])

    const result = transformModelPricing(
      availableModel,
      modelOwnedBy,
      userGroupMap
    )
    console.log(result)

    return result
  } catch (error) {
    console.error("获取模型定价失败:", error)
    throw error
  }
}
