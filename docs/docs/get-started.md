# 开始使用

一个开源的浏览器插件，旨在优化管理New API等AI中转站账号的体验。用户可以轻松集中管理和查看账户余额、模型及密钥，并自动添加新站点。

## 1. 下载

::: info 推荐
[前往 Chrome商店 下载](https://chromewebstore.google.com/detail/lapnciffpekdengooeolaienkeoilfeo)

[前往 Edge商店 下载](https://microsoftedge.microsoft.com/addons/detail/pcokpjaffghgipcgjhapgdpeddlhblaa)

[前往 FireFox商店 下载](https://addons.mozilla.org/firefox/addon/%E4%B8%AD%E8%BD%AC%E7%AB%99%E7%AE%A1%E7%90%86%E5%99%A8-all-api-hub/)
:::

[Release 下载](https://github.com/qixing-jk/all-api-hub/releases)

## 2. 支持的站点

支持基于以下项目部署的中转站：
- [one-api](https://github.com/songquanpeng/one-api)
- [new-api](https://github.com/QuantumNous/new-api)
- [Veloera](https://github.com/Veloera/Veloera)
- [one-hub](https://github.com/MartialBE/one-hub)
- [done-hub](https://github.com/deanxv/done-hub)
- [VoAPI](https://github.com/VoAPI/VoAPI)
- [Super-API](https://github.com/SuperAI-Api/Super-API)

::: warning
如果站点进行了二次开发导致一些关键接口（例如`/api/user`）发生了改变，则插件可能无法正常添加此站点。
:::



## 3. 添加站点
::: info 提示
必须先使用浏览器，自行在目标中转站登录，这样插件的自动识别功能才能通过cookie获取到您账号的[访问令牌(Access_Token)](#_3-2-手动添加)
:::

### 3.1 自动识别添加

1. 打开插件主页面，点击`新增账号`

![新增账号](./static/image/add-account-btn.png)

2. 输入中转站地址，点击`自动识别`

![自动识别](./static/image/add-account-dialog-btn.png)

3. 确认自动识别无误后点击`确认添加`

:::info 提示
插件会自动识别您账号的：
- 用户名
- 用户ID
- [访问令牌(Access_Token)](#_3-2-手动添加)
- 充值金额比例
:::

![确认添加](./static/image/add-account-dialog-ok-btn.png)

### 3.2 手动添加

:::info 提示
当自动识别未成功后，可进行手动输入添加站点账号，需要先获取以下信息。（每个站点可能UI有所差异，请自行寻找）
:::
![用户信息](./static/image/site-user-info.png)

## 4. 快速导出站点

本插件支持将已添加的站点API配置一键导出到 [CherryStudio](https://github.com/CherryHQ/cherry-studio) 和 [New API](https://github.com/QuantumNous/new-api)，从而简化在这些平台中添加上游供应商的流程。

### 4.1 配置

在使用快速导出功能前，您需要先在插件的 **基础设置** 页面中，配置目标平台（New API）的 **服务器地址** 、 **管理员令牌** 和 **用户ID**。

### 4.2 导出流程

1.  **导航至密钥管理**：在插件的 **密钥管理** 页面，找到您想要导出的站点对应的API密钥。
2.  **点击导出**：在密钥操作菜单中，选择 **“导出到 CherryStudio”** 或 **“导出到 New API”**。
3.  **自动处理**：
    *   **对于 New API**：插件会自动检测目标平台是否已存在相同`Base URL`的渠道，避免重复添加。如果不存在，则会创建一个新渠道，并自动填充站点名称、`Base URL`、API密钥以及可用模型列表。
    *   **对于 CherryStudio**：插件会将站点和密钥信息直接发送到您本地的CherryStudio程序中。

通过此功能，您可以轻松地将API供应商配置导入到其他平台，无需手动复制粘贴，提高了工作效率。
