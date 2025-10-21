/**
 * Browser API 工具函数
 * 提供跨浏览器兼容的 API 封装和常用 fallback 逻辑
 */

// 确保 browser 全局对象可用
import { isNotEmptyArray } from "~/utils/index.ts"

if (typeof browser === "undefined") {
  // @ts-ignore
  globalThis.browser = chrome
}

/**
 * 获取当前活动标签页
 * 自动处理 Firefox Android 不支持 currentWindow 的情况
 */
export async function getActiveTabs(): Promise<browser.tabs.Tab[]> {
  try {
    // 优先尝试使用 currentWindow
    const tabs = await queryTabs({ active: true, currentWindow: true })
    if (tabs && tabs.length > 0) {
      return tabs
    }
  } catch (error) {
    // Firefox Android fallback
  }

  // Fallback: 只使用 active
  try {
    return await queryTabs({ active: true })
  } catch (error) {
    // 最后的 fallback: 返回所有标签页
    return await queryTabs({})
  }
}

/**
 * 获取当前活动标签页（单个）
 */
export async function getActiveTab(): Promise<browser.tabs.Tab | null> {
  const tabs = await getActiveTabs()
  return tabs.length > 0 ? tabs[0] : null
}

/**
 * 创建新标签页
 * 统一接口，自动设置 active: true
 */
export async function createTab(
  url: string,
  active = true
): Promise<browser.tabs.Tab | undefined> {
  return await browser.tabs.create({ url, active })
}

/**
 * 更新标签页
 */
export async function updateTab(
  tabId: number,
  updateInfo: chrome.tabs.UpdateProperties
): Promise<browser.tabs.Tab | undefined> {
  return await browser.tabs.update(tabId, updateInfo)
}

/**
 * 查询标签页
 */
export async function queryTabs(
  queryInfo: chrome.tabs.QueryInfo
): Promise<browser.tabs.Tab[]> {
  return await browser.tabs.query(queryInfo)
}

/**
 * 移除标签页或窗口
 * 自动检测平台能力并选择合适的 API
 */
export async function removeTabOrWindow(id: number): Promise<void> {
  if (browser.windows) {
    try {
      await browser.windows.remove(id)
      return
    } catch (error) {
      // 如果不是窗口 ID，尝试作为标签页 ID
    }
  }

  // Firefox Android 或窗口 API 失败：使用标签页 API
  await browser.tabs.remove(id)
}

/**
 * 聚焦标签页
 * 同时聚焦窗口（如果支持）和激活标签页
 */
export async function focusTab(tab: browser.tabs.Tab): Promise<void> {
  // 先聚焦窗口（如果支持）
  if (browser.windows && tab.windowId != null) {
    try {
      await browser.windows.update(tab.windowId, { focused: true })
    } catch (error) {
      // Firefox Android 不支持，忽略错误
    }
  }

  // 再激活标签页
  if (tab.id != null) {
    await browser.tabs.update(tab.id, { active: true })
  }
}

/**
 * 发送消息到 runtime
 * 统一的消息发送接口
 */
export async function sendRuntimeMessage(message: any): Promise<any> {
  return await browser.runtime.sendMessage(message)
}

/**
 * 获取扩展资源 URL
 */
export function getExtensionURL(path: string): string {
  return browser.runtime.getURL(path)
}

/**
 * 监听 runtime 消息
 * 返回清理函数
 */
export function onRuntimeMessage(
  callback: (
    message: any,
    sender: browser.runtime.MessageSender
  ) => void | Promise<void>
): () => void {
  browser.runtime.onMessage.addListener(callback)
  return () => {
    browser.runtime.onMessage.removeListener(callback)
  }
}

/**
 * 监听标签页激活事件
 * 返回清理函数
 */
export function onTabActivated(
  callback: (activeInfo: chrome.tabs.TabActiveInfo) => void
): () => void {
  browser.tabs.onActivated.addListener(callback)
  return () => {
    browser.tabs.onActivated.removeListener(callback)
  }
}

/**
 * 监听标签页更新事件
 * 返回清理函数
 */
export function onTabUpdated(
  callback: (
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: browser.tabs.Tab
  ) => void
): () => void {
  browser.tabs.onUpdated.addListener(callback)
  return () => {
    browser.tabs.onUpdated.removeListener(callback)
  }
}

/**
 * 监听标签页移除事件
 * 返回清理函数
 */
export function onTabRemoved(
  callback: (tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => void
): () => void {
  browser.tabs.onRemoved.addListener(callback)
  return () => {
    browser.tabs.onRemoved.removeListener(callback)
  }
}

/**
 * 监听窗口移除事件（如果支持）
 * 返回清理函数
 */
export function onWindowRemoved(
  callback: (windowId: number) => void
): () => void {
  if (browser.windows) {
    browser.windows.onRemoved.addListener(callback)
    return () => {
      browser.windows.onRemoved.removeListener(callback)
    }
  }
  return () => {} // 不支持时返回空函数
}

/**
 * 监听扩展启动事件
 */
export function onStartup(callback: () => void): () => void {
  browser.runtime.onStartup.addListener(callback)
  return () => {
    browser.runtime.onStartup.removeListener(callback)
  }
}

/**
 * 监听扩展安装/更新事件
 */
export function onInstalled(callback: (details: any) => void): () => void {
  browser.runtime.onInstalled.addListener(callback)
  return () => {
    browser.runtime.onInstalled.removeListener(callback)
  }
}
export async function getBrowserTabs() {
  let tabs = []
  tabs = await queryTabs({
    active: true,
    currentWindow: true
  })
  if (!isNotEmptyArray(tabs)) {
    tabs = await queryTabs({})
  }
  return tabs || []
}
