import { getSiteApiRouter } from "~/constants/siteType"
import type { DisplaySiteData } from "~/types"
import { isExtensionPopup, OPTIONS_PAGE_URL } from "~/utils/browser.ts"
import {
  createTab as createTabApi,
  focusTab,
  getExtensionURL
} from "~/utils/browserApi"
import { joinUrl } from "~/utils/url"

export function closeIfPopup() {
  if (isExtensionPopup()) {
    window.close()
  }
}

/**
 * Creates a new tab with the specified URL
 * @param url - The URL to open in the new tab
 */
const createActiveTab = async (url: string): Promise<void> => {
  await createTabApi(url, true)
}

/**
 * Updates an existing tab with the provided update info
 * @param tabId - The ID of the tab to update
 * @param updateInfo - The properties to update on the tab
 */
const updateTab = async (
  tabId: number,
  updateInfo: browser.tabs._UpdateUpdateProperties
): Promise<void> => {
  await browser.tabs.update(tabId, updateInfo)
}

/**
 * Focuses a window by bringing it to the foreground
 * @param tab
 */
const focusWindow = async (tab: browser.tabs.Tab) => {
  await focusTab(tab)
}

/**
 * Queries tabs based on the provided query criteria with error handling
 * @param queryInfo - The query criteria for filtering tabs
 * @param callback - Function to execute with the query results
 */
const queryTabs = async (
  queryInfo: browser.tabs._QueryQueryInfo,
  callback: (tabs: browser.tabs.Tab[]) => void
): Promise<void> => {
  try {
    const tabs = await browser.tabs.query(queryInfo)
    if (tabs) {
      callback(tabs)
    }
  } catch (error) {
    console.error(error)
  }
}

export const openOrFocusOptionsPage = (hash: string) => {
  const baseUrl = `${OPTIONS_PAGE_URL}${hash}`

  queryTabs({}, (tabs) => {
    // 查找是否已存在忽略查询参数的 options 页
    const optionsPageTab = tabs.find((tab) => {
      if (!tab.url) return false
      try {
        const tabUrl = new URL(tab.url)
        const normalizedUrl = `${tabUrl.origin}${tabUrl.pathname}${tabUrl.hash}`
        return normalizedUrl === baseUrl
      } catch {
        return false
      }
    })

    let urlWithHash: string

    if (optionsPageTab) {
      // 已存在 → 加上 refresh 参数以强制刷新
      const url = new URL(baseUrl)
      url.searchParams.set("refresh", "true")
      url.searchParams.set("t", Date.now().toString())
      urlWithHash = url.href
    } else {
      // 不存在 → 直接使用基础 URL
      urlWithHash = baseUrl
    }

    // 打开或聚焦
    if (optionsPageTab?.id) {
      updateTab(optionsPageTab.id, { active: true, url: urlWithHash })
      focusWindow(optionsPageTab)
    } else {
      createActiveTab(urlWithHash)
    }
  })
}

export const openFullManagerPage = () => {
  openOrFocusOptionsPage("#account")
  closeIfPopup()
}

export const openSettingsPage = () => {
  openOrFocusOptionsPage("#basic")
  if (isExtensionPopup()) {
    closeIfPopup()
  }
}

export const openSidePanel = async () => {
  await browser.sidebarAction.open()
  closeIfPopup()
}

export const openKeysPage = async (accountId?: string) => {
  const url = accountId
    ? getExtensionURL(`options.html#keys?accountId=${accountId}`)
    : getExtensionURL("options.html#keys")
  await createActiveTab(url)
  closeIfPopup()
}

export const openModelsPage = async (accountId?: string) => {
  const url = accountId
    ? getExtensionURL(`options.html#models?accountId=${accountId}`)
    : getExtensionURL("options.html#models")
  await createActiveTab(url)
  closeIfPopup()
}

export const openUsagePage = async (account: DisplaySiteData) => {
  const logUrl = joinUrl(
    account.baseUrl,
    getSiteApiRouter(account.siteType).usagePath
  )
  await createActiveTab(logUrl)
  closeIfPopup()
}

export const openCheckInPage = async (
  account: DisplaySiteData,
  targetUrl?: string
) => {
  const checkInUrl =
    targetUrl ||
    joinUrl(account.baseUrl, getSiteApiRouter(account.siteType).checkInPath)
  await createActiveTab(checkInUrl)
  closeIfPopup()
}

export const openRedeemPage = async (account: DisplaySiteData) => {
  const redeemPath =
    account.checkIn?.customRedeemPath ||
    getSiteApiRouter(account.siteType).redeemPath
  const redeemUrl = joinUrl(account.baseUrl, redeemPath)
  await createActiveTab(redeemUrl)
  closeIfPopup()
}
