# Getting Started

An open-source browser extension designed to optimize the experience of managing AI proxy station accounts like New API. Users can easily manage and view account balances, models, and keys in a centralized location, with automatic site addition. In principle, as long as the browser supports extensions, it can usually be used on mobile devices.

## 1. Download

### Channel Version Comparison

| Channel | Download Link | Current Version | Users |
|---|---|---|---|
| Chrome Store | [Chrome Store](https://chromewebstore.google.com/detail/lapnciffpekdengooeolaienkeoilfeo) | [![Chrome version](https://img.shields.io/chrome-web-store/v/lapnciffpekdengooeolaienkeoilfeo?label=Chrome&logo=googlechrome&style=flat)](https://chromewebstore.google.com/detail/lapnciffpekdengooeolaienkeoilfeo) | [![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/lapnciffpekdengooeolaienkeoilfeo?label=Chrome%20Users)](https://chromewebstore.google.com/detail/lapnciffpekdengooeolaienkeoilfeo) |
| Edge Store | [Edge Store](https://microsoftedge.microsoft.com/addons/detail/pcokpjaffghgipcgjhapgdpeddlhblaa) | [![Edge version](https://img.shields.io/badge/dynamic/json?label=Edge&prefix=v&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Fpcokpjaffghgipcgjhapgdpeddlhblaa&logo=microsoftedge&style=flat)](https://microsoftedge.microsoft.com/addons/detail/pcokpjaffghgipcgjhapgdpeddlhblaa) | [![Edge Add-ons Users](https://img.shields.io/badge/dynamic/json?label=Edge%20Users&query=$.activeInstallCount&url=https://microsoftedge.microsoft.com/addons/getproductdetailsbycrxid/pcokpjaffghgipcgjhapgdpeddlhblaa)](https://microsoftedge.microsoft.com/addons/detail/pcokpjaffghgipcgjhapgdpeddlhblaa) |
| Firefox Store | [Firefox Store](https://addons.mozilla.org/firefox/addon/{bc73541a-133d-4b50-b261-36ea20df0d24}) | [![Firefox version](https://img.shields.io/amo/v/%7Bbc73541a-133d-4b50-b261-36ea20df0d24%7D?label=Firefox&logo=firefoxbrowser&style=flat)](https://addons.mozilla.org/firefox/addon/{bc73541a-133d-4b50-b261-36ea20df0d24}) | [![Mozilla Add-on Users](https://img.shields.io/amo/users/%7Bbc73541a-133d-4b50-b261-36ea20df0d24%7D?label=Firefox%20Users)](https://addons.mozilla.org/firefox/addon/{bc73541a-133d-4b50-b261-36ea20df0d24}) |
| GitHub Releases | [View All Releases](https://github.com/qixing-jk/all-api-hub/releases) | [![GitHub version](https://img.shields.io/github/v/release/qixing-jk/all-api-hub?label=GitHub&logo=github&style=flat)](https://github.com/qixing-jk/all-api-hub/releases/latest) | [![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/qixing-jk/all-api-hub/total?label=Total%20Downloads)](https://github.com/qixing-jk/all-api-hub/releases) |

::: tip Differences Between Store and Release Versions
- Store versions are recommended by default.
- Store versions are more suitable for most users, easier to install, and usually auto-update.
- Release versions require manual download, extraction, and re-installation or reloading upon update.
- Only consider using Release versions if you explicitly need to get new versions earlier, manually verify fixes, or must load extension packages.

Notes for Mobile/Phone Usage:
- In principle, as long as the browser supports extensions, it can usually be used, such as `Edge`, `Firefox for Android`, `Kiwi`, etc.
- For more information, see [Mobile Usage in FAQ](./faq.md#mobile-browser-support).
:::

<details>
<summary>Release Type Selection</summary>

First, select the version type, then download the corresponding attachment:

| Type | Recommended Scenario | Download Link | Features |
|---|---|---|---|
| Stable Release | Daily use, first-time installation, prioritize stability | [Download Latest Stable](https://github.com/qixing-jk/all-api-hub/releases/latest) | Corresponds to official release versions, with more complete release notes and higher stability. |
| Nightly Pre-release | Want to get new features / fixes as soon as possible, or assist in verifying issues | [Download Nightly](https://github.com/qixing-jk/all-api-hub/releases/tag/nightly) | Automatically generated from the latest commit on `main`, updated faster, but may contain changes that have not been fully validated; attachment filenames usually include `nightly`. |

::: tip How to Choose
- If you are unsure which to choose, select the Stable Release first.
- If you want to confirm whether a fix has been included, or are willing to help provide feedback, choose Nightly.
- Store versions usually have a 1-3 day delay due to review; GitHub Stable releases are generally earlier, and Nightly is the fastest, but also carries higher risk.
:::

</details>

### Safari Browser Installation

Safari cannot be installed directly from the store or loaded by unzipping like Chrome, Edge, or Firefox; it requires installation via Xcode. For complete steps, please see the [Safari Installation Guide](./safari-install.md).

Recommended installation method:

1. Download `all-api-hub-<version>-safari-xcode-bundle.zip` from GitHub Releases, unzip it, and directly open the Xcode project within to run.

Advanced usage:

1. Build from source: `pnpm install` -> `pnpm run build:safari` -> `xcrun safari-web-extension-converter .output/safari-mv2/` -> Run with Xcode.

::: warning Safari Download Notes
Please download `all-api-hub-<version>-safari-xcode-bundle.zip`, not `all-api-hub-<version>-safari.zip` separately. The former already includes the Xcode project that can be opened directly and the necessary files for running, making it more suitable for the standard installation process.
:::

If official signing and distribution via TestFlight / App Store is required, an Apple Developer Program account is usually needed; otherwise, it is generally only suitable for local debugging or personal use.

### QQ / 360 and Other Browser Installation

If you use browsers like QQ Browser, 360 Secure Browser, 360 Speed Browser, Cheetah Browser, Brave, Vivaldi, Opera, etc., please download the Chrome version zip package from GitHub Releases and refer to the [QQ / 360 and Other Browser Installation Guide](./other-browser-install.md) for unzipping and loading.

## 2. Supported Sites

Supports proxy stations deployed based on the following projects:
- [one-api](https://github.com/songquanpeng/one-api)
- [new-api](https://github.com/QuantumNous/new-api)
- [Veloera](https://github.com/Veloera/Veloera)
- [one-hub](https://github.com/MartialBE/one-hub)
- [done-hub](https://github.com/deanxv/done-hub)
- [AxonHub](https://github.com/looplj/axonhub)
- WONG Public Welfare Station
- [Sub2API](https://github.com/Wei-Shaw/sub2api)
- [AnyRouter](https://anyrouter.top)
- [VoAPI](https://github.com/VoAPI/VoAPI)
- [Super-API](https://github.com/SuperAI-Api/Super-API)
- Neo-API
- RIX_API (Basic functionality support)

For a complete list of compatible sites, please refer to [Supported Sites and System Types](./supported-sites.md).

::: warning
If a site has undergone secondary development that alters key interfaces (e.g., `/api/user`), the extension may not be able to add the site correctly.
:::

## 3. Adding a Site

::: info Tip
You must log in to the target website yourself using the browser first. This allows the extension's automatic recognition feature to read your login information and retrieve account details.
:::

### 3.1 Automatic Recognition and Addition

1. Open the main extension page and click `Add Account`

![Add Account Button](../static/image/add-account-btn.png)

2. Enter the proxy station address and click `Auto-Recognize`

![Auto-Recognize Button](../static/image/add-account-dialog-btn.png)

3. After confirming the automatic recognition is correct, click `Confirm Addition`

::: info Tip
The extension will automatically recognize various information about your account, such as:
- Username
- User ID
- [Access Token](#manual-addition)
- Top-up amount ratio
:::

> If the target site has Cloudflare's 5-second protection enabled, the extension will automatically pop up an independent window to assist with bypassing the protection. Once bypassed, the recognition process can continue.
> If the IP quality is poor or for other reasons, you may need to manually complete the protection in the pop-up window before the timeout.

### 3.2 Cloudflare Bypass Assistant Overview

- When Cloudflare's 5-second protection is detected, the extension will automatically launch a temporary window to help complete the verification. If manual intervention is required for the challenge, click to verify within the pop-up window.
- After successful verification, the process will return to the original flow to continue obtaining the Access Token and site information.
- For more details, refer to [Cloudflare Protection and Temporary Window Downgrade](#cloudflare-window-downgrade).

<a id="manual-addition"></a>
### 3.3 Manual Addition

::: info Tip
If automatic recognition fails, you can manually enter site account details. You will need to obtain the following information first. (The UI may vary slightly for each site; please locate them yourself.)
:::
![User Information](../static/image/site-user-info.png)

If the target site is a modified version (e.g., AnyRouter), please switch to **Cookie Mode** when adding the account, and then proceed with automatic recognition or manual input. When encountering sites with strict protection, you can also use the Cloudflare Bypass Assistant. For details, see [FAQ](./faq.md#anyrouter-error).

<a id="quick-export-sites"></a>
## 4. Quick Export and Integration

This extension supports exporting added site API configurations to local clients, CLI tools, and self-hosted sites, reducing the effort of repeatedly entering `Base URL`, keys, and model configurations. For a current, complete list, please refer to [Supported Export Tools and Integration Targets](./supported-export-tools.md).

### 4.1 Configuration

Before using the export/integration features, complete the corresponding configurations based on the target type:

- **CherryStudio / CC Switch**: Ensure the target client is available to facilitate importing via Deeplink.
- **Kilo Code / Roo Code**: It is recommended to confirm the model ID corresponding to each key in advance.
- **CLIProxyAPI / Claude Code Router**: Fill in the respective management addresses and credentials in the basic settings.
- **Self-hosted Sites (New API / DoneHub / Veloera / Octopus / AxonHub / Claude Code Hub)**: Complete the backend configuration in `Settings -> Basic Settings -> Self-hosted Site Management`.

### 4.2 Export Process

1. **Navigate to Key Management**: In the extension's **Key Management** page, find the API key for the site you wish to export.
2. **Click Corresponding Action**: In the key action menu, select **"Export to CherryStudio"**, **"Export to CC Switch"**, **"Export Kilo Code JSON"**, **"Import to CLIProxyAPI"**, **"Import to Claude Code Router"**, or **"Import to Current Self-hosted Site"**.
3. **Automatic Handling**:
   * **For CherryStudio / CC Switch**: The extension will automatically transfer site information and API keys according to the target application's Deeplink protocol.
   * **For Kilo Code / Roo Code**: The extension will generate a configurable JSON that can be copied or downloaded for manual import.
   * **For CLIProxyAPI / Claude Code Router / Self-hosted Sites**: The extension will call the corresponding management interface to create or update the Provider / Channel.

Through these integration capabilities, you can synchronize the same upstream site to multiple downstream tools or backend systems without manual copy-pasting.

## 5. Core Features at a Glance

### 📊 Dashboard & Analytics
- **5.1 Overview & Real-time Refresh**: Centrally view balances, usage, and health status for all sites with automatic syncing.
- **5.2 Balance History**: Record daily snapshots of balances, income, and expenditure to visualize trends.
- **5.3 Usage Analytics**: In-depth analysis of Token consumption, model distribution, costs, and request latency.

### 🔑 Keys & Integration
- **5.4 Key Management (Tokens)**: Centrally manage site tokens with support for **"One-click Repair"** of hidden keys.
- **5.5 Independent API Credentials**: Save URL+Key independently of site accounts with tag support and batch validation.
- **5.6 Quick Export & Integration**: Instant sync to CherryStudio, CC Switch, Kilo Code, CLIProxyAPI, and more.
- **5.7 Web API Sniffing**: Quickly identify and test API configurations within any webpage via right-click or detection.

### ⚡ Automation & Rewards
- **5.8 Auto Check-in Assistant**: Handle multi-site check-ins automatically with scheduled tasks and custom URL jumps.
- **5.9 Redemption Assist**: Automatically recognize redemption codes on webpages for one-click redemption with a floating window.
- **5.10 Bookmark Management**: Centrally manage AI-related consoles, documentation, recharge pages, and redemption portals.

### 🛡️ Stability & Security
- **5.11 Cloudflare Assistant**: Automatically assist with Cloudflare challenges to ensure uninterrupted refreshes and API calls.
- **5.12 New API Security Verification (2FA)**: Handle OTP / 2FA / Passkey challenges for management backends seamlessly.
- **5.13 WebDAV Sync & Encryption**: Encrypted multi-device backup and sync to ensure your configurations are never lost.

### 🛠️ Admin Workflow (Self-hosted)
- **5.14 Site Management**: Directly manage channels (Create/Edit/Delete) for New API, AxonHub, and more within the extension.
- **5.15 Model Sync & Redirection**: Batch sync models from upstream providers and configure "Standard -> Actual" mappings.

### 🎨 Personalization & Advanced
- **5.16 Sorting Priority Settings**: Customize account display order based on balance, health, or check-in requirements.
- **5.17 Share Snapshot**: Generate beautiful, privacy-desensitized status images with dynamic mesh gradient backgrounds.
- **5.18 LDOH Site Lookup**: Automatically match site discussion threads on Linux.do to check reputation and reviews.
- **5.19 Developer Tools (Mesh Gradient Lab)**: Visual debugging and background customization. See [Developer Tools](./developer-tools.md).

## 6. In-depth Documentation

- [Supported Export Tools and Integration Targets](./supported-export-tools.md)
- [Supported Sites and System Types](./supported-sites.md)
- [Safari Installation Guide](./safari-install.md)
- [QQ / 360 and Other Browser Installation Guide](./other-browser-install.md)
- [Bookmark Management](./bookmark-management.md)
- [API Credential Profiles](./api-credential-profiles.md)
- [Key Management](./key-management.md)
- [Share Snapshot](./share-snapshot.md)
- [Balance History](./balance-history.md)
- [Usage Analysis](./usage-analytics.md)
- [LDOH Site Lookup](./ldoh-site-lookup.md)
- [Web AI API Sniffing and Verification](./web-ai-api-check.md)
- [New API Security Verification (2FA / OTP)](./new-api-security-verification.md)
- [Cloudflare Bypass Assistant](./cloudflare-helper.md)
- [Quick Export Site Configurations](./quick-export.md)
- [Automatic Refresh and Real-time Data](./auto-refresh.md)
- [Automatic Check-in and Check-in Monitoring](./auto-checkin.md)
- [WebDAV Backup and Automatic Synchronization](./webdav-sync.md)
- [Managed Site Model Synchronization](./managed-site-model-sync.md)
- [Self-Hosted Site Management](./self-hosted-site-management.md)
- [CLIProxyAPI Integration](./cliproxyapi-integration.md)
- [Model Redirection](./model-redirect.md)
- [Sorting Priority Settings](./sorting-priority.md)
- [Permissions Management (Optional Permissions)](./permissions.md)
- [Data Import and Export](./data-management.md)

## 7. FAQ and Support

- Refer to the more detailed [FAQ](./faq.md) for information on authentication methods, AnyRouter adaptation, feature usage tips, and more.
- If you encounter issues or need new features, feel free to provide feedback on [GitHub Issues](https://github.com/qixing-jk/all-api-hub/issues).
- To view historical updates, please check the [Changelog](./changelog.md).

::: tip Next Steps
After completing the basic setup, you can proceed to configure automatic refresh, check-in detection, or WebDAV synchronization for a more comprehensive user experience.
:::
