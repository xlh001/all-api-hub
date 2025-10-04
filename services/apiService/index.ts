import { DONE_HUB, ONE_HUB, type SiteType } from "~/constants/siteType"

import * as commonAPI from "./common"
import * as oneHubAPI from "./oneHub"

// 映射表，只放需要覆盖的站点
const siteOverrideMap = {
  [ONE_HUB]: oneHubAPI,
  [DONE_HUB]: oneHubAPI
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

// ===== 自动生成包装函数，站点参数放最后 =====
type ApiFuncName = keyof typeof commonAPI
const exportedAPI: Record<ApiFuncName, (...args: any[]) => any> = {} as any

;(Object.keys(commonAPI) as ApiFuncName[]).forEach((funcName) => {
  exportedAPI[funcName] = (...args: any[]) => {
    // 最后一个参数如果是 SiteType 并在覆盖表里，就当作 currentSite
    let currentSite: SiteType = "default"
    const lastArg = args[args.length - 1]
    if (typeof lastArg === "string" && lastArg in siteOverrideMap) {
      currentSite = lastArg as SiteType
      args.pop() // 移除站点参数
    } else {
      // 2. 如果不行，从第一个参数开始查找对象的 siteType 属性
      for (let i = 0; i < args.length; i++) {
        const arg = args[i]
        if (arg && typeof arg === "object" && "siteType" in arg) {
          const candidate = arg.siteType
          if (typeof candidate === "string" && candidate in siteOverrideMap) {
            currentSite = candidate as SiteType
            break
          }
        }
      }
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
