import { defineConfig } from "wxt"

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "中转站管理器 - All API Hub",
    description:
      "一站式聚合管理所有AI中转站账号的余额、模型和密钥，告别繁琐登录。",
    permissions: ["tabs", "storage"],
    host_permissions: ["https://*/*"],
    browser_specific_settings: {
      gecko: {
        id: "{bc73541a-133d-4b50-b261-36ea20df0d24}"
      }
    },
    sidebar_action: {
      default_icon: {
        "16": "./public/icon16.png",
        "32": "./public/icon32.png",
        "48": "./public/icon48.png",
        "64": "./public/icon64.png",
        "128": "./public/icon128.png"
      }
    }
  }
})
