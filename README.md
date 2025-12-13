<h4 align="center">
简体中文 | <a href="./README_EN.md">English</a>
</h4>

<hr/>

<div align="center">
  <img src="assets/icon.png" alt="All API Hub Logo" width="128" height="128">

# All API Hub – AI 中转站 & New API 管理器

**开源浏览器插件，统一管理第三方 AI 聚合中转站与自建 New API：自动识别账号、查看余额、同步模型、管理密钥，并支持跨平台与云端备份。**

<p align="center">
<a href="https://github.com/qixing-jk/all-api-hub/releases">
  <img alt="GitHub version" src="https://img.shields.io/github/v/release/qixing-jk/all-api-hub?label=GitHub&logo=github&style=flat">
</a>
<a href="https://addons.mozilla.org/firefox/addon/{bc73541a-133d-4b50-b261-36ea20df0d24}">
  <img alt="Firefox Add-on" src="https://img.shields.io/amo/v/{bc73541a-133d-4b50-b261-36ea20df0d24}?label=Firefox&logo=firefoxbrowser&style=flat">
</a>
<a href="https://chromewebstore.google.com/detail/lapnciffpekdengooeolaienkeoilfeo">
  <img alt="Chrome Web Store" src="https://img.shields.io/chrome-web-store/v/lapnciffpekdengooeolaienkeoilfeo?label=Chrome&logo=googlechrome&style=flat">
</a>
<a href="https://microsoftedge.microsoft.com/addons/detail/pcokpjaffghgipcgjhapgdpeddlhblaa">
  <img alt="Microsoft Edge" src="https://img.shields.io/badge/dynamic/json?label=Edge&prefix=v&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Fpcokpjaffghgipcgjhapgdpeddlhblaa&logo=microsoftedge&style=flat">
</a>
</p>

