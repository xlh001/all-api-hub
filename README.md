<h4 align="center">
简体中文 | <a href="./README_EN.md">English</a>
</h4>

<div align="center">
  <img src="src/assets/icon.png" alt="All API Hub Logo" width="128" height="128">

# All API Hub – 你的全能 AI 资产管家

**一站式管理 New API 兼容中转站账号：余额/用量看板、模型价格比对、自动签到、密钥与 API 凭据库、网页内 API 可用性测试、渠道与模型同步/重定向**

<p align="center">
<a href="https://chromewebstore.google.com/detail/lapnciffpekdengooeolaienkeoilfeo">
  <img alt="Chrome Web Store" src="https://img.shields.io/chrome-web-store/v/lapnciffpekdengooeolaienkeoilfeo?label=Chrome&logo=googlechrome&style=flat">
</a>
<a href="https://microsoftedge.microsoft.com/addons/detail/pcokpjaffghgipcgjhapgdpeddlhblaa">
  <img alt="Microsoft Edge" src="https://img.shields.io/badge/dynamic/json?label=Edge&prefix=v&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Fpcokpjaffghgipcgjhapgdpeddlhblaa&logo=microsoftedge&style=flat">
</a>
<a href="https://addons.mozilla.org/firefox/addon/{bc73541a-133d-4b50-b261-36ea20df0d24}">
  <img alt="Firefox Add-on" src="https://img.shields.io/amo/v/{bc73541a-133d-4b50-b261-36ea20df0d24}?label=Firefox&logo=firefoxbrowser&style=flat">
</a>
<a href="https://github.com/qixing-jk/all-api-hub/releases">
  <img alt="GitHub version" src="https://img.shields.io/github/v/release/qixing-jk/all-api-hub?label=GitHub&logo=github&style=flat">
</a>
</p>

