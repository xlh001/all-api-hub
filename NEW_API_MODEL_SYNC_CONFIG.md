# New API 模型同步配置说明

## 配置结构变更

配置已从平铺结构改为对象结构，存储在 `userPreferences` 中。

### 旧结构（已弃用）
```typescript
{
  newApiModelSyncEnabled: boolean
  newApiModelSyncInterval: number
  newApiModelSyncConcurrency: number
  newApiModelSyncMaxRetries: number
}
```

### 新结构（当前）
```typescript
{
  newApiModelSync: {
    enabled: boolean      // 是否启用自动同步
    interval: number      // 同步间隔（毫秒）
    concurrency: number   // 并发数量
    maxRetries: number    // 最大重试次数
  }
}
```

## 默认配置

```typescript
{
  newApiModelSync: {
    enabled: false,
    interval: 24 * 60 * 60 * 1000,  // 24 小时
    concurrency: 5,
    maxRetries: 2
  }
}
```

## Alarms API 配置

### 定时任务设置

定时任务使用 browser.alarms API，配置如下：

```typescript
{
  delayInMinutes: intervalInMinutes,  // 首次执行延迟
  periodInMinutes: intervalInMinutes  // 重复执行间隔
}
```

### 注意事项

1. **最小间隔**: Chrome 扩展的 alarm 最小间隔为 1 分钟
2. **首次执行**: 设置 `delayInMinutes` 确保首次也能执行
3. **重复执行**: `periodInMinutes` 控制后续重复执行间隔
4. **权限要求**: 需要 `alarms` 权限（已在 manifest 中配置）

### Alarm 生命周期

1. **创建**: 调用 `browser.alarms.create(name, config)`
2. **监听**: 通过 `browser.alarms.onAlarm.addListener(callback)` 监听触发
3. **更新**: 先清除旧 alarm，再创建新 alarm
4. **清除**: 调用 `browser.alarms.clear(name)`

### 调试 Alarms

在浏览器控制台查看当前 alarms：

```javascript
// Chrome DevTools Console
chrome.alarms.getAll().then(console.log)

// Firefox Browser Console
browser.alarms.getAll().then(console.log)
```

查看特定 alarm：

```javascript
// Chrome
chrome.alarms.get('newApiModelSync').then(console.log)

// Firefox
browser.alarms.get('newApiModelSync').then(console.log)
```

## API 兼容性

### 跨浏览器支持

使用 `utils/browserApi.ts` 中的封装函数确保跨浏览器兼容：

- `hasAlarmsAPI()`: 检查是否支持 alarms API
- `createAlarm(name, config)`: 创建定时任务
- `clearAlarm(name)`: 清除定时任务
- `getAlarm(name)`: 获取定时任务
- `getAllAlarms()`: 获取所有定时任务
- `onAlarm(callback)`: 监听定时任务触发

### 支持的浏览器

- ✅ Chrome/Edge (Manifest V3)
- ✅ Firefox (Manifest V2)
- ⚠️ Safari (部分支持)

## 数据存储

### 配置存储

- **位置**: `user_preferences` (Plasmo storage, local area)
- **类型**: `UserPreferences.newApiModelSync`
- **访问**: 通过 `userPreferences.getPreferences()` 和 `savePreferences()`

### 执行结果存储

- **位置**: `newApiModelSync_lastExecution` (Plasmo storage, local area)
- **类型**: `ExecutionResult`
- **访问**: 通过 `newApiModelSyncStorage.getLastExecution()` 和 `saveLastExecution()`

## 配置更新流程

1. UI 修改配置
2. 调用 `newApiModelSyncStorage.savePreferences()`
3. 发送消息到 background: `newApiModelSync:updateSettings`
4. Background 调用 `newApiModelSyncScheduler.updateSettings()`
5. 更新 userPreferences
6. 重新设置 alarm (`setupAlarm()`)

## 常见问题

### Q: 为什么定时任务没有触发？

A: 检查以下几点：
1. 配置是否已启用 (`enabled: true`)
2. Alarm 是否成功创建（查看控制台日志）
3. 浏览器是否支持 alarms API
4. 间隔时间是否太短（最小 1 分钟）

### Q: 如何测试定时任务？

A: 可以临时设置一个很短的间隔（如 1 分钟）进行测试：

```typescript
await userPreferences.savePreferences({
  newApiModelSync: {
    enabled: true,
    interval: 60 * 1000,  // 1 分钟
    concurrency: 5,
    maxRetries: 2
  }
})
```

然后在 background 控制台观察日志输出。

### Q: 配置保存后为什么没有立即生效？

A: 需要通过消息通知 background 重新初始化 alarm：

```typescript
await browser.runtime.sendMessage({
  action: "newApiModelSync:updateSettings",
  settings: { ... }
})
```

### Q: 如何手动触发同步？

A: 通过发送消息到 background：

```typescript
// 执行所有渠道
await browser.runtime.sendMessage({
  action: "newApiModelSync:triggerAll"
})

// 执行指定渠道
await browser.runtime.sendMessage({
  action: "newApiModelSync:triggerSelected",
  channelIds: [1, 2, 3]
})

// 仅重试失败项
await browser.runtime.sendMessage({
  action: "newApiModelSync:triggerFailedOnly"
})
```

## 技术参考

- [Chrome Alarms API](https://developer.chrome.com/docs/extensions/reference/alarms/)
- [Firefox Alarms API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/alarms)
- [Plasmo Storage](https://docs.plasmo.com/framework/storage)
