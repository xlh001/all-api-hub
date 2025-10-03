import type { SiteType } from "~/constants/siteType"

import * as commonAPI from "./common"
import * as oneHubAPI from "./oneHub"

// 映射表，只放需要覆盖的站点
const siteOverrideMap = {
  oneHub: oneHubAPI
}

// 统一获取函数
function getApiFunc<T extends keyof typeof commonAPI>(
  funcName: T,
  currentSite: SiteType = "default"
): (typeof commonAPI)[T] {
  const overrideModule = siteOverrideMap[currentSite]
  if (overrideModule && funcName in overrideModule) {
    return overrideModule[funcName] as (typeof commonAPI)[T]
  }
  return commonAPI[funcName] as (typeof commonAPI)[T]
}

// ===== 自动生成包装函数 =====
type ApiFuncName = keyof typeof commonAPI
const exportedAPI: Record<ApiFuncName, (...args: any[]) => any> = {} as any

;(Object.keys(commonAPI) as ApiFuncName[]).forEach((funcName) => {
  exportedAPI[funcName] = (...args: any[]) => {
    let currentSite: SiteType = "default"

    // 如果第一个参数是站点名并且在覆盖表里，取它作为 currentSite
    if (typeof args[0] === "string" && args[0] in siteOverrideMap) {
      currentSite = args[0] as SiteType
      args.shift()
    }

    return getApiFunc(funcName, currentSite)(...args)
  }
})

// ===== 导出所有函数 =====
export const {
  fetchUserInfo,
  createAccessToken,
  fetchSiteStatus,
  extractDefaultExchangeRate,
  getOrCreateAccessToken,
  fetchAccountQuota,
  fetchCheckInStatus,
  fetchSupportCheckIn,
  fetchTodayUsage,
  fetchAccountData,
  refreshAccountData,
  validateAccountConnection,
  fetchAccountTokens,
  fetchAvailableModels,
  fetchUserGroups,
  createApiToken,
  fetchTokenById,
  updateApiToken,
  deleteApiToken,
  fetchModelPricing,
  determineHealthStatus
} = exportedAPI
