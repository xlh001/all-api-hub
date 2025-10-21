# Get Started

An open-source browser extension designed to optimize the experience of managing AI relay station accounts like New API. Users can easily centralize management and view account balances, models, and keys, as well as automatically add new sites. The extension is also available on mobile devices via Kiwi Browser or the mobile version of Firefox.

## 1. Download

::: info Recommended
[Go to Chrome Store to download](https://chromewebstore.google.com/detail/lapnciffpekdengooeolaienkeoilfeo)

[Go to Edge Store to download](https://microsoftedge.microsoft.com/addons/detail/pcokpjaffghgipcgjhapgdpeddlhblaa)

[Go to FireFox Store to download](https://addons.mozilla.org/firefox/addon/%E4%B8%AD%E8%BD%AC%E7%AB%99%E7%AE%A1%E7%90%86%E5%99%A8-all-api-hub/)
:::

[Release Download](https://github.com/qixing-jk/all-api-hub/releases)

## 2. Supported Sites

Supports relay stations based on the following projects:
- [one-api](https://github.com/songquanpeng/one-api)
- [new-api](https://github.com/QuantumNous/new-api)
- [Veloera](https://github.com/Veloera/Veloera)
- [one-hub](https://github.com/MartialBE/one-hub)
- [done-hub](https://github.com/deanxv/done-hub)
- [VoAPI](https://github.com/VoAPI/VoAPI)
- [Super-API](https://github.com/SuperAI-Api/Super-API)

::: warning
If the site has undergone secondary development that has changed key interfaces (e.g., `/api/user`), the plugin may not be able to add the site correctly.
:::

## 3. Add a Site
::: info Tip
You must first log in to the target relay station in your browser so that the plugin's auto-detection feature can obtain your account's [Access Token](#_3-2-manual-add) via cookies.
:::

### 3.1 Add Automatically

1. Open the main page of the plugin and click `Add Account`.

![Add Account](../static/image/add-account-btn.png)

2. Enter the relay station address and click `Auto-detect`.

![Auto-detect](../static/image/add-account-dialog-btn.png)

3. After confirming that the automatic detection is correct, click `Confirm Add`.

:::info Tip
The plugin will automatically identify your account's:
- Username
- User ID
- [Access Token](#_3-2-manual-add)
- Top-up ratio
:::

![Confirm Add](../static/image/add-account-dialog-ok-btn.png)

### 3.2 Manual Add

:::info Tip
When automatic detection fails, you can manually enter the site account. You will need to obtain the following information first. (Each site may have a different UI, please find it yourself.)
:::
![User Info](../static/image/site-user-info.png)

## 4. Quick Site Export

This extension supports one-click export of added site API configurations to [CherryStudio](https://github.com/easy-cherry/cherry-studio) and [New API](https://github.com/Calcium-Ion/new-api), simplifying the process of adding upstream providers in these platforms.

### 4.1 Configuration

Before using the quick export feature, you need to configure the **Server Address** and **Admin Token** for the target platform (CherryStudio or New API) in the extension's **Basic Settings** page. For New API, you also need to configure the **User ID**.

### 4.2 Export Process

1.  **Navigate to Key Management**: In the extension's **Key Management** page, find the API key corresponding to the site you want to export.
2.  **Click Export**: In the key's action menu, select **"Export to CherryStudio"** or **"Export to New API"**.
3.  **Automatic Handling**:
    *   **For New API**: The extension will automatically check if a channel with the same `Base URL` already exists on the target platform. If not, it will create a new channel and automatically populate the site name, `Base URL`, API key, and the list of available models, avoiding duplicate entries.
    *   **For CherryStudio**: The extension will send the site and key information directly to your configured CherryStudio instance.

With this feature, you can easily synchronize your API provider configurations to other management platforms without manual copy-pasting, improving efficiency.