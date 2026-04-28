<h4 align="center">
简体中文 | <a href="./README_EN.md">English</a>
</h4>

<hr/>

<div align="center">
  <img src="src/assets/icon.png" alt="All API Hub Logo" width="128" height="128">

# All API Hub – 你的全能 AI 资产管家

**一站式管理 New API 兼容中转站账号：余额/用量看板、模型价格比对、自动签到、密钥与独立 API 凭证管理、网页内 API 可用性测试、渠道与模型同步/重定向**

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

---

**[⚡ 快速上手](https://all-api-hub.qixing1217.top/get-started.html) | [📚 文档中心](https://all-api-hub.qixing1217.top/) | [🔌 集成工具](https://all-api-hub.qixing1217.top/supported-export-tools.html) | [🌐 支持站点](https://all-api-hub.qixing1217.top/supported-sites.html) | [❓ 常见问题](https://all-api-hub.qixing1217.top/faq.html) | [📜 更新日志](https://all-api-hub.qixing1217.top/changelog.html)**

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

---

</div>

<a id="introduction"></a>
## ❓ 为什么需要 All API Hub？

在 AI 生态中，为了追求性价比或模型多样性，我们往往拥有多个基于 New API / Sub2API 系列的中转站。但这通常会带来一些管理效率上的挑战：

- 📂 **多站点管理困难**：余额、用量和模型价格分散在不同后台，难以快速掌握全局资产状态。
- 💲 **价格对比不便**：不同站点的计费倍率差异显著，缺乏直观的工具来快速锁定性价比最优方案。
- ✅ **签到维护繁琐**：手动维护多个站点的每日签到费时费力，极易因遗忘导致赠送额度流失。
- 🔌 **工具配置繁琐**：将 API Key 配置到不同 AI 工具时，频繁的复制粘贴操作导致效率低下。

**All API Hub 为提升这些环节的效率而生。** 它是你的 AI 资产管理中心，将零散的中转站账号聚合为一站式、可视化的管理台。

### 🧩 强大的兼容性
不论你用的是哪种架构，我们基本都支持：     
- **主流开源**：[one-api](https://github.com/songquanpeng/one-api)、[new-api](https://github.com/QuantumNous/new-api)、[Sub2API](https://github.com/Wei-Shaw/sub2api)、[one-hub](https://github.com/MartialBE/one-hub)、[done-hub](https://github.com/deanxv/done-hub)、[Veloera](https://github.com/Veloera/Veloera)
- **特色架构**：[AnyRouter](https://anyrouter.top)、Neo-API、Super-API 等
- **查看完整列表**：👉 [支持的站点](https://all-api-hub.qixing1217.top/supported-sites.html)

<a id="features"></a>
## ✨ 核心价值与功能特性

### 📊 多站点统一看板
- **多账号资产总览**：在一个面板内集中查看所有站点的余额、总用量与健康状态。
- **智能站点识别**：只需粘贴地址，自动识别架构类型、计费比例并完成添加。
- **独立凭证档案**：直接管理 `URL + Key` 组合，支持标签分类，像管理收藏夹一样简单。

### 💰 智能省钱与自动收益
- **模型价格比对**：自动计算各站点模型的实际折合单价，锁定当前最实惠的分组与站点。
- **全自动签到流**：一键处理或定时执行所有支持站点的签到，确保存储额度不中断。
- **用量深度统计**：按站点、账号、模型、日期生成报表，包含热力图与慢请求分析。

### 🚀 极速生态集成
- **一键快捷导出**：深度适配并一键同步到 **CherryStudio, CC Switch, CLIProxyAPI, Claude Code Router, Kilo Code** 等。
- **后台联动工具**：为自建站点管理员提供渠道管理、模型重定向、渠道同步等后台效率增强功能。
- **查看集成列表**：👉 [支持的工具](https://all-api-hub.qixing1217.top/supported-export-tools.html)

### 🧪 稳定性护航
- **多维度接口验证**：支持批量测试模型可用性、Token 兼容性及 CLI 代理可用性。
- **CF 过盾助手**：自动协助通过 Cloudflare 挑战，确保数据刷新与接口调用不中断。

### 🔒 隐私与同步
- **隐私优先**：默认数据存储于本地，无使用行为上报。
- **加密同步**：支持 WebDAV 加密备份与同步，确保多设备间的数据无缝迁移。


> [!NOTE]
> 觉得原本的 [One API Hub](https://github.com/fxaxg/one-api-hub) 好用？你会更爱现在的 All API Hub。我们大幅重构并保持了数据兼容，支持无缝一键导入。


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

<a id="installation"></a>
## 🚀 安装使用

| 渠道 | 下载链接 | 当前版本 | 用户数                                                                                                                                                                                                                     |
|------|----------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Chrome 商店 | [Chrome 商店](https://chromewebstore.google.com/detail/lapnciffpekdengooeolaienkeoilfeo) | [![Chrome version](https://img.shields.io/chrome-web-store/v/lapnciffpekdengooeolaienkeoilfeo?label=Chrome&logo=googlechrome&style=flat)](https://chromewebstore.google.com/detail/lapnciffpekdengooeolaienkeoilfeo) | [![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/lapnciffpekdengooeolaienkeoilfeo?label=Chrome%20Users)](https://chromewebstore.google.com/detail/lapnciffpekdengooeolaienkeoilfeo) |
| Edge 商店 | [Edge 商店](https://microsoftedge.microsoft.com/addons/detail/pcokpjaffghgipcgjhapgdpeddlhblaa) | [![Edge version](https://img.shields.io/badge/dynamic/json?label=Edge&prefix=v&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Fpcokpjaffghgipcgjhapgdpeddlhblaa&logo=microsoftedge&style=flat)](https://microsoftedge.microsoft.com/addons/detail/pcokpjaffghgipcgjhapgdpeddlhblaa) | [![Edge Add-ons Users](https://img.shields.io/badge/dynamic/json?label=Edge%20Users&query=$.activeInstallCount&url=https://microsoftedge.microsoft.com/addons/getproductdetailsbycrxid/pcokpjaffghgipcgjhapgdpeddlhblaa)](https://microsoftedge.microsoft.com/addons/detail/pcokpjaffghgipcgjhapgdpeddlhblaa) |
| Firefox 商店 | [Firefox 商店](https://addons.mozilla.org/firefox/addon/{bc73541a-133d-4b50-b261-36ea20df0d24}) | [![Firefox version](https://img.shields.io/amo/v/%7Bbc73541a-133d-4b50-b261-36ea20df0d24%7D?label=Firefox&logo=firefoxbrowser&style=flat)](https://addons.mozilla.org/firefox/addon/{bc73541a-133d-4b50-b261-36ea20df0d24}) | [![Mozilla Add-on Users](https://img.shields.io/amo/users/%7Bbc73541a-133d-4b50-b261-36ea20df0d24%7D?label=Firefox%20Users)](https://addons.mozilla.org/firefox/addon/{bc73541a-133d-4b50-b261-36ea20df0d24}) |
| GitHub Releases | [查看全部版本](https://github.com/qixing-jk/all-api-hub/releases) | [![GitHub version](https://img.shields.io/github/v/release/qixing-jk/all-api-hub?label=GitHub&logo=github&style=flat)](https://github.com/qixing-jk/all-api-hub/releases/latest) | [![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/qixing-jk/all-api-hub/total?label=Total%20Downloads)](https://github.com/qixing-jk/all-api-hub/releases) |

> [!TIP]
> 默认推荐使用商店版。
> - 商店版更适合大多数用户，安装更省事，后续通常可自动更新。
> - Release 版需要手动下载、解压，并在更新后再次手动安装或重新加载。
> - 只有在你明确需要更早获取新版本、手动验证修复，或必须加载扩展包时，再考虑使用 Release 版。
>
> 移动端 / 手机端支持情况：
> - 原则上只要浏览器支持扩展，通常就可以使用，例如 `Edge`、`Firefox for Android`、`Kiwi` 等。
> - QQ 浏览器、360 系浏览器、猎豹浏览器、Brave、Vivaldi、Opera 等浏览器可参考[QQ / 360 等浏览器安装指南](https://all-api-hub.qixing1217.top/other-browser-install.html)。
> - 更多说明可查看[常见问题中的移动端使用](https://all-api-hub.qixing1217.top/faq.html#mobile-browser-support)。

<details>
<summary>Release 版本选择</summary>

先选版本类型，再下载对应附件：

| 类型 | 推荐场景 | 下载链接 | 特点 |
|------|----------|----------|------|
| 正式版 Stable | 日常使用、首次安装、优先稳定 | [下载最新正式版](https://github.com/qixing-jk/all-api-hub/releases/latest) | 对应正式发布版本，发布说明更完整，稳定性更高。 |
| Nightly 预发布 | 想尽快获取新功能 / 修复，或协助验证问题 | [下载 Nightly](https://github.com/qixing-jk/all-api-hub/releases/tag/nightly) | 基于 `main` 最新提交自动生成，更新更快，但可能包含尚未充分验证的改动；附件文件名通常会带 `nightly`。 |

> [!TIP]
> - 不确定选哪个时，先选正式版 Stable。
> - 如果你是为了确认某个修复是否已经包含，或愿意帮助反馈问题，再选择 Nightly。
> - 商店版本通常会因审核延迟 1-3 天；GitHub 正式版一般更早，Nightly 最快，但风险也更高。

</details>

<details>
<summary>QQ / 360 等浏览器手动安装（解压加载）</summary>

1. 下载最新版本的扩展包
2. 如果使用 QQ、360、猎豹、Brave、Vivaldi、Opera 等浏览器，请下载 `all-api-hub-<version>-chrome.zip`
3. 解压到固定目录，并确认目录中能直接看到 `manifest.json`
4. 打开扩展管理页，例如 `chrome://extensions/`、`qqbrowser://extensions`、`liebao://extensions/`、`brave://extensions/`、`vivaldi://extensions/` 或 `opera://extensions/`
5. 开启 "开发者模式"
6. 点击 "加载已解压的扩展程序"
7. 选择解压后的扩展文件夹

</details>

<details>
<summary>Chromium 浏览器手动安装（桌面端）</summary>

适用于无法使用商店安装，或需要手动加载 GitHub Release 附件的场景。

1. 从 GitHub Release 下载 `*-chrome.zip` 扩展包并解压。
2. 打开浏览器扩展管理页：Chrome 可进入 `chrome://extensions/`，Edge 可进入 `edge://extensions/`。
3. 开启“开发者模式”。
4. 点击“加载已解压的扩展程序”。
5. 选择解压后的扩展目录完成安装。

</details>

<details>
<summary>Safari 安装（需 Xcode）</summary>

Safari 不能像 Chrome、Edge 那样直接解压加载，必须通过 Xcode 安装。详细步骤请查看 [Safari 安装指南](docs/docs/safari-install.md)。

推荐安装方式：

1. 打开 [最新版本 Release](https://github.com/qixing-jk/all-api-hub/releases/latest)，下载 `all-api-hub-<version>-safari-xcode-bundle.zip`。
2. 解压后直接打开其中的 Xcode 工程运行。

高级用法：

1. 从源码构建：`pnpm install` -> `pnpm run build:safari` -> `xcrun safari-web-extension-converter .output/safari-mv2/`。
2. 用 Xcode 打开并运行生成的工程。

> [!WARNING]
> 请下载 `all-api-hub-<version>-safari-xcode-bundle.zip`，不要单独下载 `all-api-hub-<version>-safari.zip`。
> 前者已经包含可直接打开的 Xcode 工程和所需的 Safari 文件，更适合普通安装流程。

有 Apple Developer Program 付费账号时，可进一步做正式签名并通过 TestFlight / App Store 分发；没有则通常只适合本机调试或自用。

<details>
<summary>为什么要下载这个文件？</summary>

`all-api-hub-<version>-safari-xcode-bundle.zip` 里通常会同时包含：

- `all-api-hub-<version>-safari.zip`
- `safari-mv2/`
- 转换器生成的 Xcode 工程目录

这样解压后就可以直接用 Xcode 打开工程，不需要自己再补齐工程引用的 Safari 文件。

</details>

</details>

<a id="quick-start"></a>
## 🧑‍🚀 新手快速上手

[快速上手指南](https://all-api-hub.qixing1217.top/get-started.html)。

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

---

<div align="center">
  <strong>⭐ 如果这个项目对你有帮助，请考虑给它一个星标！</strong>
</div>
