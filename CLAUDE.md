## 用户定义
- 当前项目使用 Plasmo v0.90.5 开发
- 前端技术栈（Tailwind CSS v3、Headless UI等）
- 当技术文档不确定时，应当使用 mcp 工具 context7 进行搜索

### 项目介绍
```
## 介绍

目前市面上有太多 ai-api 中转站点，每次查看余额和支持模型列表等信息都非常麻烦，需要逐个登录查看。

本插件可以便捷的对基于https://github.com/songquanpeng/one-api和[new-api](https://github.com/QuantumNous/new-api)等部署的 Ai 中转站账号进行整合管理。

### 功能

- 自动识别中转站点，自动创建系统访问 token 并添加到插件的站点列表中
- 每个站点可添加多个账号
- 账号的余额、使用日志进行查看
- 令牌(key)查看与管理
- 站点支持模型信息和渠道查看
- 插件无需联网

### 未来支持

- 模型降智测试
- webdav 数据备份
```

## 刷新账号功能实现细节

### 核心文件结构

#### 1. services/accountStorage.ts
- **refreshAllAccounts函数** (第210-231行): 使用 `Promise.allSettled` 并发刷新所有账号，返回成功和失败的统计
- **refreshAccount函数** (第147-205行): 单个账号刷新逻辑，更新余额、消耗、token统计等信息

#### 2. components/HeaderSection.tsx  
- **刷新按钮** (第28-37行): 使用 `ArrowPathIcon` 图标，支持 `animate-spin` 动画和 `isRefreshing` 状态控制

#### 3. components/BalanceSection.tsx
- **最后更新时间显示** (第144-153行): 使用 `useTimeFormatter` hook 显示相对时间和tooltip

#### 4. options/pages/BasicSettings.tsx
- **自动刷新设置** (第176-222行): 包含自动刷新开关和刷新间隔时间设置，但缺少实际功能逻辑

#### 5. popup/index.tsx
- **全局刷新** (第123-141行): `handleGlobalRefresh` 使用 `toast.promise` 显示加载状态
- **单个账号刷新** (第143-177行): `handleRefreshAccount` 处理单个账号刷新并防止重复操作
