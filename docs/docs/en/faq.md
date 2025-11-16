# FAQ

A collection of frequently asked questions encountered while using the extension.

## 🔐 Authentication

### What’s the difference between Cookie mode and Access Token mode?

The extension supports two authentication modes:

| Mode | Highlights | When to Use | Recommendation |
|------|------------|-------------|----------------|
| **Access Token** | ✅ Supports multiple accounts<br>✅ Never expires<br>✅ More secure and stable | Most standard relay sites | ⭐⭐⭐⭐⭐ Highly recommended |
| **Cookie** | ⚠️ Single account only<br>⚠️ May expire<br>✅ Better compatibility | Sites that disable tokens<br>Heavily customized deployments | ⭐⭐⭐ Use for special cases |

**Recommended:** Use the Access Token mode whenever possible, unless:
- The site does not expose access tokens
- You are using a heavily customized relay site
- Token functionality is disabled by the site owner

### How do I switch the authentication mode?

When adding an account, choose the desired mode directly in the dialog:
1. Click **“Add account”**
2. Enter the site URL
3. Choose `Access Token` or `Cookie` in **Authentication**
4. Click **“Auto-detect”**

## 🔧 Site-specific Issues

### AnyRouter keeps failing—what should I do?

AnyRouter is a heavily customized relay site and does not support the standard Access Token workflow.

**Solution:**
1. Select **Cookie mode** when adding the account
2. Log in to AnyRouter in your browser first
3. Use the auto-detect flow afterward

::: warning Heads-up
Because AnyRouter has modified its API, some features may still not work. If issues remain, please contact the site administrator.
:::

### Auto-detection fails—how can I fix it?

Try the following steps:

1. **Switch authentication mode:** Try Cookie mode if Access Token fails
2. **Add manually:** Fill in the username, user ID, access token, and exchange rate manually
3. **Check login state:** Ensure you have logged in to the site in this browser
4. **Verify compatibility:** Confirm the site is based on a supported project (see below)

### Which sites might be incompatible?

Sites that radically change core APIs (such as `/api/user`) may not work properly.

Common incompatibilities include:
- Custom user information endpoints
- Access tokens disabled
- Non-standard authentication flows
- Different response formats compared to upstream projects

## 🐛 Feature & Bug Questions

### I still see a bug or missing feature—what should I do?

