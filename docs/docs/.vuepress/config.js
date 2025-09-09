import { viteBundler } from "@vuepress/bundler-vite"
import { defaultTheme } from "@vuepress/theme-default"
import { defineUserConfig } from "vuepress"

export default defineUserConfig({
  lang: "zh-CN",
  base: "/all-api-hub/",

  title: "All API Hub - 中转站管理器",
  description:
    "一个开源的浏览器插件，旨在优化管理New API等AI中转站账号的体验。用户可以轻松集中管理和查看账户余额、模型及密钥，并自动添加新站点。",

  theme: defaultTheme({
    logo: "https://github.com/qixing-jk/all-api-hub/blob/main/assets/icon.png?raw=true",

    navbar: ["/", "/get-started", "/faq"]
  }),

  bundler: viteBundler()
})
