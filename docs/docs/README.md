---
home: true
title: "首页"
heroImage: "/512.png"
heroText: "All API Hub - AI 聚合中转站管理器"
tagline: "开源浏览器插件，统一管理第三方 AI 聚合中转站与自建 New API：自动识别账号、查看余额、同步模型、管理密钥，并支持跨平台与云端备份"
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
  - title: "智能站点管理"
    details: "自动识别 AI 聚合中转站点并创建访问令牌，智能获取站点名称和充值比例，支持重复检测和手动添加。"
  - title: "多账号体系"
    details: "支持每个站点添加多个账号，账号分组与快速切换，实时查看余额和详细使用日志。"
  - title: "令牌与密钥管理"
    details: "便捷管理所有 API Key，支持查看、复制、刷新和批量操作。"
  - title: "模型信息查看"
    details: "清晰展示站点支持的模型列表和价格信息。"
  - title: "签到状态监控"
    details: "自动检测哪些站点支持签到，并标记当天尚未签到的账号，让你在一个面板里按顺序完成多站点签到，减少因为忘记签到而浪费的免费额度。"
  - title: "快速导出集成"
    details: "一键导出配置到 CherryStudio、CC Switch、Kilo Code、CLIProxyAPI、Claude Code Router 以及自建托管站点。"
  - title: "自建站点后台联动"
    details: "支持对自建 New API、DoneHub、Veloera 与 Octopus 实例进行后台联动与渠道相关操作。"
  - title: "数据备份恢复"
    details: "支持 JSON 格式导入导出和 WebDav 云端备份，实现跨设备数据同步。"
  - title: "全平台支持"
    details: "兼容 Chrome、Edge、Firefox 等浏览器，也支持移动端 / 手机端浏览器使用，例如手机 Edge、Firefox for Android、Kiwi 等，适配深色模式。"
  - title: "隐私与安全"
    details: "完全离线运行，所有数据本地存储，无需联网即可使用全部核心功能。"
  - title: "Cloudflare 过盾助手"
    details: "遇到五秒盾自动弹窗过盾，确保站点可被识别和记录。"

footer: "AGPL-3.0 Licensed | Copyright 2025-present All API Hub"
---

## 介绍

现在 AI 生态里有越来越多基于 New API 系列的聚合中转站和自建面板，要同时管理各站点的余额、模型列表和 API 密钥，往往既分散又费时。

All API Hub 作为浏览器插件，可以自动识别这些站点的账号，并一键查看余额、管理模型、密钥与自动签到，并为自建 New API、DoneHub、Veloera 与 Octopus 提供后台联动和渠道相关工具。当前已支持基于以下项目的中转站账号：

- [one-api](https://github.com/songquanpeng/one-api)
- [new-api](https://github.com/QuantumNous/new-api)
- [Veloera](https://github.com/Veloera/Veloera)
- [one-hub](https://github.com/MartialBE/one-hub)
- [done-hub](https://github.com/deanxv/done-hub)
- [Sub2API](https://github.com/Wei-Shaw/sub2api)
- [AnyRouter](https://anyrouter.top)
- WONG公益站
- Neo-API（闭源）
- Super-API（闭源）
- RIX_API（闭源，基本功能支持）
- VoAPI（闭源，老版本支持）

如果你在 macOS 上通过 Safari 使用扩展，请先查看 [Safari 安装指南](./safari-install.md)。Safari 需要通过 Xcode 安装，和 Chrome / Edge / Firefox 的商店安装或解压加载方式不同。

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
