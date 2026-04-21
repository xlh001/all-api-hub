---
home: true
title: "首页"
heroImage: "/512.png"
heroText: "All API Hub - AI 聚合中转站管理器"
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
  - title: "智能站点识别"
    details: "登录后粘贴站点地址即可添加账号，自动识别站点名称、充值比例等信息；识别失败可手动补录，并会提示重复添加。"
  - title: "多账号总览"
    details: "把多个站点与账号集中在一个面板里，余额、用量与健康状态一眼看清，并支持自动刷新。"
  - title: "独立 API 凭证档案"
    details: "可脱离站点账号单独保存 baseUrl 与 API Key，按标签筛选，并复用到模型查看、接口验证和状态统计。"
  - title: "模型与价格比对"
    details: "不仅能看模型列表，还支持按来源、计费方式、分组和账号筛选，对比价格、倍率与实际成本，并标出最低价或最优组。"
  - title: "模型与接口验证"
    details: "支持模型可用性验证、批量验证、Token 兼容性判断，以及 CLI 兼容性检查，适合排查“站点可用但工具不可用”的问题。"
  - title: "用量分析与延迟排查"
    details: "按站点、账号、Token、日期筛选与对比用量、花费、模型分布和趋势，并提供热力图、延迟与慢请求视图辅助排查。"
  - title: "自动签到与兑换跳转"
    details: "集中识别支持签到的站点并处理签到状态，支持自动签到、自定义签到 URL 与充值 / 兑换页跳转。"
  - title: "快速导出集成"
    details: "一键导出到 CherryStudio、CC Switch、CLIProxyAPI、Claude Code Router、Kilo Code，以及当前选择的自建托管站点。"
  - title: "自建站点后台联动"
    details: "支持对自建 New API、DoneHub、Veloera 与 Octopus 实例进行渠道导入、模型同步、模型重定向与后台联动。"
  - title: "WebDAV 备份与同步"
    details: "支持 JSON 导入导出、WebDAV 自动同步、选择性同步与备份加密，实现跨设备与多浏览器迁移。"
  - title: "Cloudflare 过盾助手"
    details: "遇到 Cloudflare 挑战时自动弹出协助窗口，验证完成后继续原有识别、刷新或签到流程。"
  - title: "全平台支持"
    details: "兼容 Chrome、Edge、Firefox、Safari 与移动端 / 手机端浏览器，例如手机 Edge、Firefox for Android、Kiwi 等，适配深色模式。"
  - title: "隐私优先"
    details: "默认本地优先存储，无遥测数据收集；只有在你配置 WebDAV 或外部接口时，才会访问对应服务。"

footer: "AGPL-3.0 Licensed | Copyright 2025-present All API Hub"
---

## 介绍

现在 AI 生态里有越来越多基于 New API 系列的聚合中转站和自建面板，要同时管理各站点的余额、用量、模型价格和 API 密钥可用性，往往既分散又费时。

All API Hub 作为浏览器插件，可以自动识别这些站点的账号，并一键查看余额、用量、模型价格、管理模型与密钥、执行自动签到，还支持独立 API 凭证管理，以及为自建 New API、DoneHub、Veloera 与 Octopus 提供后台联动和渠道相关工具。当前已支持基于以下项目的中转站账号：

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