1. **Search existing issues:** Visit [GitHub Issues](https://github.com/qixing-jk/all-api-hub/issues)
2. **Use the latest version:**
   - Store releases take several days to update
   - Prefer the GitHub release if a fix has already landed
   - You can also build from the main branch for the latest features

### Where can I download the latest version?

Different channels update at different speeds:

| Channel | Update Speed              | Download |
|---------|---------------------------|----------|
| **GitHub Releases** | ⚡ Fastest                 | [Download](https://github.com/qixing-jk/all-api-hub/releases) |
| **Chrome Web Store** | 🐌 Slow (3–5 days review) | [Install](https://chromewebstore.google.com/detail/lapnciffpekdengooeolaienkeoilfeo) |
| **Edge Add-ons** | 🐌 Slow (2–3 days review) | [Install](https://microsoftedge.microsoft.com/addons/detail/pcokpjaffghgipcgjhapgdpeddlhblaa) |
| **Firefox Add-ons** | ⚡ Fast (few hours review) | [Install](https://addons.mozilla.org/firefox/addon/{bc73541a-133d-4b50-b261-36ea20df0d24}) |

::: tip Recommendation
If a bug has already been fixed, grab the latest GitHub release and install it manually.
:::

## ⚙️ Using Key Features

### How do I back up with WebDAV?

WebDAV keeps your data synchronized across devices.

1. **Configure WebDAV:**
   - Open **Settings → WebDAV Backup**
   - Enter the full WebDAV endpoint URL
   - Provide your username and password
   
2. **Choose a sync strategy:**
   - `merge` (recommended): intelligently merge local and remote data
   - `upload only`: push local data to remote
   - `download only`: pull remote data to local

3. **Enable auto-sync:**
   - Check **“Enable auto sync”**
   - Set the sync interval (default 3600 seconds / 1 hour)

::: tip Suggested services
- [Nutstore](https://www.jianguoyun.com/) (fast for CN users)
- Nextcloud (self-hosted)
- Synology NAS
:::

### How do I export to CherryStudio or New API?

One-click export helps replicate site configuration in other tools.

**Configuration:**

1. **For New API:**
   - Go to **Settings → Basic Settings**
   - Set the New API base URL
   - Input the admin token
   - Provide the user ID

2. **For CherryStudio:**
   - No extra setup required
   - Ensure CherryStudio is running locally

**Export flow:**

1. Navigate to **Key Management**
2. Find the site you want to export
3. Open the action menu
4. Choose **“Export to CherryStudio”** or **“Export to New API”**

::: info Smart check
When exporting to New API, the extension checks for duplicate channels (same `Base URL`) to avoid duplicates.
:::

### How does the daily check-in feature work?

Some relay sites provide daily rewards via check-in.

1. **Enable detection:**
   - Edit the account
   - Enable **“Check-in detection”**

2. **Custom URLs (optional):**
   - Provide a custom check-in URL if the site uses a non-standard path
   - Add a custom redeem URL if needed

3. **Perform check-in:**
   - Accounts that need a check-in will display a badge
   - Click the check-in icon to open the check-in page automatically

### Can I customize account sorting?

Yes—sorting priority is fully configurable.

1. **Open the sorting settings:**
   - Go to **Settings → Sorting Priority**

2. **Adjust priority:**
   - Drag to reorder criteria
   - Toggle individual criteria on/off

3. **Available criteria include:**
   - 📌 Pin the currently detected site
   - 🏥 Health status ordering (Error → Warning → Unknown → Healthy)
   - ✅ Pin accounts that require check-in
   - 🔗 Pin accounts with custom check-in URLs
   - 📊 User-defined sorting (balance / consumption / name)

### How do I configure auto-refresh?

Keep data up-to-date without manual refreshes.

1. **Enable scheduled refresh:**
   - Open **Settings → Auto Refresh**
   - Check **“Enable scheduled refresh”**

2. **Set the interval:**
   - Default: 360 seconds (6 minutes)
   - Minimum: 60 seconds
   - Adjust according to the number of sites

3. **Additional options:**
   - ✅ Refresh when the popup opens
   - ✅ Show health status badges

::: warning Heads-up
Excessively short intervals can trigger rate limits. Avoid setting below 60 seconds.
:::

## 📱 Mobile Usage

### Can I use the extension on mobile?

Yes—Android is fully supported via browsers that allow extensions.

**Android:**
1. Install [Kiwi Browser](https://play.google.com/store/apps/details?id=com.kiwibrowser.browser) (recommended)
   - Full Chrome extension support
   - All features available

2. Alternatively, use Firefox for Android
   - Install directly from Firefox Add-ons

**iOS:**
- Currently unsupported due to platform limitations

### Mobile tips

1. **Use the side panel layout** for better usability on small screens
2. **Enable auto refresh** to avoid manual refreshes
3. **Turn on WebDAV sync** to share data with your desktop

## 🔒 Data Safety

### Where is my data stored?

- **Local storage:** Everything is stored locally in your browser
- **Offline first:** Core features work without any external network calls
- **No uploads:** The extension never uploads your data to third-party servers

### Could I lose my data?

We recommend regular backups.

1. **JSON export:**
   - Open **Settings → Data Management**
   - Click **“Export Data”**
   - Save the JSON file securely

2. **WebDAV sync (recommended):**
   - Keep an automated cloud backup
   - Sync across multiple devices

## 🆘 Other Questions

### What is duplicate site detection?

When adding a site, the extension checks if the same base URL already exists:
- Detects duplicate URLs
- Prompts you to update the existing entry instead
- Keeps your list clean and tidy

### What do the health statuses mean?

Each account shows a health badge:

| Status | Icon | Meaning |
|--------|------|---------|
| 🟢 Healthy | Healthy | Everything works normally |
| 🟡 Warning | Warning | Needs attention (e.g., low balance) |
| 🔴 Error | Error | API call failed or account unusable |
| ⚪ Unknown | Unknown | Not yet checked or unavailable |

### Does the extension consume much traffic?

- Only calls the site APIs during refresh
- Each refresh is lightweight (a few KB per site)
- We recommend auto-refreshing on Wi-Fi connections

### How can I contribute?

We welcome contributions!
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

See [CONTRIBUTING.md](https://github.com/qixing-jk/all-api-hub/blob/main/CONTRIBUTING.md) for details.

---

## 📚 Related Resources

- [Getting Started](./get-started.md)
- [GitHub Repository](https://github.com/qixing-jk/all-api-hub)
- [Issue Tracker](https://github.com/qixing-jk/all-api-hub/issues)
- [Changelog](https://github.com/qixing-jk/all-api-hub/blob/main/CHANGELOG.md)

::: tip Still stuck?
If you can’t find the answer here, feel free to open an issue on [GitHub](https://github.com/qixing-jk/all-api-hub/issues).
:::
