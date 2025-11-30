import { accountStorage } from "~/services/accountStorage"
import { migrateAccountsConfig } from "~/services/configMigration/account/accountDataMigration"
import { userPreferences } from "~/services/userPreferences"
import { type SiteAccount } from "~/types"
import { onInstalled } from "~/utils/browserApi"
import {
  registerWebRequestInterceptor,
  setupWebRequestInterceptor
} from "~/utils/cookieHelper"

import { initializeRuntimeMessages } from "./runtimeMessages"
import { initializeServices } from "./servicesInit"

export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id })

  /**
   * 监听插件安装/更新事件
   * 进行配置迁移和服务初始化
   */
  onInstalled((details) => {
    console.log(
      "[Background] 插件安装/更新，初始化自动刷新服务和WebDAV自动同步服务"
    )

    void (async () => {
      await initializeServices()

      if (details.reason === "install" || details.reason === "update") {
        console.log(`Extension ${details.reason}: triggering config migration`)

        // Migrate user preferences
        await userPreferences.getPreferences()
        console.log("[Background] User preferences migration completed")

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
    })()
  })

  main()
})
async function main() {
  await initializeServices()

  // 辅助函数：从账号列表提取 站点的 URL 模式
  function extractAccountUrlPatterns(accounts: SiteAccount[]): string[] {
    const patterns = accounts
      .map((acc) => {
        try {
          const url = new URL(acc.site_url)
          return `${url.origin}/*`
        } catch (error) {
          console.warn(
            `[Background] 账户 ${acc.site_name} 的 URL 无效：`,
            acc.site_url
          )
          return null
        }
      })
      .filter((pattern): pattern is string => pattern !== null)

    // 去重
    return Array.from(new Set(patterns))
  }

  // 初始化 Cookie 拦截器
  async function initializeCookieInterceptor(): Promise<void> {
    try {
      const accounts = await accountStorage.getAllAccounts()
      const urlPatterns = extractAccountUrlPatterns(accounts)
      setupWebRequestInterceptor(urlPatterns)
    } catch (error) {
      console.error("[Background] 初始化 cookie 拦截器失败：", error)
    }
  }

  // 更新 Cookie 拦截器（配置变更时调用）
  async function updateCookieInterceptor(): Promise<void> {
    try {
      const accounts = await accountStorage.getAllAccounts()
      const urlPatterns = extractAccountUrlPatterns(accounts)
      registerWebRequestInterceptor(urlPatterns)
    } catch (error) {
      console.error("[Background] 更新 cookie 拦截器失败：", error)
    }
  }

  // 初始化 WebRequest 拦截器（仅 Firefox）
  await initializeCookieInterceptor()

  // 监听账号配置变更，动态更新拦截器
  browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && changes.site_accounts) {
      console.log("[Background] 账户配置已变更，正在更新拦截器")
      updateCookieInterceptor().catch((error) => {
        console.error("[Background] 更新 cookie 拦截器失败：", error)
      })
    }
  })

  initializeRuntimeMessages()
}
