import { userPreferences } from "~/services/userPreferences"

export interface WebdavConfig {
  webdavUrl: string
  webdavUsername: string
  webdavPassword: string
}

function buildAuthHeader(username: string, password: string) {
  const token = btoa(`${username}:${password}`)
  return `Basic ${token}`
}

const CONFIG_VERSION = "1-0"
const PROGRAM_NAME = "all-api-hub"

function ensureFilename(url: string, version: string = CONFIG_VERSION) {
  try {
    // If it's clearly a directory or missing extension, append default filename
    const hasJson = /\.json($|\?)/i.test(url)
    const endsWithSlash = /\/$/.test(url)
    if (hasJson) return url
    const sep = endsWithSlash ? "" : "/"
    return `${url}${sep}${PROGRAM_NAME}-backup/${PROGRAM_NAME}-${version}.json`
  } catch {
    return url
  }
}

export function resolveTargetUrl(
  url: string,
  version: string = CONFIG_VERSION
) {
  return ensureFilename(url, version)
}

async function getConfig(): Promise<WebdavConfig> {
  const prefs = await userPreferences.getPreferences()
  const { webdavUrl, webdavUsername, webdavPassword } = prefs
  return { webdavUrl, webdavUsername, webdavPassword }
}

export async function testWebdavConnection(custom?: Partial<WebdavConfig>) {
  const cfg = { ...(await getConfig()), ...custom }
  if (!cfg.webdavUrl || !cfg.webdavUsername || !cfg.webdavPassword) {
    throw new Error("请先完整填写 WebDAV URL、用户名和密码")
  }
  const targetUrl = ensureFilename(cfg.webdavUrl)

  const res = await fetch(targetUrl, {
    method: "GET",
    headers: {
      Authorization: buildAuthHeader(cfg.webdavUsername, cfg.webdavPassword)
    }
  })
  // 200 存在；404 文件不存在但鉴权通过也视为连通
  if (res.status === 200 || res.status === 404) return true
  if (res.status === 401 || res.status === 403)
    throw new Error("鉴权失败，请检查用户名/密码")
  throw new Error(`连接失败，状态码: ${res.status}`)
}

export async function downloadBackup(custom?: Partial<WebdavConfig>) {
  const cfg = { ...(await getConfig()), ...custom }
  if (!cfg.webdavUrl || !cfg.webdavUsername || !cfg.webdavPassword) {
    throw new Error("请先完整填写 WebDAV URL、用户名和密码")
  }
  const targetUrl = ensureFilename(cfg.webdavUrl)

  const res = await fetch(targetUrl, {
    method: "GET",
    headers: {
      Authorization: buildAuthHeader(cfg.webdavUsername, cfg.webdavPassword),
      Accept: "application/json"
    }
  })
  if (res.status === 200) {
    const text = await res.text()
    return text
  }
  if (res.status === 404) throw new Error("远程备份文件不存在")
  if (res.status === 401 || res.status === 403)
    throw new Error("鉴权失败，请检查用户名/密码")
  throw new Error(`下载失败，状态码: ${res.status}`)
}

export async function uploadBackup(
  content: string,
  custom?: Partial<WebdavConfig>
) {
  const cfg = { ...(await getConfig()), ...custom }
  if (!cfg.webdavUrl || !cfg.webdavUsername || !cfg.webdavPassword) {
    throw new Error("请先完整填写 WebDAV URL、用户名和密码")
  }
  const targetUrl = ensureFilename(cfg.webdavUrl)

  const res = await fetch(targetUrl, {
    method: "PUT",
    headers: {
      Authorization: buildAuthHeader(cfg.webdavUsername, cfg.webdavPassword),
      "Content-Type": "application/json"
    },
    body: content
  })

  if (res.status >= 200 && res.status < 300) return true
  if (res.status === 401 || res.status === 403)
    throw new Error("鉴权失败，请检查用户名/密码")
  throw new Error(`上传失败，状态码: ${res.status}`)
}
