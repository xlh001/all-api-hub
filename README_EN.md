<h4 align="center">
<a href="./README.md">简体中文</a> | English
</h4>

<hr/>

<div align="center">
  <img src="assets/icon.png" alt="All API Hub Logo" width="128" height="128">

# All API Hub – AI Relay & New API Manager

**Open-source browser extension for both third-party New API-compatible relays and your own New API instance: auto-detect accounts, view balances, sync models, manage keys, with cross-platform and cloud backup support**

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

**[Documentation](https://all-api-hub.qixing1217.top/en) | [FAQ](https://all-api-hub.qixing1217.top/en/faq.html)**

</div>

## 📖 Introduction

Nowadays, within the AI ecosystem, there's a growing number of aggregated relay stations and custom dashboards built upon the New API series. Simultaneously managing the balances, model lists, and API keys across these various platforms often proves to be both fragmented and time-consuming.

All API Hub, a browser plugin, can automatically recognize accounts on these platforms, allowing users to view balances, manage models and keys, and perform automatic check-ins with a single click. Furthermore, it offers tools such as model synchronization and channel management for self-built New API instances. It currently supports relay station accounts from projects such as:

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

- 🔍 **Smart Site Detection**  
  Automatically detects AI aggregation / relay sites based on common New API‑series projects, creates access tokens, parses pricing and configuration, and prevents duplicates.

- 🏷️ **Rich Site Information Management**  
  Retrieves real site names in multiple ways, tracks check‑in capability and health, and lets you add any compatible relay site manually.

- 👥 **Multi‑Account Dashboard**  
  Manage multiple accounts per site with grouping, pinning, and smart sorting. Balances, usage stats, and health state are all visible at a glance.

- 🔑 **Token & Key Management**  
  Conveniently inspect, copy, and manage API keys, with support for bulk operations and one‑click export to downstream tools.

- 🤖 **Model Information & Pricing**  
  View the models supported by each site together with pricing and key configuration details.

- 🔄 **New API Management (Own Instance)**  
  For your own New API instance, provide dedicated tools to synchronize model lists, filter via regex, review sync logs, and manage channels directly from the extension UI. See [New API Model Sync](https://all-api-hub.qixing1217.top/en/new-api-model-sync.html) and [New API Channel Management](https://all-api-hub.qixing1217.top/en/new-api-channel-management.html) for details.

- 📆 **Automatic check‑in so you don’t forget**  
  Detects which relay sites support daily check‑in and keeps track of who still needs it. Once enabled, you can handle check‑ins from a single place so you don’t lose free quota just because you forgot to visit each dashboard.

- 🚀 **Quick Export Integration**  
  One‑click export of configurations to [CherryStudio](https://github.com/CherryHQ/cherry-studio), [CC Switch](https://github.com/ccswitch/ccswitch), [CLIProxyAPI](https://github.com/router-for-me/CLIProxyAPI) and [New API](https://github.com/QuantumNous/new-api). See [Quick Export Site Configuration](https://all-api-hub.qixing1217.top/en/quick-export.html) for details.

- 🛡️ **Cloudflare Bypass Assistant**  
  Uses a temporary window and optional cookie / webRequest permissions to reliably pass Cloudflare‑style 5‑second shields so data refresh and detection continue to work. See [Cloudflare Bypass Assistant](https://all-api-hub.qixing1217.top/en/cloudflare-helper.html) for details.

- ☁️ **Data Backup and Recovery**  
  Export/import JSON, and configure [WebDAV backup and automatic synchronization](https://all-api-hub.qixing1217.top/en/webdav-sync.html) and [data import/export](https://all-api-hub.qixing1217.top/en/data-management.html) to keep configurations safe and synchronized across devices.

- 🌐 **Cross‑Platform Compatible**  
  Works on Chrome, Edge, Firefox and Chromium‑based mobile browsers like Kiwi, with automatic dark‑mode support.

- 🔒 **Privacy‑First Local Storage**  
  Runs fully offline by default; all data is stored locally in your browser. WebDAV and external APIs are only used when explicitly configured.

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

## 🧑‍🚀 Quick Start Guide for New Users

1. **Install and pin the extension**: Install All API Hub from the Chrome/Edge/Firefox store or GitHub Release, then pin the icon to your toolbar so it’s easy to open.
2. **Sign in to your relay sites**: In normal browser tabs, open each relay site you use (New API, one-api, etc.) and log in as usual. The extension reuses these sessions when adding accounts.
3. **Add your first account**: Click the All API Hub icon → click “Add Account” → paste the site URL and choose “Auto-Identify.” If a Cloudflare 5‑second challenge appears, finish it in the helper window and the detection continues automatically.
4. **View everything in one place**: In the popup or on the “Account Management” page, you’ll see balances, models, and keys for each site. Use search, grouping, and sorting to quickly find the account you care about.
5. **Export to your favorite tools (optional)**: On the **Key Management** page, use **Export** to send channels and keys into CherryStudio, CC Switch, CLIProxyAPI, or New API instead of copying values by hand.
6. **Connect your own New API (optional)**: If you host New API yourself, go to **Settings → New API**, fill in the Admin URL / Token / User ID, then use the **New API Model Sync** and **Channel Management (Beta)** pages to keep channels and model lists in sync.
7. **Back up and sync across devices (optional)**: Use **Settings → Data & Backup** to export a JSON backup, or configure WebDAV automatic sync so your configuration follows you to other browsers and machines.

For a more detailed walkthrough and advanced setup, see the [Getting Started guide](https://all-api-hub.qixing1217.top/en/get-started.html).

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