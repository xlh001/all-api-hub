// 格式化密钥显示
export const formatKey = (
  key: string,
  tokenId: number,
  visibleKeys: Set<number>
) => {
  if (visibleKeys.has(tokenId)) {
    return key
  }
  if (key.length < 12) {
    return "******"
  }
  return `${key.substring(0, 8)}${"*".repeat(16)}${key.substring(
    key.length - 4
  )}`
}

// 格式化时间
export const formatTime = (timestamp: number) => {
  if (timestamp <= 0) return "永不过期"
  return new Date(timestamp * 1000).toLocaleDateString("zh-CN")
}

// 格式化额度
export const formatQuota = (quota: number, unlimited: boolean) => {
  if (unlimited || quota < 0) return "无限额度"
  return `$${(quota / 500000).toFixed(2)}`
}
