---
home: true
title: "Homepage"
heroImage: "/512.png"
heroText: "All API Hub - Your All-in-One AI Asset Manager"
tagline: "Open-source browser extension to unify the management of third-party AI aggregation relays and self-built New APIs: automatically identify accounts, compare model prices, verify API/CLI compatibility, synchronize models and channels, and support cross-platform and encrypted WebDAV backups."
actions:
  - text: "Get Started"
    link: "./get-started.html"
    type: "primary"

  - text: "Chrome Store"
    link: "https://chromewebstore.google.com/detail/lapnciffpekdengooeolaienkeoilfeo"
    type: "secondary"

  - text: "Edge Store"
    link: "https://microsoftedge.microsoft.com/addons/detail/pcokpjaffghgipcgjhapgdpeddlhblaa"
    type: "secondary"

  - text: "FireFox Store"
    link: "https://addons.mozilla.org/firefox/addon/{bc73541a-133d-4b50-b261-36ea20df0d24}"
    type: "secondary"
    
  - text: "Safari Install"
    link: "./safari-install.html"
    type: "secondary"

features:
  - title: "📦 Unified Asset Dashboard"
    details: "Consolidate multiple sites and accounts into a single panel for a clear overview of balances, usage, and health status, with smart site identification."
  - title: "🏷️ Independent API Credentials"
    details: "Save Base URL + Key without a site account. Support tag filtering and reuse for model viewing and API validation."
  - title: "💰 Model Price Comparison"
    details: "Compare actual costs across different sites, automatically identify the best group, and find the most cost-effective path."
  - title: "✅ In-depth API Validation"
    details: "Batch test model availability, Token compatibility, and CLI proxy connectivity to troubleshoot integration issues."
  - title: "📈 Detailed Usage Analytics"
    details: "Analyze usage and costs by date, account, and model. Includes heatmaps, latency views, and slow request analysis."
  - title: "📅 Auto Check-in Assistant"
    details: "Centrally manage check-ins for supported sites. Includes automatic scheduled check-ins and custom URL jumps."
  - title: "🚀 Fast Ecosystem Integration"
    details: "Instant sync to CherryStudio, CC Switch, Kilo Code, or push accounts directly to your self-hosted management backend."
  - title: "🛠️ Self-hosted Site Linkage"
    details: "Deeply adapted for New API, AxonHub, Claude Code Hub, and more, enabling channel management and model sync."
  - title: "🔒 Privacy & Secure Sync"
    details: "Local-first storage with encrypted WebDAV sync. Includes a Cloudflare assistant to handle bot challenges automatically."

footer: "AGPL-3.0 Licensed | Copyright 2025-present All API Hub"
---

## Introduction

In the current AI ecosystem, there are an increasing number of aggregation relay sites and self-built panels based on the New API series. Managing balances, usage, model prices, and API key availability for various sites simultaneously is often scattered and time-consuming.

All API Hub, as a browser extension, can automatically identify accounts on these sites and provide one-click access to view balances, usage, model prices, manage models and keys, and perform automatic check-ins. It also offers independent API credential management and provides backend linkage and channel-related tools for self-built New API, DoneHub, Veloera, Octopus, AxonHub, and Claude Code Hub.

## 🎯 Use Cases

Find the documentation you need based on your role:

### I am an AI Tool User
- **Quick Start**: [Download & Install](./get-started.md) -> [Add My First Account](./get-started.md#3-adding-a-site)
- **Asset Management**: [View Balance History](./balance-history.md) -> [Analyze Usage](./usage-analytics.md)
- **Account Maintenance**: [Organize & Clean Up Accounts](./account-management.md)
- **Cost Saving**: [Cross-site Price Comparison](./model-list.md) -> [Auto Check-in](./auto-checkin.md)
- **One-click Export**: [Sync to CherryStudio / CC Switch](./get-started.md#4-quick-export-and-integration)

### I have multiple Standalone API Keys
- **Credential Management**: [Save URL+Key as Credentials](./api-credential-profiles.md)
- **Connectivity Testing**: [Batch Verify API & CLI Compatibility](./web-ai-api-check.md)
- **Bookmark Collection**: [Manage Docs & Redemption Pages](./bookmark-management.md)

### I am a Self-hosted Admin (New API, etc.)
- **Efficiency Tools**: [Manage Channels within the Extension](./self-hosted-site-management.md) -> [Batch Sync Models](./managed-site-model-sync.md)
- **Configuration Optimization**: [Setup Model Redirection](./model-redirect.md)
- **Security**: [Handle 2FA / OTP Verification](./new-api-security-verification.md)

---

## Supported Site Architectures

- [one-api](https://github.com/songquanpeng/one-api)
- [new-api](https://github.com/QuantumNous/new-api)
- [Veloera](https://github.com/Veloera/Veloera)
- [one-hub](https://github.com/MartialBE/one-hub)
- [done-hub](https://github.com/deanxv/done-hub)
- [AxonHub](https://github.com/looplj/axonhub)
- [Sub2API](https://github.com/Wei-Shaw/sub2api)
- [AnyRouter](https://anyrouter.top)
- WONG Public Welfare Site
- Neo-API (Closed-source)
- Super-API (Closed-source)
- RIX_API (Closed-source, basic functionality supported)
- VoAPI (Closed-source, older versions supported)

If you are using the extension on macOS via Safari, please refer to the [Safari Installation Guide](./safari-install.md) first. Safari requires installation via Xcode, which differs from the store installation or unpacked loading methods for Chrome/Edge/Firefox.

If you use browsers such as QQ Browser, 360 Secure Browser, 360 Speed Browser, Cheetah Browser, Brave, Vivaldi, Opera, etc., please refer to the [QQ / 360 and Other Browsers Installation Guide](./other-browser-install.md).

<a id="community"></a>
## 💬 Community Communication

If you want to communicate faster about usage issues, troubleshoot configurations, or share compatible sites, we recommend using the following community channels:

- [GitHub Discussions](https://github.com/qixing-jk/all-api-hub/discussions): Suitable for organizing issues, accumulating experience, and long-term discussions.
- [Discord Community](https://discord.gg/RmFXZ577ZQ): For multi-language users, with diverse features, suitable for discussions and troubleshooting.
- [Telegram Group](https://t.me/qixing_chat): Suitable for fast communication among multi-language users.
- WeChat Group: Scan the QR code below to join the Chinese communication group.

<img
  src="../../../resources/wechat_group.png"
  alt="All API Hub WeChat Group QR Code"
  style="width: min(280px, 100%);"
/>
