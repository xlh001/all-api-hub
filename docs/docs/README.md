---
home: true
title: "首页"
heroImage: "/512.png"
heroText: "All API Hub - 你的全能 AI 资产管家"
tagline: "开源浏览器插件，统一管理第三方 AI 聚合中转站与自建 New API：自动识别账号、比对模型价格、验证 API/CLI 兼容性、同步模型与渠道，并支持跨平台与加密 WebDAV 备份"
actions:
  - text: "开始使用"
    link: "./get-started.html"
    type: "primary"

  - text: "Chrome 商店"
    link: "https://chromewebstore.google.com/detail/lapnciffpekdengooeolaienkeoilfeo"
    type: "secondary"

  - text: "Edge 商店"
    link: "https://microsoftedge.microsoft.com/addons/detail/pcokpjaffghgipcgjhapgdpeddlhblaa"
    type: "secondary"

  - text: "FireFox 商店"
    link: "https://addons.mozilla.org/firefox/addon/{bc73541a-133d-4b50-b261-36ea20df0d24}"
    type: "secondary"
    
  - text: "Safari 安装"
    link: "./safari-install.html"
    type: "secondary"

features:
  - title: "📦 资产统一看板"
    details: "把多个站点与账号集中在一个面板里，余额、用量与健康状态一眼看清，支持智能识别地址自动添加。"
  - title: "🏷️ 独立 API 凭证"
    details: "无需账号，直接保存 Base URL + Key，支持标签分类，完美复用模型查看与接口验证功能。"
  - title: "💰 模型价格比对"
    details: "跨站对比各模型实际折合单价，自动锁定当前最优分组，助你寻找最实惠的调用路径。"
  - title: "✅ 深度接口验证"
    details: "批量测试模型可用性、Token 兼容性及 CLI 代理连通性，轻松排查“站点能通、工具报错”的问题。"
  - title: "📈 用量深度统计"
    details: "按日期、账号、模型多维分析用量与花费，提供热力图、延迟视图与慢请求分析。"
  - title: "📅 自动签到辅助"
    details: "集中识别并处理支持签到的站点，支持定时自动签到、自定义 URL 与充值/兑换页面跳转。"
  - title: "🚀 极速生态集成"
    details: "一键同步到 CherryStudio、CC Switch、Kilo Code 等，或直接将账号推送到自建管理后台。"
  - title: "🛠️ 自建站点联动"
    details: "深度适配 New API、AxonHub、Claude Code Hub 等，实现渠道管理、模型同步与重定向。"
  - title: "🔒 隐私与安全同步"
    details: "默认本地存储，支持加密 WebDAV 自动同步与备份，遇到 Cloudflare 挑战时可自动协助过盾。"

footer: "AGPL-3.0 Licensed | Copyright 2025-present All API Hub"
---

## 介绍

现在 AI 生态里有越来越多基于 New API 系列的聚合中转站和自建面板，要同时管理各站点的余额、用量、模型价格和 API 密钥可用性，往往既分散又费时。

All API Hub 作为浏览器插件，可以自动识别这些站点的账号，并一键查看余额、用量、模型价格、管理模型与密钥、执行自动签到，还支持独立 API 凭证管理，以及为自建 New API、DoneHub、Veloera、Octopus、AxonHub 与 Claude Code Hub 提供后台联动和渠道相关工具。

## 🎯 你的使用场景

根据你的身份和需求，快速找到对应文档：

### 我是 AI 工具的使用者
- **快速开始**：[下载并安装扩展](./get-started.md) -> [添加我的第一个账号](./get-started.md#3-添加站点)
- **资产管理**：[查看余额历史](./balance-history.md) -> [分析我的用量消耗](./usage-analytics.md)
- **账号维护**：[组织与清理账号](./account-management.md)
- **省钱方案**：[跨站模型价格比对](./model-list.md) -> [自动签到获取额度](./auto-checkin.md)
- **一键导出**：[同步站点到 CherryStudio / CC Switch](./get-started.md#4-快速导出与集成)

### 我拥有很多独立 API Key
- **凭证管理**：[将 URL+Key 保存为独立凭证](./api-credential-profiles.md)
- **可用性测试**：[批量验证接口与 CLI 兼容性](./web-ai-api-check.md)
- **书签收纳**：[集中管理文档与兑换页](./bookmark-management.md)

### 我是自建站点（New API 等）的管理员
- **效率工具**：[在插件内管理渠道](./self-hosted-site-management.md) -> [批量同步模型](./managed-site-model-sync.md)
- **配置优化**：[设置模型重定向](./model-redirect.md)
- **安全保障**：[处理 2FA / OTP 验证](./new-api-security-verification.md)

---

## 支持的站点系统

- [one-api](https://github.com/songquanpeng/one-api)
- [new-api](https://github.com/QuantumNous/new-api)
- [Veloera](https://github.com/Veloera/Veloera)
- [one-hub](https://github.com/MartialBE/one-hub)
- [done-hub](https://github.com/deanxv/done-hub)
- [AxonHub](https://github.com/looplj/axonhub)
- [Sub2API](https://github.com/Wei-Shaw/sub2api)
- [AnyRouter](https://anyrouter.top)
- WONG公益站
- Neo-API（闭源）
- Super-API（闭源）
- RIX_API（闭源，基本功能支持）
- VoAPI（闭源，老版本支持）

如果你在 macOS 上通过 Safari 使用扩展，请先查看 [Safari 安装指南](./safari-install.md)。Safari 需要通过 Xcode 安装，和 Chrome / Edge / Firefox 的商店安装或解压加载方式不同。

如果你使用 QQ 浏览器、360 安全浏览器、360 极速浏览器、猎豹浏览器、Brave、Vivaldi、Opera 等浏览器，请查看 [QQ / 360 等浏览器安装指南](./other-browser-install.md)。

<a id="community"></a>
## 💬 社区交流

如果你想更快地交流使用问题、排查配置、分享兼容站点，推荐使用下面这些社区渠道：

- [GitHub Discussions](https://github.com/qixing-jk/all-api-hub/discussions)：适合整理问题、沉淀经验和长期讨论。
- [Discord 社区](https://discord.gg/RmFXZ577ZQ)：面向多语言用户，功能多样，适合讨论和问题排查。
- [Telegram 群](https://t.me/qixing_chat)：适合多语言用户快速交流。
- 微信群：扫描下方二维码加入中文交流群。

<img
  src="../../resources/wechat_group.png"
  alt="All API Hub 微信群二维码"
  style="width: min(280px, 100%);"
/>
