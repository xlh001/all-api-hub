import { getSiteApiRouter } from "~/constants/siteType"
import type { DisplaySiteData } from "~/types"
import { joinUrl } from "~/utils/url"

import getURL = chrome.runtime.getURL

const OPTIONS_PAGE_URL = chrome.runtime.getURL("options.html")

/**
 * Chrome API Wrapper Functions
 * These functions encapsulate direct Chrome API calls to reduce coupling
 * and provide consistent error handling across the codebase.
 */

/**
 * Handles Chrome API errors
 */
const handleChromeError = () => {
  if (chrome.runtime.lastError) {
    console.error(chrome.runtime.lastError.message)
  }
}

/**
 * Creates a new tab with the specified URL
 * @param url - The URL to open in the new tab
 */
const createTab = (url: string): void => {
  chrome.tabs.create({ url }, handleChromeError)
}

/**
 * Updates an existing tab with the provided update info
 * @param tabId - The ID of the tab to update
 * @param updateInfo - The properties to update on the tab
 */
const updateTab = (
  tabId: number,
  updateInfo: chrome.tabs.UpdateProperties
): void => {
  chrome.tabs.update(tabId, updateInfo, handleChromeError)
}

/**
 * Focuses a window by bringing it to the foreground
 * @param windowId - The ID of the window to focus
 */
const focusWindow = (windowId: number): void => {
  chrome.windows.update(windowId, { focused: true }, handleChromeError)
}

/**
 * Queries tabs based on the provided query criteria with error handling
 * @param queryInfo - The query criteria for filtering tabs
 * @param callback - Function to execute with the query results
 */
const queryTabs = (
  queryInfo: chrome.tabs.QueryInfo,
  callback: (tabs: chrome.tabs.Tab[]) => void
): void => {
  chrome.tabs.query(queryInfo, (tabs) => {
    handleChromeError()
    if (tabs) {
      callback(tabs)
    }
  })
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
      if (optionsPageTab.windowId) {
        focusWindow(optionsPageTab.windowId)
      }
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

export const openKeysPage = (accountId?: string) => {
  const url = accountId
    ? getURL(`options.html#keys?accountId=${accountId}`)
    : getURL("options.html#keys")
  createTab(url)
}

export const openModelsPage = (accountId?: string) => {
  const url = accountId
    ? getURL(`options.html#models?accountId=${accountId}`)
    : getURL("options.html#models")
  createTab(url)
}

export const openUsagePage = (account: DisplaySiteData) => {
  const logUrl = joinUrl(
    account.baseUrl,
    getSiteApiRouter(account.siteType).usagePath
  )
  createTab(logUrl)
}

export const openCheckInPage = (account: DisplaySiteData) => {
  const checkInUrl = joinUrl(
    account.baseUrl,
    getSiteApiRouter(account.siteType).checkInPath
  )
  createTab(checkInUrl)
}
