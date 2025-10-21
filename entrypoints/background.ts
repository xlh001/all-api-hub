import { t } from "i18next"

import { accountStorage } from "../services/accountStorage"
import {
  autoRefreshService,
  handleAutoRefreshMessage
} from "../services/autoRefreshService"
import { migrateAccountsConfig } from "../services/configMigration"
import { getSiteType } from "../services/detectSiteType"
import {
  createTab,
  createWindow,
  hasWindowsAPI,
  onInstalled,
  onRuntimeMessage,
  onStartup,
  onTabRemoved,
  onWindowRemoved,
  removeTabOrWindow
} from "../utils/browserApi"
import { getErrorMessage } from "../utils/error"

export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id })
  main()
})

function main() {
  // 管理临时窗口的 Map
  const tempWindows = new Map<string, number>()

  // 插件启动时初始化自动刷新服务
  onStartup(async () => {
    console.log("[Background] 插件启动，初始化自动刷新服务")
    await autoRefreshService.initialize()
  })

  // 插件安装时初始化自动刷新服务
  onInstalled(async (details) => {
    console.log("[Background] 插件安装/更新，初始化自动刷新服务")
    await autoRefreshService.initialize()

    if (details.reason === "install" || details.reason === "update") {
      console.log(`Extension ${details.reason}: triggering config migration`)

      // Load all accounts and migrate
      const accounts = await accountStorage.getAllAccounts()
      const { accounts: migrated, migratedCount } =
        migrateAccountsConfig(accounts)

      if (migratedCount > 0) {
        // Save migrated accounts back
        const config = await accountStorage.exportData()
        await accountStorage.importData({ ...config, accounts: migrated })
        console.log(`Migration complete: ${migratedCount} accounts updated`)
      }
    }
  })

  // 处理来自 popup 的消息
  onRuntimeMessage((request, _sender, sendResponse) => {
    if (request.action === "openTempWindow") {
      handleOpenTempWindow(request, sendResponse)
      return true // 保持异步响应通道
    }

    if (request.action === "closeTempWindow") {
      handleCloseTempWindow(request, sendResponse)
      return true
    }

    if (request.action === "autoDetectSite") {
      handleAutoDetectSite(request, sendResponse)
      return true
    }

    // 处理自动刷新相关消息
    if (
      (request.action && request.action.startsWith("autoRefresh")) ||
      [
        "setupAutoRefresh",
        "refreshNow",
        "stopAutoRefresh",
        "updateAutoRefreshSettings",
        "getAutoRefreshStatus"
      ].includes(request.action)
    ) {
      handleAutoRefreshMessage(request, sendResponse)
      return true
    }
  })

  // 监听窗口/标签页关闭事件，清理记录
  onWindowRemoved((windowId) => {
    for (const [requestId, storedId] of tempWindows.entries()) {
      if (storedId === windowId) {
        tempWindows.delete(requestId)
        break
      }
    }
  })

  // 手机: 监听标签页关闭
  onTabRemoved((tabId) => {
    for (const [requestId, storedId] of tempWindows.entries()) {
      if (storedId === tabId) {
        tempWindows.delete(requestId)
        break
      }
    }
  })

  // 打开临时窗口访问指定站点
  async function handleOpenTempWindow(request: any, sendResponse: Function) {
    try {
      const { url, requestId } = request

      // 手机 不支持 windows API，使用 tabs 替代
      if (hasWindowsAPI()) {
        // 创建新窗口
        const window = await createWindow({
          url: url,
          type: "popup",
          width: 800,
          height: 600,
          focused: false
        })

        if (window?.id) {
          // 记录窗口ID
          tempWindows.set(requestId, window.id)
          sendResponse({ success: true, windowId: window.id })
        } else {
          sendResponse({
            success: false,
            error: t("messages:background.cannotCreateWindow")
          })
        }
      } else {
        // 手机: 使用标签页
        const tab = await createTab(url, false)
        if (tab?.id) {
          tempWindows.set(requestId, tab.id)
          sendResponse({ success: true, tabId: tab.id })
        } else {
          sendResponse({
            success: false,
            error: t("messages:background.cannotCreateWindow")
          })
        }
      }
    } catch (error) {
      sendResponse({ success: false, error: getErrorMessage(error) })
    }
  }

  // 关闭临时窗口
  async function handleCloseTempWindow(request: any, sendResponse: Function) {
    try {
      const { requestId } = request
      const id = tempWindows.get(requestId)

      if (id) {
        await removeTabOrWindow(id)
        tempWindows.delete(requestId)
      }

      sendResponse({ success: true })
    } catch (error) {
      sendResponse({ success: false, error: getErrorMessage(error) })
    }
  }

  // 自动检测站点信息
  async function handleAutoDetectSite(request: any, sendResponse: Function) {
    const { url, requestId } = request

    try {
      const [userData, siteType] = await Promise.all([
        getSiteDataFromTab(url, requestId),
        getSiteType(url)
      ])

      const result = {
        siteType,
        ...(userData ?? {})
      }
      console.log("自动检测结果:", result)

      // 5. 返回结果
      sendResponse({
        success: true,
        data: result
      })
    } catch (error) {
      sendResponse({ success: false, error: getErrorMessage(error) })
    }
  }

  /**
   * 通过打开临时标签页获取站点用户信息
   * @param url
   * @param requestId
   */
  async function getSiteDataFromTab(url: string, requestId: string) {
    let id: number | undefined
    let tabId: number | undefined

    try {
      // 1. 打开临时窗口或标签页
      if (hasWindowsAPI()) {
        const window = await createWindow({
          url: url,
          type: "popup",
          width: 800,
          height: 600,
          focused: false
        })

        if (!window?.id) {
          throw new Error(t("messages:background.cannotCreateWindowOrTab"))
        }

        id = window.id

        // 获取新窗口中的活动标签页
        const tabs = await browser.tabs.query({
          windowId: window.id,
          active: true
        })
        tabId = tabs[0]?.id

        if (!tabId) {
          throw new Error(t("messages:background.cannotCreateWindowOrTab"))
        }
      } else {
        // 手机: 使用标签页
        const tab = await createTab(url, false)
        if (!tab?.id) {
          throw new Error(t("messages:background.cannotCreateWindowOrTab"))
        }
        id = tab.id
        tabId = tab.id
      }

      // 记录ID
      tempWindows.set(requestId, id)

      // 2. 等待页面加载完成
      await waitForTabComplete(tabId)

      // 3. 通过 content script 获取用户信息
      const userResponse = await browser.tabs.sendMessage(tabId, {
        action: "getUserFromLocalStorage",
        url: url
      })

      // 4. 关闭临时窗口或标签页
      await removeTabOrWindow(id)
      tempWindows.delete(requestId)

      // 5. 检查响应并返回结果
      if (!userResponse || !userResponse.success) {
        console.log("获取用户信息失败:", userResponse?.error)
        return null
      }

      return {
        userId: userResponse.data?.userId,
        user: userResponse.data?.user
      }
    } catch (error) {
      // 清理窗口或标签页
      const storedId = tempWindows.get(requestId)
      if (storedId) {
        try {
          await removeTabOrWindow(storedId)
          tempWindows.delete(requestId)
        } catch (cleanupError) {
          console.log("清理失败:", cleanupError)
        }
      }
      return null
    }
  }
}

// 等待标签页加载完成
function waitForTabComplete(tabId: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(t("messages:background.pageLoadTimeout")))
    }, 10000) // 10秒超时

    const checkStatus = () => {
      browser.tabs
        .get(tabId)
        .then((tab) => {
          if (tab.status === "complete") {
            clearTimeout(timeout)
            // 再等待一秒确保页面完全加载
            setTimeout(resolve, 1000)
          } else {
            setTimeout(checkStatus, 100)
          }
        })
        .catch((error) => {
          clearTimeout(timeout)
          reject(error)
        })
    }

    checkStatus()
  })
}