**[⚡ 快速上手](https://all-api-hub.qixing1217.top/get-started.html) | [📚 文档中心](https://all-api-hub.qixing1217.top/) | [💬 社区交流](https://all-api-hub.qixing1217.top/#community) | [🔌 集成工具](https://all-api-hub.qixing1217.top/supported-export-tools.html) | [🌐 支持站点](https://all-api-hub.qixing1217.top/supported-sites.html) | [❓ 常见问题](https://all-api-hub.qixing1217.top/faq.html) | [📜 更新日志](https://all-api-hub.qixing1217.top/changelog.html)**

<p align="center">
  <strong>📢 讨论帖：</strong>
  <a href="https://linux.do/t/topic/1001042">Linux.do 主题帖</a>
</p>

<a id="community"></a>
<p align="center">
  <strong>💬 社区：</strong> 
  <a href="./resources/wechat_group.png">
    <img alt="中文群" src="https://img.shields.io/badge/WeChat-中文群-green" />
  </a>
  <a href="https://discord.gg/RmFXZ577ZQ">
    <img alt="Discord-多语言社区" src="https://img.shields.io/badge/Discord-多语言社区-5865F2?logo=discord&logoColor=white">
  </a>
  <a href="https://t.me/qixing_chat">
    <img alt="Telegram-多语言群" src="https://img.shields.io/badge/Telegram-多语言群-blue?logo=telegram">
  </a>
</p>

</div>

<a id="introduction"></a>
## ❓ 为什么需要 All API Hub？

**简单来说**：AI 中转站就像是“AI 充值卡超市”，让你能以极低的价格（甚至免费）在一个地方用上 ChatGPT、Claude、Midjourney 等各种顶尖模型。

但如果你有多个账号，管理起来会很头疼：
- 📂 **资产太乱**：余额多少、钱花哪了，得一个一个网站去登录看。
- 💲 **价格太杂**：每个站点计费倍率不同，到底哪家最划算？
- ✅ **福利漏领**：很多站点每天签到送额度，但手动签到太累，容易忘。
- 🔌 **配置麻烦**：把 API 填到各种 AI 工具（如沉浸式翻译、Cherry Studio）里，复制粘贴太心累。

**All API Hub 就是你的“AI 资产全能管家”**。你只需要把站点地址填进来，剩下的交给我们。

<a id="features"></a>
## ✨ 它能为你做什么？

### 📊 多站点统一看板
- **多账号资产总览**：在一个面板内集中查看所有站点的余额、总用量与健康状态。
- **智能站点识别**：只需粘贴地址，自动识别架构类型、计费比例并完成添加。
- **API 凭据库**：集中保存常用 `Base URL + API Key`，用于快速复制、验证接口、查看模型与余额/用量。

### 💰 智能省钱与自动收益
- **模型价格比对**：自动计算各站点模型的实际折合单价，锁定当前最实惠的分组与站点。
- **全自动签到流**：一键处理或定时执行所有支持站点的签到，确保存储额度不中断。
- **用量深度统计**：按站点、账号、模型、日期生成报表，包含热力图与慢请求分析。

### 🚀 极速生态集成
- **一键快捷导出**：深度适配并一键同步到 **CherryStudio, CC Switch, CLIProxyAPI, Claude Code Router, Kilo Code** 等。
- **后台联动工具**：为自建站点管理员提供渠道管理、模型重定向、渠道同步等后台效率增强功能。
- **网页嗅探与快速录入**：在网页上选中 Base URL 或 API Key 即可快速弹出测试窗并保存，详情见 [网页 API 嗅探与验证](https://all-api-hub.qixing1217.top/web-ai-api-check.html)。
- **查看集成列表**：👉 [支持的工具](https://all-api-hub.qixing1217.top/supported-export-tools.html)

### 🧪 稳定性护航
- **多维度接口验证**：支持批量测试模型可用性、Token 兼容性及 CLI 代理可用性。
- **CF 过盾助手**：自动协助通过 Cloudflare 挑战，确保数据刷新与接口调用不中断。

### 🔒 保护隐私与安全
- **默认本地管理**：你的 Key 和账号信息默认保存在本机；除非你主动启用 WebDAV 备份/同步，否则不会上传到外部存储。
- **加密同步**：支持 WebDAV 加密备份，换台电脑也能瞬间找回所有数据。

> [!NOTE]
> 觉得原本的 [One API Hub](https://github.com/fxaxg/one-api-hub) 好用？你会更爱现在的 All API Hub。我们大幅重构并保持了数据兼容，支持无缝一键导入。



<a id="installation"></a>
## 🚀 快速安装

> [!IMPORTANT]
> **90% 的用户请直接选择商店安装**。商店版安装最简单，且支持自动更新，省心稳定。

| 渠道 | 安装链接                                                                                          | 当前版本 | 用户数                                                                                                                                                                                                                     |
|------|-----------------------------------------------------------------------------------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Chrome 商店 | [Chrome 商店](https://chromewebstore.google.com/detail/lapnciffpekdengooeolaienkeoilfeo)        | [![Chrome version](https://img.shields.io/chrome-web-store/v/lapnciffpekdengooeolaienkeoilfeo?label=Chrome&logo=googlechrome&style=flat)](https://chromewebstore.google.com/detail/lapnciffpekdengooeolaienkeoilfeo) | [![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/lapnciffpekdengooeolaienkeoilfeo?label=Chrome%20Users)](https://chromewebstore.google.com/detail/lapnciffpekdengooeolaienkeoilfeo) |
| Edge 商店 | [Edge 商店](https://microsoftedge.microsoft.com/addons/detail/pcokpjaffghgipcgjhapgdpeddlhblaa) | [![Edge version](https://img.shields.io/badge/dynamic/json?label=Edge&prefix=v&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Fpcokpjaffghgipcgjhapgdpeddlhblaa&logo=microsoftedge&style=flat)](https://microsoftedge.microsoft.com/addons/detail/pcokpjaffghgipcgjhapgdpeddlhblaa) | [![Edge Add-ons Users](https://img.shields.io/badge/dynamic/json?label=Edge%20Users&query=$.activeInstallCount&url=https://microsoftedge.microsoft.com/addons/getproductdetailsbycrxid/pcokpjaffghgipcgjhapgdpeddlhblaa)](https://microsoftedge.microsoft.com/addons/detail/pcokpjaffghgipcgjhapgdpeddlhblaa) |
| Firefox 商店 | [Firefox 商店](https://addons.mozilla.org/firefox/addon/{bc73541a-133d-4b50-b261-36ea20df0d24}) | [![Firefox version](https://img.shields.io/amo/v/%7Bbc73541a-133d-4b50-b261-36ea20df0d24%7D?label=Firefox&logo=firefoxbrowser&style=flat)](https://addons.mozilla.org/firefox/addon/{bc73541a-133d-4b50-b261-36ea20df0d24}) | [![Mozilla Add-on Users](https://img.shields.io/amo/users/%7Bbc73541a-133d-4b50-b261-36ea20df0d24%7D?label=Firefox%20Users)](https://addons.mozilla.org/firefox/addon/{bc73541a-133d-4b50-b261-36ea20df0d24}) |
| GitHub Releases | [查看全部版本](https://github.com/qixing-jk/all-api-hub/releases)                                   | [![GitHub version](https://img.shields.io/github/v/release/qixing-jk/all-api-hub?label=GitHub&logo=github&style=flat)](https://github.com/qixing-jk/all-api-hub/releases/latest) | [![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/qixing-jk/all-api-hub/total?label=Total%20Downloads)](https://github.com/qixing-jk/all-api-hub/releases) |

<details>
<summary>📦 需要手动安装或测试版？（点击展开）</summary>

| 渠道 | 下载链接 | 适用场景 |
|------|----------|----------|
| GitHub 正式版 | [下载 Stable](https://github.com/qixing-jk/all-api-hub/releases/latest) | 无法访问商店，或想手动管理版本 |
| Nightly 预发布 | [下载 Nightly](https://github.com/qixing-jk/all-api-hub/releases/tag/nightly) | 想抢先体验新功能，协助测试 |

**其他环境支持：**
- **手机端**：支持 Edge 手机版、Firefox Android、Kiwi 等浏览器，详见 [移动端使用指南](https://all-api-hub.qixing1217.top/faq.html#mobile-browser-support)。
- **QQ / 360 等**：详见 [手动加载指南](https://all-api-hub.qixing1217.top/other-browser-install.html)。
- **Safari (Mac)**：需要 Xcode 编译，详详见 [Safari 安装指南](https://all-api-hub.qixing1217.top/safari-install.html)。

</details>

<a id="quick-start"></a>
## 🧑‍🚀 30 秒上手指南

1. **安装插件**：从上方商店链接点击安装。
2. **登录站点**：在浏览器里登录你常用的 AI 中转站。
3. **点击识别**：点击插件图标 -> `新增账号` -> 输入网址 -> 点击 `自动识别`。
4. **开始享受**：查看余额、配置自动签到，或者将账号导出到你的 AI 客户端。

👉 **[点击查看：更详细的图文新手教程](https://all-api-hub.qixing1217.top/get-started.html)**

<a id="introduction-tech"></a>
### 🧩 强大的兼容性
不论你用的是哪种架构，我们基本都支持：     
- **主流开源**：[one-api](https://github.com/songquanpeng/one-api)、[new-api](https://github.com/QuantumNous/new-api)、[Sub2API](https://github.com/Wei-Shaw/sub2api)、[one-hub](https://github.com/MartialBE/one-hub)、[done-hub](https://github.com/deanxv/done-hub)、[Veloera](https://github.com/Veloera/Veloera)
- **特色架构与兼容平台**：[AIHubMix](https://aihubmix.com/)、[AnyRouter](https://anyrouter.top)、Neo-API、Super-API、v-api 等
- **查看完整列表**：👉 [支持的站点](https://all-api-hub.qixing1217.top/supported-sites.html)

<a id="ui-preview"></a>
## 🖼️ 界面预览

<table>
  <tr>
    <td align="center">
      <img src="docs/docs/static/image/account-manage.png" alt="account-manage" style="width:100%; height:auto;"/>
      <div>账户管理总览</div>
    </td>
    <td align="center">
      <img src="docs/docs/static/image/model-list.png" alt="model-list" style="width:100%; height:auto;"/>
      <div>模型列表与价格</div>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="docs/docs/static/image/api-key-list.png" alt="api-key-list" style="width:100%; height:auto;"/>
      <div>密钥列表与导出</div>
    </td>
    <td align="center">
      <img src="docs/docs/static/image/auto-check-in.png" alt="auto-check-in" style="width:100%; height:auto;"/>
      <div>账号自动签到</div>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="docs/docs/static/image/account-model-usage-overview.png" alt="account-model-usage-overview" style="width:100%; height:auto;"/>
      <div>账号模型使用情况</div>
    </td>
    <td align="center">
      <img src="docs/docs/static/image/account-model-latency-overview.png" alt="account-model-latency-overview" style="width:100%; height:auto;"/>
      <div>模型慢查询分析</div>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="docs/docs/static/image/new-api-channel-sync.png" alt="new-api-channel-sync" style="width:100%; height:auto;"/>
      <div>New API 模型同步</div>
    </td>
    <td align="center">
      <img src="docs/docs/static/image/new-api-channel-manage.png" alt="new-api-channel-manage" style="width:100%; height:auto;"/>
      <div>New API 渠道管理</div>
    </td>
  </tr>
</table>

<a id="development-guide"></a>
## 🛠️ 开发指南

请参阅 [CONTRIBUTING](CONTRIBUTING.md) 以获取更多信息。

<a id="tech-stack"></a>
## 🏗️ 技术栈

- **框架**: [WXT](https://wxt.dev) 负责多浏览器扩展工具链与构建流程
- **UI 层**: [React](https://react.dev) 构建扩展选项页与弹窗界面
- **语言**: [TypeScript](https://www.typescriptlang.org) 提供端到端的类型安全
- **样式**: [Tailwind CSS](https://tailwindcss.com) 以原子化工具类驱动主题样式
- **组件**: [Headless UI](https://headlessui.com) 提供无样式可访问组件与设计系统基石


<a id="acknowledgements"></a>
## 🙏 致谢

- 感谢 [@AngleNaris](https://github.com/AngleNaris) 设计了项目 Logo 🎨
- 感谢 [Linux.do 社区](https://linux.do) 提供的反馈、测试和传播支持，尤其是 [All-API-Hub 主题帖](https://linux.do/t/topic/1001042) 中持续的讨论与建议
- [WXT](https://wxt.dev) - 现代化的浏览器扩展开发框架

<div align="center">
  <strong>⭐ 如果这个项目对你有帮助，请考虑给它一个星标！</strong>
</div>