**[文档教程](https://all-api-hub.qixing1217.top/) | [常见问题](https://all-api-hub.qixing1217.top/faq.html)**

</div>

## 📖 介绍

现在 AI 生态里有越来越多基于 New API 系列的聚合中转站和自建面板，要同时管理各站点的余额、模型列表和 API 密钥，往往既分散又费时。

All API Hub 作为浏览器插件，可以自动识别这些站点的账号，并一键查看余额、管理模型、密钥与自动签到，并为自建 New API 提供模型同步和渠道管理等工具。当前已支持基于以下项目的中转站账号：

- [one-api](https://github.com/songquanpeng/one-api)
- [new-api](https://github.com/QuantumNous/new-api)
- [Veloera](https://github.com/Veloera/Veloera)
- [one-hub](https://github.com/MartialBE/one-hub)
- [done-hub](https://github.com/deanxv/done-hub)
- Neo-API（闭源）
- Super-API（闭源）
- RIX_API（闭源，基本功能支持）
- VoAPI（闭源，老版本支持）

## ✨ 功能特性

- 🔍 **智能站点识别**  
  自动识别基于常见 New API 系列项目的 AI 聚合中转站点，创建访问 Token，智能解析充值比例与站点配置，并支持重复检测防止误添加。

- 🏷️ **站点信息管理**  
  多种方式获取真实站点名称，支持检测签到能力与站点健康状态，也可以手动添加任意兼容的中转站点。

- 👥 **多账号总览面板**  
  每个站点支持多个账号，提供账号分组、置顶和智能排序，一眼查看余额、使用情况与健康状态。

- 🔑 **令牌与密钥管理**  
  便捷查看、复制和管理 API Key，支持批量操作，并可一键导出到下游工具。

- 🤖 **模型信息与价格**  
  清晰展示各站点支持的模型列表和价格信息，以及相关配置细节。

- 🔄 **自建 New API 管理**  
  面向自建 New API 实例提供专门工具：支持模型列表同步、正则白名单过滤、同步日志查看，并在插件内直接管理渠道配置，详见 [New API 模型同步](https://all-api-hub.qixing1217.top/new-api-model-sync.html) 与 [New API 渠道管理](https://all-api-hub.qixing1217.top/new-api-channel-management.html)。

- 📆 **自动签到，不再白白浪费额度**  
  自动识别哪些站点支持每日签到，标记当天尚未签到的账号，让你在一个面板里按顺序完成多站点签到，减少因为“忘记点一下”而损失的免费额度。

- 🚀 **快速导出集成**  
  一键导出站点与渠道配置到 [CherryStudio](https://github.com/CherryHQ/cherry-studio)、[CC Switch](https://github.com/ccswitch/ccswitch)、[CLIProxyAPI](https://github.com/router-for-me/CLIProxyAPI) 和 [New API](https://github.com/QuantumNous/new-api)，详见 [快速导出站点配置](https://all-api-hub.qixing1217.top/quick-export.html)。

- 🛡️ **Cloudflare 过盾助手**  
  通过临时窗口与可选的 Cookie / WebRequest 权限自动处理 Cloudflare 五秒盾等防护，确保站点可以稳定识别和刷新数据，详见 [Cloudflare 过盾助手](https://all-api-hub.qixing1217.top/cloudflare-helper.html)。

- ☁️ **数据备份与恢复**  
  支持 JSON 导入导出，以及 [WebDAV 备份与自动同步](https://all-api-hub.qixing1217.top/webdav-sync.html) 和 [数据导入导出](https://all-api-hub.qixing1217.top/data-management.html)，在多设备间同步配置并保障数据安全。

- 🌐 **全平台支持**  
  兼容 Chrome、Edge、Firefox 等浏览器，并支持 Kiwi Browser 等移动端浏览器，适配深色模式。

- 🔒 **隐私优先的本地存储**  
  默认完全离线运行，所有数据存储在本地浏览器中；WebDAV 与外部 API 仅在你显式配置后才会使用。

> [!NOTE]
> 最初基于 [One API Hub](https://github.com/fxaxg/one-api-hub) 开发，现已大幅重构扩展。数据格式保持兼容，支持直接导入


## 🖥️ 截图展示

<table>
  <tr>
    <td align="center" width="50%">
      <img src="docs/docs/static/image/current-site-check.png" alt="current-site-check" style="width:100%; height:auto;"/>
      <div>站点重复检测（一）</div>
    </td>
    <td align="center" width="50%">
      <img src="docs/docs/static/image/try-add-existing-site.png" alt="try-add-existing-site" style="width:100%; height:auto;"/>
      <div>站点重复检测（二）</div>
    </td>
  </tr>
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
      <img src="docs/docs/static/image/new-api-channel-sync.png" alt="new-api-channel-sync" style="width:100%; height:auto;"/>
      <div>New API 模型同步</div>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="docs/docs/static/image/new-api-channel-manage.png" alt="new-api-channel-manage" style="width:100%; height:auto;"/>
      <div>New API 渠道管理</div>
    </td>
    <td align="center">
      <img src="docs/docs/static/image/import-and-export-setting.png" alt="import-and-export-setting" style="width:100%; height:auto;"/>
      <div>导入导出配置</div>
    </td>
  </tr>
</table>

## 🚀 安装使用

| 渠道 | 下载链接 | 当前版本 |
|------|----------|----------|
| Chrome 商店 | [Chrome 商店](https://chromewebstore.google.com/detail/lapnciffpekdengooeolaienkeoilfeo) | ![Chrome version](https://img.shields.io/chrome-web-store/v/lapnciffpekdengooeolaienkeoilfeo?label=Chrome&logo=googlechrome&style=flat) |
| Edge 商店 | [Edge 商店](https://microsoftedge.microsoft.com/addons/detail/pcokpjaffghgipcgjhapgdpeddlhblaa) | ![Edge version](https://img.shields.io/badge/dynamic/json?label=Edge&prefix=v&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Fpcokpjaffghgipcgjhapgdpeddlhblaa&logo=microsoftedge&style=flat) |
| Firefox 商店 | [Firefox 商店](https://addons.mozilla.org/firefox/addon/{bc73541a-133d-4b50-b261-36ea20df0d24}) | ![Firefox version](https://img.shields.io/amo/v/%7Bbc73541a-133d-4b50-b261-36ea20df0d24%7D?label=Firefox&logo=firefoxbrowser&style=flat) |
| GitHub Release | [Release 下载](https://github.com/qixing-jk/all-api-hub/releases) | ![GitHub version](https://img.shields.io/github/v/release/qixing-jk/all-api-hub?label=GitHub&logo=github&style=flat) |

### 手动安装

1. 下载最新版本的扩展包
2. 打开 Chrome 浏览器，进入 `chrome://extensions/`
3. 开启 "开发者模式"
4. 点击 "加载已解压的扩展程序"
5. 选择解压后的扩展文件夹

## 🧑‍🚀 新手快速上手

1. **安装并固定插件图标**：从 Chrome / Edge / Firefox 商店或 GitHub Release 安装最新版本，在浏览器工具栏中固定 All API Hub，方便随时打开。
2. **先登录各个中转站账号**：像平时一样在浏览器标签页里打开 New API / one-api 等站点并完成登录，插件会复用这些登录状态。
3. **添加第一个账号**：点击浏览器工具栏中的插件图标 → 在首页点击“新增账号” → 粘贴站点地址并选择“自动识别”。如遇 Cloudflare 五秒盾，只需在弹出的辅助窗口中等待或完成验证。
4. **在面板中查看账号信息**：回到插件弹窗或“账号管理”页面，可以按站点查看余额、模型和密钥，配合搜索、分组和排序快速找到需要的账号。
5. **快速导出到常用软件（可选）**：在“密钥管理”页面，为目标站点找到对应密钥，使用“导出”功能，一键推送到 CherryStudio、CC Switch、CLIProxyAPI 或 New API，而不必逐项复制粘贴。
6. **连接自建 New API（可选）**：如果你有自建 New API，前往“基础设置 → New API 集成设置”填写管理员 URL、Token、用户 ID，然后在“模型同步”和“渠道管理（Beta）”页面维护渠道和模型白名单。
7. **备份配置并在多设备间同步（可选）**：在“基础设置 → 数据与备份”的“导入与导出”区域导出 JSON 备份，或在页面下方配置 WebDAV 自动同步，在多台设备之间共享同一份配置。

更多详细步骤和进阶配置，请参阅文档站的[快速上手指南](https://all-api-hub.qixing1217.top/get-started.html)。

## 🛠️ 开发指南

请参阅 [CONTRIBUTING](CONTRIBUTING.md) 以获取更多信息。

## 🏗️ 技术栈

- **框架**: [WXT](https://wxt.dev) 负责多浏览器扩展工具链与构建流程
- **UI 层**: [React](https://react.dev) 构建插件选项页与弹窗界面
- **语言**: [TypeScript](https://www.typescriptlang.org) 提供端到端的类型安全
- **样式**: [Tailwind CSS](https://tailwindcss.com) 以原子化工具类驱动主题样式
- **组件**: [Headless UI](https://headlessui.com) 提供无样式可访问组件与设计系统基石


## 🙏 致谢

- 感谢 [@AngleNaris](https://github.com/AngleNaris) 设计了项目 Logo 🎨
- [WXT](https://wxt.dev) - 现代化的浏览器扩展开发框架

---

<div align="center">
  <strong>⭐ 如果这个项目对你有帮助，请考虑给它一个星标！</strong>
</div>
