# 开始使用

一个开源的浏览器插件，旨在优化管理 New API 等 AI 中转站账号的体验。用户可以轻松集中管理和查看账户余额、模型及密钥，并自动添加新站点。原则上只要浏览器支持扩展，通常就可以在移动端使用。

## 1. 下载


### 渠道版本对比

| 渠道 | 下载链接 | 当前版本 | 用户数 |
|------|----------|----------|--------|
| Chrome 商店 | [Chrome 商店](https://chromewebstore.google.com/detail/lapnciffpekdengooeolaienkeoilfeo) | [![Chrome version](https://img.shields.io/chrome-web-store/v/lapnciffpekdengooeolaienkeoilfeo?label=Chrome&logo=googlechrome&style=flat)](https://chromewebstore.google.com/detail/lapnciffpekdengooeolaienkeoilfeo) | [![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/lapnciffpekdengooeolaienkeoilfeo?label=Chrome%20Users)](https://chromewebstore.google.com/detail/lapnciffpekdengooeolaienkeoilfeo) |
| Edge 商店 | [Edge 商店](https://microsoftedge.microsoft.com/addons/detail/pcokpjaffghgipcgjhapgdpeddlhblaa) | [![Edge version](https://img.shields.io/badge/dynamic/json?label=Edge&prefix=v&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Fpcokpjaffghgipcgjhapgdpeddlhblaa&logo=microsoftedge&style=flat)](https://microsoftedge.microsoft.com/addons/detail/pcokpjaffghgipcgjhapgdpeddlhblaa) | [![Edge Add-ons Users](https://img.shields.io/badge/dynamic/json?label=Edge%20Users&query=$.activeInstallCount&url=https://microsoftedge.microsoft.com/addons/getproductdetailsbycrxid/pcokpjaffghgipcgjhapgdpeddlhblaa)](https://microsoftedge.microsoft.com/addons/detail/pcokpjaffghgipcgjhapgdpeddlhblaa) |
| Firefox 商店 | [Firefox 商店](https://addons.mozilla.org/firefox/addon/{bc73541a-133d-4b50-b261-36ea20df0d24}) | [![Firefox version](https://img.shields.io/amo/v/%7Bbc73541a-133d-4b50-b261-36ea20df0d24%7D?label=Firefox&logo=firefoxbrowser&style=flat)](https://addons.mozilla.org/firefox/addon/{bc73541a-133d-4b50-b261-36ea20df0d24}) | [![Mozilla Add-on Users](https://img.shields.io/amo/users/%7Bbc73541a-133d-4b50-b261-36ea20df0d24%7D?label=Firefox%20Users)](https://addons.mozilla.org/firefox/addon/{bc73541a-133d-4b50-b261-36ea20df0d24}) |
| GitHub Releases | [查看全部版本](https://github.com/qixing-jk/all-api-hub/releases) | [![GitHub version](https://img.shields.io/github/v/release/qixing-jk/all-api-hub?label=GitHub&logo=github&style=flat)](https://github.com/qixing-jk/all-api-hub/releases/latest) | [![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/qixing-jk/all-api-hub/total?label=Total%20Downloads)](https://github.com/qixing-jk/all-api-hub/releases) |

::: tip 商店版和 Release 版的区别
- 默认推荐使用商店版。
- 商店版更适合大多数用户，安装更省事，后续通常可自动更新。
- Release 版需要手动下载、解压，并在更新后再次手动安装或重新加载。
- 只有在你明确需要更早获取新版本、手动验证修复，或必须加载扩展包时，再考虑使用 Release 版。

移动端 / 手机端补充说明：
- 原则上只要浏览器支持扩展，通常就可以使用，例如 `Edge`、`Firefox for Android`、`Kiwi` 等。
- 更多说明可查看 [常见问题中的移动端使用](./faq.md#mobile-browser-support)。
:::

<details>
<summary>Release 类型选择</summary>

先选版本类型，再下载对应附件：

| 类型 | 推荐场景 | 下载链接 | 特点 |
|------|----------|----------|------|
| 正式版 Stable | 日常使用、首次安装、优先稳定 | [下载最新正式版](https://github.com/qixing-jk/all-api-hub/releases/latest) | 对应正式发布版本，发布说明更完整，稳定性更高。 |
| Nightly 预发布 | 想尽快获取新功能 / 修复，或协助验证问题 | [下载 Nightly](https://github.com/qixing-jk/all-api-hub/releases/tag/nightly) | 基于 `main` 最新提交自动生成，更新更快，但可能包含尚未充分验证的改动；附件文件名通常会带 `nightly`。 |

::: tip 如何选择
- 不确定选哪个时，先选正式版 Stable。
- 如果你是为了确认某个修复是否已经包含，或愿意帮助反馈问题，再选择 Nightly。
- 商店版本通常会因审核延迟 1-3 天；GitHub 正式版一般更早，Nightly 最快，但风险也更高。
:::

</details>

### Safari 浏览器安装

Safari 不能像 Chrome、Edge、Firefox 一样直接通过商店安装或解压加载，必须通过 Xcode 安装。完整步骤请查看 [Safari 安装指南](./safari-install.md)。

推荐安装方式：

1. 从 GitHub Release 下载 `all-api-hub-<version>-safari-xcode-bundle.zip`，解压后直接打开其中的 Xcode 工程运行。

高级用法：

1. 从源码构建：`pnpm install` -> `pnpm run build:safari` -> `xcrun safari-web-extension-converter .output/safari-mv2/` -> 用 Xcode 运行。

::: warning Safari 下载注意事项
请下载 `all-api-hub-<version>-safari-xcode-bundle.zip`，不要单独下载 `all-api-hub-<version>-safari.zip`。前者已经包含可直接打开的 Xcode 工程和运行所需文件，更适合普通安装流程。
:::

如需正式签名并通过 TestFlight / App Store 分发，通常还需要 Apple Developer Program 账号；否则一般只适合本机调试或自用。

### QQ / 360 等浏览器安装

如果你使用 QQ 浏览器、360 安全浏览器、360 极速浏览器、猎豹浏览器、Brave、Vivaldi、Opera 等浏览器，请下载 GitHub Release 中的 Chrome 版本压缩包，并参考 [QQ / 360 等浏览器安装指南](./other-browser-install.md) 进行解压加载。

## 2. 支持的站点

支持基于以下项目部署的中转站：
- [one-api](https://github.com/songquanpeng/one-api)
- [new-api](https://github.com/QuantumNous/new-api)
- [Veloera](https://github.com/Veloera/Veloera)
- [one-hub](https://github.com/MartialBE/one-hub)
- [done-hub](https://github.com/deanxv/done-hub)
- [AxonHub](https://github.com/looplj/axonhub)
- WONG公益站
- [Sub2API](https://github.com/Wei-Shaw/sub2api)
- [AnyRouter](https://anyrouter.top)
- [VoAPI](https://github.com/VoAPI/VoAPI)
- [Super-API](https://github.com/SuperAI-Api/Super-API)
- Neo-API
- RIX_API（基本功能支持）

完整的兼容站点请查看 [支持的站点与系统类型](./supported-sites.md)。

::: warning
如果站点进行了二次开发导致一些关键接口（例如 `/api/user`）发生了改变，则插件可能无法正常添加此站点。
:::

## 3. 添加站点

::: info 提示
必须先使用浏览器自行登录目标网站，这样插件的自动识别功能才能读取您的登录信息，并获取账号信息。
:::

### 3.1 自动识别添加

1. 打开插件主页面，点击 `新增账号`

![新增账号](./static/image/add-account-btn.png)

2. 输入中转站地址，点击 `自动识别`

![自动识别](./static/image/add-account-dialog-btn.png)

3. 确认自动识别无误后点击 `确认添加`

::: info 提示
插件会自动识别您账号的各种信息，如：
- 用户名
- 用户 ID
- [访问令牌(Access Token)](#manual-addition)
- 充值金额比例
:::

> 若目标站点启用了 Cloudflare 五秒盾，插件会自动弹出独立窗口帮助过盾；通过后即可继续识别流程。
> 如IP质量不佳或其他原因，则需要在超时前手动在弹出的窗口中完成过盾。

### 3.2 Cloudflare 过盾助手概览

- 识别到 Cloudflare 五秒盾时，插件会自动拉起一个临时窗口帮助完成校验；若挑战需要人工干预，请在弹窗内点击验证即可。
- 校验通过后会自动回到原始流程，继续获取 Access Token 和站点信息。
- 更多细节可参考 [Cloudflare 防护与临时窗口降级](#cloudflare-window-downgrade)。

<a id="manual-addition"></a>
### 3.3 手动添加

::: info 提示
当自动识别未成功后，可进行手动输入添加站点账号，需要先获取以下信息。（每个站点可能 UI 有所差异，请自行寻找）
:::
![用户信息](./static/image/site-user-info.png)

如果目标站点为魔改版本（如 AnyRouter），请在添加账号时手动切换到 **Cookie 模式**，再执行自动识别或手动填写。遇到严格防护的站点时，也可以结合 Cloudflare 过盾助手配合使用。详情可查看 [常见问题](./faq.md#anyrouter-error)。

<a id="quick-export-sites"></a>
## 4. 快速导出与集成

本插件支持将已添加的站点 API 配置导出到本地客户端、CLI 工具和自建托管站点，从而减少重复录入 `Base URL`、密钥与模型配置的工作量。当前完整列表请查看 [支持的导出工具与集成目标](./supported-export-tools.md)。

### 4.1 配置

在使用导出 / 集成功能前，请根据目标类型完成对应配置：

- **CherryStudio / CC Switch**：保持目标客户端可用，便于通过 Deeplink 唤起导入。
- **Kilo Code / Roo Code**：建议提前确认每个密钥对应的模型 ID。
- **CLIProxyAPI / Claude Code Router**：在基础设置中填写对应的管理地址与凭证。
- **自建托管站点（New API / DoneHub / Veloera / Octopus / AxonHub / Claude Code Hub）**：在 `设置 -> 基础设置 -> 自建站点管理` 中完成后台配置。

### 4.2 导出流程

1. **导航至密钥管理**：在插件的 **密钥管理** 页面，找到您想要导出的站点对应的 API 密钥。
2. **点击对应操作**：在密钥操作菜单中，选择 **“导出到 CherryStudio”**、**“导出到 CC Switch”**、**“导出 Kilo Code JSON”**、**“导入到 CLIProxyAPI”**、**“导入到 Claude Code Router”** 或 **“导入到当前自建站点”**。
3. **自动处理**：
   * **对于 CherryStudio / CC Switch**：插件会按照目标应用的 Deeplink 协议，自动传递站点信息和 API 密钥。
   * **对于 Kilo Code / Roo Code**：插件会生成可复制或下载的配置 JSON，便于手动导入。
   * **对于 CLIProxyAPI / Claude Code Router / 自建托管站点**：插件会调用对应管理接口，创建或更新 Provider / Channel。

通过这些集成能力，您可以把同一个上游站点同步到多个下游工具或后台系统，无需手动重复粘贴。

## 5. 核心功能深入指南

### 📊 资产看板与统计
- **5.1 [资产总览与实时刷新](./auto-refresh.md)**：集中查看多站余额、用量与健康状态，支持定时自动同步。
- **5.2 [余额历史记录](./balance-history.md)**：按天记录余额、收入与支出快照，直观呈现资产变动趋势。
- **5.3 [用量统计分析](./usage-analytics.md)**：多维度分析 Token 消耗、模型分布、费用支出及响应延迟。
- **5.4 [账号管理与维护](./account-management.md)**：高效地添加、组织（标签/置顶）与清理重复账号。

### 🔑 密钥管理与快捷集成
- **5.5 [令牌管理 (Tokens)](./key-management.md)**：集中管理站点令牌，支持一键补全后台隐藏的 Key。
- **5.6 [独立 API 凭证](./api-credential-profiles.md)**：无需账号即可保存 URL+Key，支持标签分类与批量可用性验证。
- **5.7 [快捷导出功能](./quick-export.md)**：将配置快速推送到 CherryStudio、CC Switch、Kilo Code 等 [第三方工具](./supported-export-tools.md)。
- **5.8 [网页 API 嗅探](./web-ai-api-check.md)**：在网页内通过右键或探测功能，快速识别并测试 API 配置。

### ⚡ 自动化与额度收益
- **5.9 [自动签到流](./auto-checkin.md)**：一键处理支持签到的站点，支持定时任务与自定义页面跳转。
- **5.10 [兑换助手 (Redemption Assist)](./redemption-assist.md)**：自动识别网页兑换码，弹出悬浮窗匹配账号并一键领取。
- **5.11 [书签收纳管理](./bookmark-management.md)**：集中收藏 AI 相关的控制台、文档、充值页与兑换入口。

### 🛡️ 稳定性与安全防护
- **5.12 [Cloudflare 过盾助手](./cloudflare-helper.md)**：协助通过五秒盾挑战，确保数据刷新、签到与 API 调用不中断。
- **5.13 [账号安全验证 (2FA)](./new-api-security-verification.md)**：支持自建站点管理中的 OTP、两步验证与 Passkey 挑战。
- **5.14 [WebDAV 同步与加密](./webdav-sync.md)**：支持跨设备加密备份，确保配置数据安全且永不丢失。

### 🛠️ 自建站点运营工具
- **5.15 [自建站点管理](./self-hosted-site-management.md)**：在插件内直接对 New API、AxonHub 等系统的渠道进行增删改查。
- **5.16 [模型同步](./managed-site-model-sync.md) 与 [重定向](./model-redirect.md)**：批量同步上游模型，并配置“标准模型”到“实际模型”的映射逻辑。

### 🎨 个性化定制与进阶
- **5.17 [排序优先级设置](./sorting-priority.md)**：按余额、健康度或签到需求自定义账号显示的先后顺序。
- **5.18 [分享快照](./share-snapshot.md)**：生成隐藏敏感信息的精美看板图片，内置动态背景，方便分享。
- **5.19 [LDOH 站点信誉查找](./ldoh-site-lookup.md)**：基于 Linux.do 社区数据自动匹配讨论帖，了解站点口碑。
- **5.20 [开发者实验室](./developer-tools.md)**：视觉调试与背景自定义。

## 6. 安装与数据管理

- [Safari 浏览器安装指南](./safari-install.md)
- [QQ / 360 等浏览器安装指南](./other-browser-install.md)
- [权限管理 (可选权限)](./permissions.md)
- [数据导入与导出](./data-management.md)

## 7. 常见问题与支持

- 查看更详细的 [常见问题](./faq.md)，了解认证方式、AnyRouter 适配、功能使用技巧等。
- 如果遇到问题或需要新功能，欢迎前往 [GitHub Issues](https://github.com/qixing-jk/all-api-hub/issues) 进行反馈。
- 了解历史更新请查看 [更新日志](./changelog.md)。

::: tip 下一步
完成基础设置后，您可以继续配置自动刷新、签到检测或 WebDAV 同步，以获得更完整的使用体验。
:::

