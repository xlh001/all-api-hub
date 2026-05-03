<h4 align="center">
<a href="./README.md">简体中文</a> | English
</h4>

<hr/>

<div align="center">
  <img src="src/assets/icon.png" alt="All API Hub Logo" width="128" height="128">

# All API Hub – Your All-in-One AI Asset Manager

**One-stop management for New API-compatible relay accounts: balance/usage dashboards, model price comparison, automatic check-in, site keys and standalone API credential management, in-page API availability testing, and channel/model sync & redirect**

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

**[⚡ Quick Start](https://all-api-hub.qixing1217.top/en/get-started.html) | [📚 Docs](https://all-api-hub.qixing1217.top/en/) | [🔌 Integrations](https://all-api-hub.qixing1217.top/en/supported-export-tools.html) | [🌐 Supported Sites](https://all-api-hub.qixing1217.top/en/supported-sites.html) | [❓ FAQ](https://all-api-hub.qixing1217.top/en/faq.html) | [📜 Changelog](https://all-api-hub.qixing1217.top/en/changelog.html)**

<p align="center">
  <strong>📢 Discussion:</strong>
  <a href="https://linux.do/t/topic/1001042">All API Hub Thread on Linux.do</a>
</p>

<a id="community"></a>
<p align="center">
  <strong>💬 Community:</strong> 
  <a href="./resources/wechat_group.png">
    <img alt="WeChat-Chinese Group" src="https://img.shields.io/badge/WeChat-Chinese%20Group-green" />
  </a>
  <a href="https://discord.gg/RmFXZ577ZQ">
    <img alt="Discord-Multilingual Community" src="https://img.shields.io/badge/Discord-Multilingual%20Community-5865F2?logo=discord&logoColor=white">
  </a>
  <a href="https://t.me/qixing_chat">
    <img alt="Telegram-Multilingual Group" src="https://img.shields.io/badge/Telegram-Multilingual%20Group-blue?logo=telegram">
  </a>
</p>

---

</div>

<a id="introduction"></a>
## ❓ Why All API Hub?

In the AI ecosystem, many of us use multiple relay sites based on the New API / Sub2API family to balance cost and model variety. However, this often brings several management challenges:

- 📂 **Multi-site Management Difficulty**: Balances, usage, and pricing are scattered across different panels, making it hard to track total assets at a glance.
- 💲 **Inconvenient Price Comparison**: Billing ratios vary significantly by site, making it difficult to find the most cost-effective option efficiently.
- ✅ **Tedious Check-in Maintenance**: Manually handling daily check-ins for multiple sites is time-consuming and prone to forgetfulness, leading to expired credits.
- 🔌 **Tedious Tool Configuration**: Copying API keys into various AI tools over and over is inefficient and manual-intensive.

**All API Hub was built to streamline these workflows.** It turns scattered relay accounts into a centralized, visual management console for your AI assets.

### 🧩 Broad Compatibility
We support almost all mainstream relay architectures:
- **Mainstream open source**: [one-api](https://github.com/songquanpeng/one-api), [new-api](https://github.com/QuantumNous/new-api), [Sub2API](https://github.com/Wei-Shaw/sub2api), [one-hub](https://github.com/MartialBE/one-hub), [done-hub](https://github.com/deanxv/done-hub), [Veloera](https://github.com/Veloera/Veloera)
- **Specialized architectures**: [AnyRouter](https://anyrouter.top), Neo-API, Super-API, and others
- **Full list**: 👉 [Supported Sites](https://all-api-hub.qixing1217.top/en/supported-sites.html)

<a id="features"></a>
## ✨ Core Values & Features

### 📊 Unified Multi-site Dashboard
- **Multi-account asset overview**: See balances, total usage, and health status for all sites in one panel.
- **Smart site detection**: Paste a site URL and let the extension automatically identify the architecture type and billing ratio during setup.
- **Standalone credential profiles**: Manage `URL + Key` pairs directly with tags, making it as easy as managing browser bookmarks.

### 💰 Smarter Savings and Automatic Gains
- **Model price comparison**: Automatically calculate each site's effective model pricing so you can lock onto the most cost-effective group and site.
- **Fully automated check-in flow**: Handle check-ins for all supported sites with one click or on a schedule, so stored quota does not go unused.
- **Deep usage statistics**: Generate reports by site, account, model, and date, including heatmaps and slow-request analysis.

### 🚀 Fast Ecosystem Integration
- **One-click quick export**: Deep integration for instant sync to **CherryStudio, CC Switch, CLIProxyAPI, Claude Code Router, Kilo Code**, and more.
- **Admin workflow tools**: Productivity features for self-hosted site admins, including channel management, model redirection, and channel syncing.
- **Web Sniffing & Quick Entry**: Select a Base URL or API Key on any webpage to quickly test and save, see [Web AI API Sniffing & Verification](https://all-api-hub.qixing1217.top/en/web-ai-api-check.html) for details.
- **Supported integrations**: 👉 [Supported Tools](https://all-api-hub.qixing1217.top/en/supported-export-tools.html)

### 🧪 Reliability Safeguards
- **Multi-dimensional API verification**: Batch test model availability, token compatibility, and CLI proxy availability.
- **Cloudflare challenge assistant**: Helps you pass Cloudflare checks automatically so refreshes and API calls are less likely to be interrupted.

### 🔒 Privacy & Sync
- **Privacy first**: Data stays in local storage by default, with no usage telemetry uploaded.
- **Encrypted sync**: Supports encrypted WebDAV backup and sync for seamless migration across multiple devices.


> [!NOTE]
> Used to love [One API Hub](https://github.com/fxaxg/one-api-hub)? You’ll love All API Hub even more. We’ve significantly refactored it while maintaining full data compatibility for a seamless one-click import.

<a id="ui-preview"></a>
## 🖼️ UI Preview

<table>
  <tr>
    <td align="center">
      <img src="docs/docs/static/image/en/account-manage.png" alt="account-manage" style="width:100%; height:auto;"/>
      <div>Account Management Overview</div>
    </td>
    <td align="center">
      <img src="docs/docs/static/image/en/model-list.png" alt="model-list" style="width:100%; height:auto;"/>
      <div>Model List & Pricing</div>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="docs/docs/static/image/en/api-key-list.png" alt="api-key-list" style="width:100%; height:auto;"/>
      <div>Key List & Export</div>
    </td>
    <td align="center">
      <img src="docs/docs/static/image/en/auto-check-in.png" alt="auto-check-in" style="width:100%; height:auto;"/>
      <div>Auto Check-in</div>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="docs/docs/static/image/en/account-model-usage-overview.png" alt="account-model-usage-overview" style="width:100%; height:auto;"/>
      <div>Account Model Usage Overview</div>
    </td>
    <td align="center">
      <img src="docs/docs/static/image/en/account-model-latency-overview.png" alt="account-model-latency-overview" style="width:100%; height:auto;"/>
      <div>Account Model Latency Overview</div>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="docs/docs/static/image/en/new-api-channel-sync.png" alt="new-api-channel-sync" style="width:100%; height:auto;"/>
      <div>New API Model Sync</div>
    </td>
    <td align="center">
      <img src="docs/docs/static/image/en/new-api-channel-manage.png" alt="new-api-channel-manage" style="width:100%; height:auto;"/>
      <div>New API Channel Management</div>
    </td>
  </tr>
</table>

<a id="installation"></a>
## 🚀 Installation

| Channel | Download Link | Current Version | Users |
|------|----------|----------|-------|
| Chrome Web Store | [Chrome Web Store](https://chromewebstore.google.com/detail/lapnciffpekdengooeolaienkeoilfeo) | [![Chrome version](https://img.shields.io/chrome-web-store/v/lapnciffpekdengooeolaienkeoilfeo?label=Chrome&logo=googlechrome&style=flat)](https://chromewebstore.google.com/detail/lapnciffpekdengooeolaienkeoilfeo) | [![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/lapnciffpekdengooeolaienkeoilfeo?label=Chrome%20Users)](https://chromewebstore.google.com/detail/lapnciffpekdengooeolaienkeoilfeo) |
| Edge Add-ons | [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/pcokpjaffghgipcgjhapgdpeddlhblaa) | [![Edge version](https://img.shields.io/badge/dynamic/json?label=Edge&prefix=v&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Fpcokpjaffghgipcgjhapgdpeddlhblaa&logo=microsoftedge&style=flat)](https://microsoftedge.microsoft.com/addons/detail/pcokpjaffghgipcgjhapgdpeddlhblaa) | [![Edge Add-ons Users](https://img.shields.io/badge/dynamic/json?label=Edge%20Users&query=$.activeInstallCount&url=https://microsoftedge.microsoft.com/addons/getproductdetailsbycrxid/pcokpjaffghgipcgjhapgdpeddlhblaa)](https://microsoftedge.microsoft.com/addons/detail/pcokpjaffghgipcgjhapgdpeddlhblaa) |
| Firefox Add-ons | [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/{bc73541a-133d-4b50-b261-36ea20df0d24}) | [![Firefox version](https://img.shields.io/amo/v/%7Bbc73541a-133d-4b50-b261-36ea20df0d24%7D?label=Firefox&logo=firefoxbrowser&style=flat)](https://addons.mozilla.org/firefox/addon/{bc73541a-133d-4b50-b261-36ea20df0d24}) | [![Mozilla Add-on Users](https://img.shields.io/amo/users/%7Bbc73541a-133d-4b50-b261-36ea20df0d24%7D?label=Firefox%20Users)](https://addons.mozilla.org/firefox/addon/{bc73541a-133d-4b50-b261-36ea20df0d24}) |
| GitHub Releases | [Browse Releases](https://github.com/qixing-jk/all-api-hub/releases) | [![GitHub version](https://img.shields.io/github/v/release/qixing-jk/all-api-hub?label=GitHub&logo=github&style=flat)](https://github.com/qixing-jk/all-api-hub/releases/latest) | [![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/qixing-jk/all-api-hub/total?label=Total%20Downloads)](https://github.com/qixing-jk/all-api-hub/releases) |

> [!TIP]
> Store builds are the recommended default.
> - Store builds are better for most users because installation is simpler and updates are usually automatic.
> - Release builds require manual download, extraction, and manual reinstall or reload when a newer version comes out.
> - Use a Release build only when you explicitly need earlier access to a new version, want to verify a fix manually, or need to load the extension package yourself.
>
> Mobile note:
> - In general, if a mobile browser supports extensions, the extension can usually run there, such as `Edge`, `Firefox for Android`, and `Kiwi`.
> - For QQ Browser, 360 Browser, Liebao Browser, Brave, Vivaldi, Opera, and similar browsers, see the [QQ / 360 and similar browser installation guide](https://all-api-hub.qixing1217.top/en/other-browser-install.html).
> - See the [mobile usage FAQ](https://all-api-hub.qixing1217.top/en/faq.html#mobile-browser-support) for setup notes and limitations.

<details>
<summary>Choosing a Release Track</summary>

Choose the release track first, then download the matching asset:

| Track | Best For | Download Link | Notes |
|------|----------|----------|-------|
| Stable | Everyday use, first-time installs, stability first | [Download latest stable](https://github.com/qixing-jk/all-api-hub/releases/latest) | Official release builds with clearer release notes and better day-to-day stability. |
| Nightly pre-release | Early access to new features / fixes, or issue verification and feedback | [Download Nightly](https://github.com/qixing-jk/all-api-hub/releases/tag/nightly) | Built automatically from the latest `main` commit. It updates faster, but may include changes that have not been fully validated yet. Nightly assets usually include `nightly` in the filename. |

> [!TIP]
> - If you're unsure, start with Stable.
> - Choose Nightly when you want to check whether a fix has landed, or when you're willing to help verify and report issues.
> - Store builds usually lag by 1-3 days because of review. GitHub Stable often appears earlier, and Nightly is the fastest but also the riskiest.

</details>

<details>
<summary>Manual installation for QQ / 360 and similar browsers (Load unpacked)</summary>

1. Download the latest release package.
2. For QQ Browser, 360 Browser, Liebao Browser, Brave, Vivaldi, Opera, and similar browsers, download `all-api-hub-<version>-chrome.zip`.
3. Extract it to a stable folder, and make sure that folder directly contains `manifest.json`.
4. Open the extensions management page, such as `chrome://extensions/`, `qqbrowser://extensions`, `liebao://extensions/`, `brave://extensions/`, `vivaldi://extensions/`, or `opera://extensions/`.
5. Enable "Developer mode".
6. Click "Load unpacked".
7. Select the unzipped extension folder.

</details>

<details>
<summary>Manual install for Chromium browsers (desktop)</summary>

Use this when the store version is unavailable, or when you want to load a GitHub Release asset manually.

1. Download and extract the `*-chrome.zip` package from GitHub Releases.
2. Open the extensions page: use `chrome://extensions/` in Chrome or `edge://extensions/` in Edge.
3. Enable "Developer mode".
4. Click "Load unpacked".
5. Select the extracted extension directory.

</details>

<details>
<summary>Safari installation (Xcode required)</summary>

Safari cannot use the normal unpacked flow used by Chrome or Edge. It must be installed through Xcode. For step-by-step instructions, see [Safari Installation Guide](docs/docs/en/safari-install.md).

Recommended path:

1. Open the [latest release](https://github.com/qixing-jk/all-api-hub/releases/latest) and download `all-api-hub-<version>-safari-xcode-bundle.zip`.
2. Extract it and open the included Xcode project directly.

Advanced path:

1. Build from source: `pnpm install` -> `pnpm run build:safari` -> `xcrun safari-web-extension-converter .output/safari-mv2/`.
2. Open and run the generated Xcode project.

> [!WARNING]
> Download `all-api-hub-<version>-safari-xcode-bundle.zip`, not `all-api-hub-<version>-safari.zip`.
> The bundle already includes the Xcode project and Safari files needed for the standard install flow.

With a paid Apple Developer Program account, you can properly sign and distribute it through TestFlight / App Store. Without one, it is usually limited to local development or personal use.

<details>
<summary>Why this file?</summary>

`all-api-hub-<version>-safari-xcode-bundle.zip` typically includes:

- `all-api-hub-<version>-safari.zip`
- `safari-mv2/`
- the generated Xcode project directory

That means you can extract it and open the Xcode project directly, without manually reassembling the Safari files it depends on.

</details>

</details>

<a id="quick-start"></a>
## 🧑‍🚀 Quick Start Guide for New Users

[Getting Started guide](https://all-api-hub.qixing1217.top/en/get-started.html).

<a id="development-guide"></a>
## 🛠️ Development Guide

Please refer to the [CONTRIBUTING](CONTRIBUTING.md) for more information.

<a id="tech-stack"></a>
## 🏗️ Tech Stack

- **Framework**: [WXT](https://wxt.dev) powers the multi-browser extension tooling and build pipeline
- **UI Layer**: [React](https://react.dev) drives the options UI and popup experiences
- **Language**: [TypeScript](https://www.typescriptlang.org) keeps the entire codebase type-safe
- **Styling**: [Tailwind CSS](https://tailwindcss.com) supplies utility-first theming primitives
- **Components**: [Headless UI](https://headlessui.com) provides unstyled accessible primitives for our design system

<a id="acknowledgements"></a>
## 🙏 Acknowledgements

- Thanks to [@AngleNaris](https://github.com/AngleNaris) for designing the project logo 🎨
- Thanks to the [Linux.do community](https://linux.do) for feedback, testing, and word-of-mouth support, especially through the [All API Hub thread on Linux.do](https://linux.do/t/topic/1001042).
- [WXT](https://wxt.dev) - The modern browser extension development framework.

---

<div align="center">
  <strong>⭐ If you find this project helpful, please consider giving it a star!</strong>
</div>
