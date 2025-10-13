import { DONE_HUB, ONE_HUB, type SiteType } from "~/constants/siteType"

import * as commonAPI from "./common"
import * as oneHubAPI from "./oneHub"

// 映射表，只放需要覆盖的站点
const siteOverrideMap = {
  [ONE_HUB]: oneHubAPI,
  [DONE_HUB]: oneHubAPI
}

// 获取对应站点的 API 函数
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

// ===== 使用 Proxy 动态包装 =====
export const exportedAPI = new Proxy(commonAPI, {
  get(target, prop: string) {
    const func = target[prop as keyof typeof target]

    if (typeof func !== "function") return func

    return ((...args: Parameters<typeof func>) => {
      let currentSite: SiteType = "default"
      const lastArg = args[args.length - 1]

      if (typeof lastArg === "string" && lastArg in siteOverrideMap) {
        currentSite = lastArg as SiteType
        args.pop()
      } else {
        for (const arg of args) {
          if (arg && typeof arg === "object" && "siteType" in arg) {
            const candidate = arg.siteType
            if (typeof candidate === "string" && candidate in siteOverrideMap) {
              currentSite = candidate as SiteType
              break
            }
          }
        }
      }

      // @ts-ignore
      return getApiFunc(prop as keyof typeof commonAPI, currentSite)(...args)
    }) as typeof func
  }
}) as {
  [K in keyof typeof commonAPI]: (typeof commonAPI)[K]
}

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
  fetchUpstreamModels,
  fetchUpstreamModelsNameList,
  fetchUserGroups,
  createApiToken,
  fetchTokenById,
  updateApiToken,
  deleteApiToken,
  fetchModelPricing,
  determineHealthStatus
} = exportedAPI
