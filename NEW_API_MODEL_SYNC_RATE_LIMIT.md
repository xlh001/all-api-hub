# New API 模型同步 - 速率限制说明

## 概述

为避免触发 New API 服务端的速率限制（HTTP 429错误），模型同步功能实现了基于令牌桶算法的速率限制器。

## 配置参数

### 速率限制配置

```typescript
{
  newApiModelSync: {
    concurrency: 2,  // 同时进行的任务数
    rateLimit: {
      requestsPerMinute: 20,  // 每分钟最多请求数
      burst: 5               // 突发请求上限（令牌桶容量）
    }
  }
}
```

### 参数说明

#### `concurrency` (并发数)
- **默认值**: 2
- **建议范围**: 1-3
- **说明**: 同时执行的渠道同步任务数。降低此值可以减少并发请求压力。
- **注意**: 即使并发数为2，由于每个任务需要2个请求（fetch + update），实际最大并发请求为4。

#### `rateLimit.requestsPerMinute` (每分钟请求数)
- **默认值**: 20
- **建议范围**: 10-30
- **说明**: 每分钟允许的最大请求数。
- **计算方式**: 60000ms / requestsPerMinute = 每个请求的最小间隔

#### `rateLimit.burst` (突发容量)
- **默认值**: 5
- **建议范围**: 3-10
- **说明**: 令牌桶的容量，允许短时间内的突发请求。
- **作用**: 开始时可以快速发送最多5个请求，之后按照 requestsPerMinute 的速率补充令牌。

## 令牌桶算法

### 工作原理

1. **令牌桶**：维护一个固定容量的令牌桶
2. **令牌补充**：按照 `requestsPerMinute` 的速率持续补充令牌
3. **请求消费**：每个请求消耗一个令牌
4. **等待机制**：令牌不足时，请求会自动等待直到有可用令牌

### 实现细节

```typescript
class RateLimiter {
  private tokens: number            // 当前可用令牌数
  private lastRefill: number        // 上次补充时间
  private readonly capacity: number // 令牌桶容量（burst）
  private readonly refillRate: number // 补充速率（tokens/ms）
  
  constructor(requestsPerMinute: number, burst: number) {
    this.capacity = burst
    this.tokens = burst  // 初始满容量
    this.refillRate = requestsPerMinute / 60000
  }
  
  async acquire(): Promise<void> {
    // 自动补充令牌
    this.refill()
    
    // 如果有令牌，立即消费
    if (this.tokens >= 1) {
      this.tokens -= 1
      return
    }
    
    // 等待令牌补充
    const waitTime = /* 计算等待时间 */
    await sleep(waitTime)
    return this.acquire()
  }
}
```

## 使用场景

### 场景1：100个渠道，默认配置

**配置**:
- `concurrency`: 2
- `requestsPerMinute`: 20
- `burst`: 5

**预计耗时**:
- 总请求数: 100 × 2 = 200 (fetch + update)
- 初始突发: 5个请求 (0-15秒)
- 后续请求: 195个请求 / 20 = 9.75分钟
- **总计**: 约 10 分钟

### 场景2：高速率配置（不推荐）

**配置**:
- `concurrency`: 5
- `requestsPerMinute`: 60
- `burst`: 10

**风险**:
- 更容易触发429错误
- 可能被服务端临时封禁
- **不建议使用**

### 场景3：保守配置（推荐）

**配置**:
- `concurrency`: 1
- `requestsPerMinute`: 15
- `burst`: 3

**优势**:
- 最低的429风险
- 适合API限制严格的站点
- 稳定性最高

## 调整建议

### 根据站点情况调整

1. **测试阶段**
   - 先使用保守配置（concurrency=1, requestsPerMinute=10）
   - 观察是否有429错误
   - 逐步提高速率

2. **生产环境**
   - 监控失败率和429错误
   - 根据站点响应调整参数
   - 优先保证稳定性而非速度

3. **大量渠道**
   - 如果渠道数 > 100，考虑降低并发和速率
   - 可以增加自动执行频率，分散压力

### 参数组合建议

| 场景 | concurrency | requestsPerMinute | burst | 预计速度 |
|------|-------------|-------------------|-------|---------|
| 保守 | 1 | 15 | 3 | 慢 |
| 默认 | 2 | 20 | 5 | 中等 |
| 激进 | 3 | 30 | 8 | 快（有风险）|

## 错误处理

### 429错误处理

1. **自动重试**: 内置指数退避重试（最多2次）
2. **速率调整**: 如果频繁出现429，降低速率
3. **监控统计**: 查看失败率，判断是否需要调整

### 日志示例

```
[NewApiModelSync] Starting execution
[NewApiModelSync] Rate limiter: 20 req/min, burst=5
[RateLimiter] Acquired token, remaining: 4
[RateLimiter] Acquired token, remaining: 3
[RateLimiter] No tokens available, waiting 3000ms
[RateLimiter] Acquired token, remaining: 1
...
[NewApiModelSync] Execution completed: 95/100 succeeded
```

## 默认值来源

所有默认值统一从 `DEFAULT_PREFERENCES` 获取：

```typescript
// services/userPreferences.ts
export const DEFAULT_PREFERENCES: UserPreferences = {
  newApiModelSync: {
    enabled: false,
    interval: 24 * 60 * 60 * 1000, // 24小时
    concurrency: 2,
    maxRetries: 2,
    rateLimit: {
      requestsPerMinute: 20,
      burst: 5
    }
  }
}
```

**优势**:
- 避免魔法数字
- 统一配置管理
- 便于维护和测试
- 类型安全

## API调用顺序

每个渠道的同步流程：

```
1. [限流] 等待令牌
2. GET /api/channel/fetch_models/{id}
3. [限流] 等待令牌
4. PUT /api/channel/ (仅在模型有变化时)
```

列表获取也受限流控制：

```
1. [限流] 等待令牌
2. GET /api/channel/?p=1&page_size=100
3. [限流] 等待令牌
4. GET /api/channel/?p=2&page_size=100
...
```

## 性能优化建议

1. **减少不必要的更新**
   - 只在模型列表变化时才更新
   - 比较时先排序，避免顺序差异

2. **批量处理**
   - 使用并发控制，但不要过高
   - 利用突发容量快速开始

3. **定时调度**
   - 使用24小时间隔避免频繁执行
   - 在服务器低峰期执行（如凌晨）

4. **监控和日志**
   - 记录429错误频率
   - 跟踪平均执行时间
   - 根据统计数据调整参数

## 故障排查

### 问题：频繁出现429错误

**解决方案**:
1. 降低 `requestsPerMinute` (如 15 或 10)
2. 降低 `concurrency` (改为 1)
3. 增加 `burst` 容量没有帮助（不要尝试）

### 问题：执行太慢

**解决方案**:
1. 适度提高 `requestsPerMinute` (如 25 或 30)
2. 确保没有429错误后再提高 `concurrency`
3. 考虑分批执行而非一次全部

### 问题：令牌补充不够快

**检查**:
- 令牌补充速率 = requestsPerMinute / 60
- 例如 20 req/min = 每3秒补充1个令牌
- 如果并发过高，令牌会很快耗尽

## 技术参考

- [Token Bucket Algorithm](https://en.wikipedia.org/wiki/Token_bucket)
- [Rate Limiting Patterns](https://cloud.google.com/architecture/rate-limiting-strategies-techniques)
- [HTTP 429 Too Many Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429)
