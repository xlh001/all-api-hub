import { viteBundler } from "@vuepress/bundler-vite"
import { defaultTheme } from "@vuepress/theme-default"
import { defineUserConfig } from "vuepress"

export default defineUserConfig({
  lang: "zh-CN",
  base: "/all-api-hub/",

  title: "All API Hub - 中转站管理器",
  description:
    "一个开源的浏览器插件，聚合管理AI中转站账号的余额、模型和密钥，告别繁琐登录。",

  theme: defaultTheme({
    logo: "https://github.com/qixing-jk/all-api-hub/blob/main/assets/icon.png?raw=true",

    navbar: ["/", "/get-started", "/faq"]
  }),

  bundler: viteBundler()
})
