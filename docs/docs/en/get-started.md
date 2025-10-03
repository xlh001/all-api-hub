# Get Started

An open-source browser extension designed to optimize the experience of managing AI relay station accounts like New API. Users can easily centralize management and view account balances, models, and keys, as well as automatically add new sites.

## 1. Download

::: info Recommended
[Go to Releases to download](https://github.com/qixing-jk/all-api-hub/releases)
:::

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