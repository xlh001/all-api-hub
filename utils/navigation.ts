import { getSiteApiRouter } from "~/constants/siteType"
import type { DisplaySiteData } from "~/types"
import { joinUrl } from "~/utils/url"

import getURL = chrome.runtime.getURL

const OPTIONS_PAGE_URL = chrome.runtime.getURL("options.html")

/**
 * Creates a new tab with the specified URL
 * @param url - The URL to open in the new tab
 */
const createTab = async (url: string): Promise<void> => {
  await browser.tabs.create({ url, active: true })
}

/**
 * Updates an existing tab with the provided update info
 * @param tabId - The ID of the tab to update
 * @param updateInfo - The properties to update on the tab
 */
const updateTab = async (
  tabId: number,
  updateInfo: chrome.tabs.UpdateProperties
): Promise<void> => {
  await browser.tabs.update(tabId, updateInfo)
}

/**
 * Focuses a window by bringing it to the foreground
 * @param tab
 */
const focusWindow = async (tab: browser.tabs.Tab) => {
  // 先聚焦窗口 （Android 不支持 windows API
  if (tab.windowId != null) {
    await browser.windows.update(tab.windowId, { focused: true })
  }
  // 再激活 tab
  if (tab.id != null) {
    await browser.tabs.update(tab.id, { active: true })
  }
}

/**
 * Queries tabs based on the provided query criteria with error handling
 * @param queryInfo - The query criteria for filtering tabs
 * @param callback - Function to execute with the query results
 */
const queryTabs = async (
  queryInfo: chrome.tabs.QueryInfo,
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
      createTab(urlWithHash)
    }
  })
}

export const openFullManagerPage = () => {
  openOrFocusOptionsPage("#account")
}

export const openSettingsPage = () => {
  openOrFocusOptionsPage("#basic")
}

export const openSidePanel = () => {
  browser.sidebarAction.open()
  window.close()
}

export const openKeysPage = async (accountId?: string) => {
  const url = accountId
    ? getURL(`options.html#keys?accountId=${accountId}`)
    : getURL("options.html#keys")
  await createTab(url)
}

export const openModelsPage = async (accountId?: string) => {
  const url = accountId
    ? getURL(`options.html#models?accountId=${accountId}`)
    : getURL("options.html#models")
  await createTab(url)
}

export const openUsagePage = async (account: DisplaySiteData) => {
  const logUrl = joinUrl(
    account.baseUrl,
    getSiteApiRouter(account.siteType).usagePath
  )
  await createTab(logUrl)
}

export const openCheckInPage = async (
  account: DisplaySiteData,
  targetUrl?: string
) => {
  const checkInUrl =
    targetUrl ||
    joinUrl(account.baseUrl, getSiteApiRouter(account.siteType).checkInPath)
  await createTab(checkInUrl)
}
