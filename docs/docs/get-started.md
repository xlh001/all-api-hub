# 开始使用

一个开源的浏览器插件，聚合管理AI中转站账号的余额、模型和密钥，告别繁琐登录。

## 1. 下载

::: info 推荐
[前往 Chrome 应用商店]
:::

## 2. 支持的站点

支持基于以下项目部署的中转站：
 - [One-API] 
 - [New-API] 
 - [Veloera](https://github.com/Veloera/Veloera)

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

[One-API]: https://github.com/songquanpeng/one-api
[New-API]: https://github.com/QuantumNous/new-api
[前往 Chrome 应用商店]: https://chromewebstore.google.com/detail/%E4%B8%AD%E8%BD%AC%E7%AB%99%E7%AE%A1%E7%90%86%E5%99%A8-one-api-hub/eobdoeafpplhhhjfkinnlkljbkijpobd
