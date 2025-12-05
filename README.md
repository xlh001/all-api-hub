<h4 align="center">
简体中文 | <a href="./README_EN.md">English</a>
</h4>

<hr/>

<div align="center">
  <img src="assets/icon.png" alt="All API Hub Logo" width="128" height="128">

# 中转站管理器 - All API Hub

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

**[文档教程](https://qixing-jk.github.io/all-api-hub/) | [常见问题](https://qixing-jk.github.io/all-api-hub/faq.html)**

</div>

## 📖 介绍

目前市面上有大量 AI 聚合中转站点，每次查看余额、模型列表和密钥等信息都需要逐个登录，非常繁琐。
本插件可以自动识别并整合管理基于以下项目的 AI 聚合中转站账号：

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
  面向自建 New API 实例提供专门工具：支持模型列表同步、正则白名单过滤、同步日志查看，并在插件内直接管理渠道配置，详见 [New API 模型同步](docs/docs/new-api-model-sync.md) 与 [New API 渠道管理](docs/docs/new-api-channel-management.md)。

- 📆 **自动签到，不再白白浪费额度**  
  自动识别哪些站点支持每日签到，标记当天尚未签到的账号，让你在一个面板里按顺序完成多站点签到，减少因为“忘记点一下”而损失的免费额度。

- 🚀 **快速导出集成**  
  一键导出站点与渠道配置到 [CherryStudio](https://github.com/CherryHQ/cherry-studio)、[CC Switch](https://github.com/ccswitch/ccswitch)、[CLIProxyAPI](https://github.com/router-for-me/CLIProxyAPI) 和 [New API](https://github.com/QuantumNous/new-api)，详见 [快速导出站点配置](docs/docs/quick-export.md)。

- 🛡️ **Cloudflare 过盾助手**  
  通过临时窗口与可选的 Cookie / WebRequest 权限自动处理 Cloudflare 五秒盾等防护，确保站点可以稳定识别和刷新数据，详见 [Cloudflare 过盾助手](docs/docs/cloudflare-helper.md)。

- ☁️ **数据备份与恢复**  
  支持 JSON 导入导出，以及 [WebDAV 备份与自动同步](docs/docs/webdav-sync.md) 和 [数据导入导出](docs/docs/data-management.md)，在多设备间同步配置并保障数据安全。

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

## 🧑‍🚀 新手快速上手

1. **安装并登录目标站点**：从 Chrome/Edge/Firefox 商店或 GitHub Release 安装最新版本，启用后固定在浏览器工具栏，并先在浏览器里登录需要管理的中转站账号。
2. **自动识别添加账号**：打开插件 → 点击“新增账号” → 输入站点地址并选择“自动识别”。若遇到 Cloudflare 五秒盾会自动弹出过盾窗口；魔改站点可切换到 Cookie 模式或手动补全 Token 信息。
3. **整理与同步账户数据**：在账号卡片中查看余额、模型与密钥，使用分组/排序/快速跳转定位站点；需要实时数据时，可在“基础设置 → 自动刷新”里开启定时刷新、健康状态与签到检测。
4. **管理签到与站点功能**：在账号详情启用签到监控、充值链接、今日收入提示，结合“站点重复检测”避免重复添加，遇到特殊站点可根据提示调整检测策略。
5. **配置 New API 集成（可选）**：拥有自建 New API 时，前往“基础设置 → New API 集成设置”填写管理员 URL、Token、用户 ID，再使用“New API 模型同步”与“渠道管理（Beta）”维护渠道与模型白名单。
6. **快速导出到下游系统（可选）**：在“密钥管理”页面点击“一键导出”，即可将站点同步到 CherryStudio、CC Switch 或 New API。
7. **备份与协作**：通过“基础设置 → 数据管理”导入导出 JSON，或在“WebDAV 备份”中配置自动同步，在多设备间共享配置并保证数据安全。

### 手动安装

1. 下载最新版本的扩展包
2. 打开 Chrome 浏览器，进入 `chrome://extensions/`
3. 开启 "开发者模式"
4. 点击 "加载已解压的扩展程序"
5. 选择解压后的扩展文件夹

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
