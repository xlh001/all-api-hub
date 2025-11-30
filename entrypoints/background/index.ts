import { setupRuntimeMessageListeners } from "~/entrypoints/background/runtimeMessages.ts"
import { setupTempWindowListeners } from "~/entrypoints/background/tempWindowPool.ts"
import { accountStorage } from "~/services/accountStorage"
import { migrateAccountsConfig } from "~/services/configMigration/account/accountDataMigration"
import { userPreferences } from "~/services/userPreferences"
import { onInstalled } from "~/utils/browserApi"

import {
  initializeCookieInterceptors,
  setupCookieInterceptorListeners
} from "./cookieInterceptor"
import { initializeServices } from "./servicesInit"

export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id })

  /**
   * 设置各种事件监听器
   */
  setupRuntimeMessageListeners()
  setupTempWindowListeners()
  setupCookieInterceptorListeners()

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
  await initializeCookieInterceptors()
}
