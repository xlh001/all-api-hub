<h4 align="center">
<a href="./README.md">简体中文</a> | English
</h4>

<hr/>

<div align="center">
  <img src="assets/icon.png" alt="All API Hub Logo" width="128" height="128">

# All API Hub

**Open-source browser extension that auto-detects and manages all AI aggregation and relay site accounts. View balances, sync models, manage keys, with cross-platform and cloud backup support**

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

**[Documentation](https://qixing-jk.github.io/all-api-hub/en) | [FAQ](https://qixing-jk.github.io/all-api-hub/en/faq.html)**

</div>

## 📖 Introduction

With numerous AI aggregation and relay sites available, checking balances, model lists, and keys requires logging into each site individually—a tedious process.
This extension automatically detects and manages accounts from sites based on the following projects:

- [one-api](https://github.com/songquanpeng/one-api)
- [new-api](https://github.com/QuantumNous/new-api)
- [Veloera](https://github.com/Veloera/Veloera)
- [one-hub](https://github.com/MartialBE/one-hub)
- [done-hub](https://github.com/deanxv/done-hub)
- Neo-API (closed source)
- Super-API (closed source)
- RIX_API (closed source, basic functionality supported)
- VoAPI (closed source, old versions supported)

## ✨ Features

- 🔍 **Smart Site Detection** - Automatically identify AI aggregation and relay sites, create access tokens, intelligently parse pricing ratios and configurations, with duplicate detection
- 🏷️ **Site Information Management** - Multiple methods to retrieve real site names, check-in status detection and automatic check-in, manually add any AI aggregation and relay site
- 👥 **Multi-Account Management** - Support multiple accounts per site, account grouping and quick switching, balance and usage logs at a glance
- 🔑 **Token & Key Management** - Convenient API Key viewing and management, support quick copy and batch operations
- 🤖 **View Model Information** - View the list of models supported by the site and pricing information.
- 🔄 **New API System Management**
    - Manual triggers, per-channel filtering through model whitelists, and continuous sync with upstream suppliers.
    - Automatic model redirect generation plus the [New API Channel Management](docs/docs/en/new-api-channel-management.md) beta UI for in-extension channel maintenance.
- 🚀 **Quick Export Integration** - One-click export of configurations to [CherryStudio](https://github.com/CherryHQ/cherry-studio), [CC Switch](https://github.com/ccswitch/ccswitch), and [New API](https://github.com/QuantumNous/new-api), see [Quick Export Site Configuration](docs/docs/en/quick-export.md) for details.
- 🛡️ **Fearless Cloudflare Protection** - Automatically handles Cloudflare's 5-second challenge with a pop-up when a site enables it, see [Cloudflare Bypass Assistant](docs/docs/en/cloudflare-helper.md) for details.
- ☁️ **Data Backup and Recovery** - Supports JSON, [WebDAV backup and automatic synchronization](docs/docs/en/webdav-sync.md), as well as [data import/export](docs/docs/en/data-management.md).
- 🌐 **Cross-Platform Compatible** - Support Chrome, Firefox browsers, works on mobile devices via Kiwi Browser, with automatic dark mode switching
- 🔒 **Privacy & Security** - Fully offline operation, all data stored locally, protecting your privacy

> [!NOTE]
> Originally based on [One API Hub](https://github.com/fxaxg/one-api-hub), now significantly refactored and expanded. Data format remains compatible, supporting direct import

## 🖥️ Screenshots

<table>
  <tr>
    <td align="center" width="50%">
      <img src="docs/docs/static/image/en/current-site-check.png" alt="current-site-check" style="width:100%; height:auto;"/>
      <div>Duplicate Site Detection (1)</div>
    </td>
    <td align="center" width="50%">
      <img src="docs/docs/static/image/en/try-add-existing-site.png" alt="try-add-existing-site" style="width:100%; height:auto;"/>
      <div>Duplicate Site Detection (2)</div>
    </td>
  </tr>
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
      <img src="docs/docs/static/image/en/new-api-channel-sync.png" alt="new-api-channel-sync" style="width:100%; height:auto;"/>
      <div>New API Model Sync</div>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="docs/docs/static/image/en/new-api-channel-manage.png" alt="new-api-channel-manage" style="width:100%; height:auto;"/>
      <div>New API Channel Management</div>
    </td>
    <td align="center">
      <img src="docs/docs/static/image/en/import-and-export-setting.png" alt="import-and-export-setting" style="width:100%; height:auto;"/>
      <div>Import / Export Settings</div>
    </td>
  </tr>
</table>

## 🧑‍🚀 Quick Start Guide for New Users

1. **Install and log in to target sites**: Grab the latest build from Chrome/Edge/Firefox stores or GitHub Release, enable the extension, pin it, and sign in to the relay stations you want to manage in your browser first.
2. **Auto-recognize new accounts**: Open the extension → click “Add Account” → enter the site URL and choose “Auto-Identify.” If Cloudflare’s 5-second challenge triggers, a helper window opens automatically; for heavily customized sites, switch to Cookie mode or fill in token data manually.
3. **Organize & sync account data**: Review balances, models, and keys on each card, then use grouping/sorting/quick jump for navigation. For fresh data, go to “Basic Settings → Auto Refresh” to enable scheduled refresh, health state, and check-in detection.
4. **Manage check-in & site utilities**: Enable check-in monitoring, recharge links, or today’s revenue hints in account details. Pair with duplicate-site detection to avoid re-adding, and adjust detection strategies when prompted for special sites.
5. **Configure New API integration (optional)**: If you run your own New API, fill Administrator URL/Token/User ID under “Basic Settings → New API Integration,” then use “New API Model Sync” + “Channel Management (Beta)” to keep channels and model whitelists aligned.
6. **Quick export to downstream systems (optional)**: From “Key Management,” click “Export” to sync channels into CherryStudio, CC Switch, or New API.
7. **Backup & collaborate**: Use “Basic Settings → Data Management” to import/export JSON, or configure automatic sync under “WebDAV Backup” to keep multiple devices in sync and data safe.

## 🚀 Installation

| Channel | Download Link | Current Version |
|------|----------|----------|
| Chrome Web Store | [Chrome Web Store](https://chromewebstore.google.com/detail/lapnciffpekdengooeolaienkeoilfeo) | ![Chrome version](https://img.shields.io/chrome-web-store/v/lapnciffpekdengooeolaienkeoilfeo?label=Chrome&logo=googlechrome&style=flat) |
| Edge Add-ons | [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/pcokpjaffghgipcgjhapgdpeddlhblaa) | ![Edge version](https://img.shields.io/badge/dynamic/json?label=Edge&prefix=v&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Fpcokpjaffghgipcgjhapgdpeddlhblaa&logo=microsoftedge&style=flat) |
| Firefox Add-ons | [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/{bc73541a-133d-4b50-b261-36ea20df0d24}) | ![Firefox version](https://img.shields.io/amo/v/%7Bbc73541a-133d-4b50-b261-36ea20df0d24%7D?label=Firefox&logo=firefoxbrowser&style=flat) |
| GitHub Release | [Release Download](https://github.com/qixing-jk/all-api-hub/releases) | ![GitHub version](https://img.shields.io/github/v/release/qixing-jk/all-api-hub?label=GitHub&logo=github&style=flat) |

### Manual Installation

1. Download the latest release package.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode".
4. Click "Load unpacked".
5. Select the unzipped extension folder.

## 🛠️ Development Guide

Please refer to the [CONTRIBUTING](CONTRIBUTING.md) for more information.

## 🏗️ Tech Stack

- **Framework**: [WXT](https://wxt.dev) powers the multi-browser extension tooling and build pipeline
- **UI Layer**: [React](https://react.dev) drives the options UI and popup experiences
- **Language**: [TypeScript](https://www.typescriptlang.org) keeps the entire codebase type-safe
- **Styling**: [Tailwind CSS](https://tailwindcss.com) supplies utility-first theming primitives
- **Components**: [Headless UI](https://headlessui.com) provides unstyled accessible primitives for our design system

## 🙏 Acknowledgements

- Thanks to [@AngleNaris](https://github.com/AngleNaris) for designing the project logo 🎨
- [WXT](https://wxt.dev) - The modern browser extension development framework.

---

<div align="center">
  <strong>⭐ If you find this project helpful, please consider giving it a star!</strong>
</div>