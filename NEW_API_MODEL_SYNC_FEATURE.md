# New API 模型同步功能

## 功能概述

本功能实现了在同一 New API 站点内，对其所有渠道执行"拉取模型并更新渠道模型"的自动化能力。

## 主要特性

### 1. 自动化同步
- ✅ 支持定时自动同步（默认 24 小时，可自定义）
- ✅ 可配置并发数量（默认 5，避免服务器压力）
- ✅ 自动重试机制（默认 2 次，指数退避）
- ✅ 支持开关控制

### 2. 手动触发选项
- ✅ **执行全部**：同步所有渠道
- ✅ **执行所选**：批量同步选中的渠道
- ✅ **仅重试失败项**：只重新同步上次失败的渠道
- ✅ **单行操作按钮**：直接在表格行内同步单个渠道（无需滚动到顶部）

### 3. 分页支持
- ✅ 自动处理渠道分页，确保获取所有渠道
- ✅ 使用通用分页工具函数 `fetchAllItems`
- ✅ 支持大量渠道的场景

### 4. 结果展示与筛选
- ✅ 显示执行统计（总数、成功数、失败数、耗时、时间）
- ✅ 按状态筛选（全部/成功/失败）
- ✅ 搜索功能（支持渠道名称、ID、错误信息）
- ✅ 详细错误信息（HTTP 状态码、业务错误码、错误消息）
- ✅ 实时进度显示

### 5. UI 优化
- ✅ 组件化设计，代码结构清晰
- ✅ 响应式布局，支持桌面和移动端
- ✅ 暗色模式支持
- ✅ 完整的多语言支持（中文/英文）
- ✅ Loading 状态和进度指示

## 使用方式

### 配置设置（Settings 页面）

1. 在 Options 页面进入"基本设置"
2. 找到"模型同步设置"卡片
3. 配置以下选项：
   - **启用自动同步**：开关按钮
   - **执行间隔**：设置自动同步的时间间隔（小时）
   - **并发上限**：同时处理的最大渠道数量
   - **最大重试次数**：失败时的自动重试次数
4. 点击"打开"按钮进入执行页面

### 执行页面（Model Sync 页面）

#### 查看上次执行结果
- 顶部显示统计卡片：总数、成功、失败、耗时、时间
- 表格显示所有渠道的详细执行结果

#### 手动触发同步
1. **执行全部**：点击顶部"执行全部"按钮
2. **批量执行**：
   - 勾选需要同步的渠道
   - 点击"执行所选"按钮
3. **重试失败项**：点击"仅重试失败项"按钮
4. **单个渠道**：点击表格每行右侧的同步按钮（🔄图标）

#### 筛选和搜索
- 使用顶部筛选按钮：全部 / 成功 / 失败
- 使用搜索框：输入渠道名称、ID 或错误信息关键字

## 技术实现

### 文件结构

```
entrypoints/options/pages/NewApiModelSync/
├── index.tsx                    # 主页面
└── components/
    ├── ActionBar.tsx           # 操作按钮栏
    ├── EmptyResults.tsx        # 空状态
    ├── FilterBar.tsx           # 筛选栏
    ├── LoadingSkeleton.tsx     # 加载骨架屏
    ├── ProgressCard.tsx        # 进度卡片
    ├── ResultsTable.tsx        # 结果表格（包含单行操作按钮）
    └── StatisticsCard.tsx      # 统计卡片

services/newApiModelSync/
├── index.ts                     # 导出
├── NewApiModelSyncService.ts   # 核心服务（支持分页）
├── scheduler.ts                # 后台调度器
└── storage.ts                  # 存储服务

services/apiService/common/
└── pagination.ts               # 通用分页工具

types/
└── newApiModelSync.ts          # 类型定义
```

### 核心 API

#### 服务层
- `listChannels()`: 获取所有渠道（自动处理分页）
- `fetchChannelModels(channelId)`: 获取指定渠道的模型列表
- `updateChannelModels(channel, models)`: 更新渠道模型
- `runForChannel(channel, maxRetries)`: 执行单个渠道同步（含重试）
- `runBatch(channels, options)`: 批量执行（含并发控制）

#### 调度器
- `initialize()`: 初始化定时任务
- `executeSync(channelIds?)`: 执行同步（可选指定渠道）
- `executeFailedOnly()`: 仅重试失败项
- `getProgress()`: 获取当前进度
- `updateSettings()`: 更新设置并重新调度

#### 存储
- `getPreferences()`: 获取用户设置
- `savePreferences()`: 保存用户设置
- `getLastExecution()`: 获取上次执行结果
- `saveLastExecution()`: 保存执行结果

### 消息通信

通过 `browser.runtime.sendMessage` 与后台通信：

```typescript
// 执行全部
{ action: "newApiModelSync:triggerAll" }

// 执行所选
{ action: "newApiModelSync:triggerSelected", channelIds: [...] }

// 仅重试失败项
{ action: "newApiModelSync:triggerFailedOnly" }

// 获取上次执行结果
{ action: "newApiModelSync:getLastExecution" }

// 获取当前进度
{ action: "newApiModelSync:getProgress" }

// 更新设置
{ action: "newApiModelSync:updateSettings", settings: {...} }
```

### 进度广播

后台通过 `browser.runtime.sendMessage` 广播进度更新：

```typescript
{
  type: "NEW_API_MODEL_SYNC_PROGRESS",
  payload: {
    isRunning: boolean,
    total: number,
    completed: number,
    failed: number,
    currentChannel?: string,
    lastResult?: ExecutionItemResult
  }
}
```

## 特别说明

### 行内操作按钮的优势

在表格每一行添加了单独的同步按钮，带来以下好处：

1. **减少滚动**：用户无需滚动到顶部即可操作
2. **快速重试**：失败的渠道可以立即重试
3. **精确控制**：可以对特定渠道进行单独操作
4. **状态反馈**：按钮显示 loading 状态，清晰展示正在同步的渠道
5. **更好的 UX**：符合用户的操作习惯

### 错误处理

- HTTP 错误：显示状态码
- 业务错误：显示业务错误码和消息
- 自动重试：指数退避策略（1s, 2s）
- 错误分类：区分网络错误、API 错误、业务逻辑错误

### 性能优化

- 并发控制：避免同时请求过多
- 分页加载：自动处理大量渠道
- 增量更新：只更新 models 字段
- 模型比对：仅在模型变化时才更新

## 未来扩展

可能的功能扩展方向：

- [ ] 支持定时任务查看和管理
- [ ] 导出执行结果为 CSV/JSON
- [ ] 渠道分组批量操作
- [ ] 更详细的执行日志
- [ ] 模型变更历史记录
- [ ] Webhook 通知支持
