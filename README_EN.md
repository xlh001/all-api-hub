<h4 align="center">
<a href="./README.md">简体中文</a> | English
</h4>

<hr/>

<div align="center">
  <img src="assets/icon.png" alt="All API Hub Logo" width="128" height="128">

# All API Hub

**An open-source browser extension to aggregate and manage the balance, models, and keys of all your API hub accounts, saying goodbye to tedious logins.**

<p align="center">
<a href="https://github.com/qixing-jk/all-api-hub/releases">
  <img alt="Latest Release" src="https://img.shields.io/github/v/release/qixing-jk/all-api-hub?style=flat">
</a>
<a href="https://github.com/qixing-jk/all-api-hub/stargazers">
  <img alt="Stars" src="https://img.shields.io/github/stars/qixing-jk/all-api-hub?style=flat">
</a>
<a href="https://github.com/qixing-jk/all-api-hub/issues">
  <img alt="Issues" src="https://img.shields.io/github/issues/qixing-jk/all-api-hub?style=flat">
</a>
<a href="https://github.com/qixing-jk/all-api-hub/blob/main/LICENSE">
  <img alt="License" src="https://img.shields.io/github/license/qixing-jk/all-api-hub?style=flat">
</a>
</p>

**[Documentation](https://qixing-jk.github.io/all-api-hub/en) | [FAQ](https://qixing-jk.github.io/all-api-hub/en/faq.html)**

</div>

---

> [!NOTE]  
> This is an open-source project, developed based on [One API Hub](https://github.com/fxaxg/one-api-hub).

## 📖 Introduction

There are too many AI-API relay sites on the market, and it's very troublesome to check information such as balance and supported model lists, requiring logging in one by one.

This extension allows for convenient integrated management of AI relay station accounts based on the following projects:

- [one-api](https://github.com/songquanpeng/one-api)
- [new-api](https://github.com/QuantumNous/new-api)
- [Veloera](https://github.com/Veloera/Veloera)
- [one-hub](https://github.com/MartialBE/one-hub)
- [done-hub](https://github.com/deanxv/done-hub)
- [VoAPI](https://github.com/VoAPI/VoAPI)
- [Super-API](https://github.com/SuperAI-Api/Super-API)

## 🧬 Feature Changes

- 🌐 **Broader Site Support** - Added support for sites like VoAPI, Super-API, etc.
- 🚀 **Quick Site Export** - Supports one-click export of site API configurations to [CherryStudio](https://github.com/CherryHQ/cherry-studio) and [New API](https://github.com/QuantumNous/new-api), simplifying the API management workflow.
- ✅ **Site Check-in Status Detection** - Supports detecting whether a site supports check-in and its check-in status.
- 🔄 **Duplicate Site Detection** - Prevent the repeated addition of the same site and quickly modify the currently added site.
- ️🏷️ **Smart Site Name Fetching** - There are multiple ways to obtain the real site name, and the domain name method is used as the last resort.
- ☁️ **WebDav Data Backup** - Supports backing up and restoring all accounts and settings via WebDav, ensuring data security and enabling cross-device synchronization.
- 📝 **Manual Add** - Supports manually adding any relay site, preventing failures when automatic detection doesn't work.
- 🌓 **Dark Mode** - Support automatic switching based on system theme
- ⚙️ **Firefox Support** - The extension is now available for Firefox browsers.

> [!NOTE]
> Data is compatible with [One API Hub](https://github.com/fxaxg/one-api-hub) and can be imported directly.

## ✨ Features

- 🔍 **Auto-detect Relay Sites** - Automatically creates a system access token and adds it to the extension's site list.
- 💰 **Auto-detect Top-up Ratios** - Intelligently parses site configuration information.
- 👥 **Multi-account Management** - Add multiple accounts for each site, with support for account grouping and switching.
- 📊 **Balance & Log Viewing** - Account balance and usage logs at a glance.
- 🔑 **Token (Key) Management** - Convenient key viewing and management.
- 🤖 **Model Information Viewing** - View supported model information and channels for each site.
- ⚙️ **Data Import/Export** - Supports data backup and recovery in JSON format.
- 🔒 **Fully Offline** - The extension works offline, protecting your privacy.

## 🖥️ Screenshots

<div style="display: flex; justify-content: center; gap: 20px; box-sizing: border-box; flex-wrap: wrap;">
  <figure>
    <img src="docs/docs/static/image/current-site-check.png" alt="current-site-check" style="width:49%;height:auto;">
    <img src="docs/docs/static/image/try-add-existing-site.png" alt="try-add-existing-site" style="width:49%;height:auto;">
    <figcaption style="text-align:center;">Duplicate Site Detection</figcaption>
  </figure>
</div>
  <figure>
    <img src="docs/docs/static/image/model-list.png" alt="model-list" style="height:auto;">
    <figcaption style="text-align:center;">Model List</figcaption>
  </figure>
  <figure>
    <img src="docs/docs/static/image/import-and-export-setting.png" alt="import-and-export-setting" style="height:auto;">
    <figcaption style="text-align:center;">Data Import/Export</figcaption>
  </figure>
  <figure>
    <img src="docs/docs/static/image/api-key-list.png" alt="api-key-list" style="height:auto;">
    <figcaption style="text-align:center;">Key List</figcaption>
  </figure>
  <figure>
    <img src="docs/docs/static/image/account-manage.png" alt="account-manage" style="height:auto;">
    <figcaption style="text-align:center;">Account Management</figcaption>
  </figure>

## 🚀 Installation

### Chrome App Store (Recommended)

[🔗 Go to download](https://chromewebstore.google.com/detail/lapnciffpekdengooeolaienkeoilfeo)

### Edge App Store (Recommended)

[🔗 Go to download](https://microsoftedge.microsoft.com/addons/detail/pcokpjaffghgipcgjhapgdpeddlhblaa)

### FireFox App Store (Recommended)
[🔗 Go to download](https://addons.mozilla.org/firefox/addon/%E4%B8%AD%E8%BD%AC%E7%AB%99%E7%AE%A1%E7%90%86%E5%99%A8-all-api-hub/)

### Manual Installation

1. Download the latest release package.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode".
4. Click "Load unpacked".
5. Select the unzipped extension folder.

## 🛠️ Development Guide

### Prerequisites

- Node.js 18+
- npm or pnpm

### Local Development

```bash
# Clone the project
git clone https://github.com/username/all-api-hub.git
cd all-api-hub

# Install dependencies
pnpm install
# or
npm install

# Start the development server
pnpm dev
# or
npm run dev
```

Then, load the `build/chrome-mv3-dev` directory as an unpacked extension in your browser.

### Building for Production

```bash
pnpm build
# or 
npm run build
```

This will create the production-ready extension package in the `build` directory.


## 🏗️ Tech Stack

- **Framework**: [Plasmo](https://plasmo.com)
- **UI Library**: [React](https://reactjs.org)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Components**: [Headless UI](https://headlessui.com)
- **Icons**: [Heroicons](https://heroicons.com)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs)
- **Type Checking**: [TypeScript](https://typescriptlang.org)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Plasmo](https://plasmo.com) - The modern browser extension development framework.

---

<div align="center">
  <strong>⭐ If you find this project helpful, please consider giving it a star!</strong>
</div>