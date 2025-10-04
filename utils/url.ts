/**
 * 连接 base URL 和 path URL
 * - 将 base URL 和 path URL 连接起来，并将多个 / 字符合并成一个
 * - 如果 base URL 结尾是 /，或者 path URL 开头是 /，那么将其删除
 * @param base - 基础 URL
 * @param path - 需要连接的 URL 路径
 * @returns 连接后的 URL
 */
export function joinUrl(base: string, path: string) {
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`
}
