// 站点名称常量
export const ONE_API = "one-api"
export const NEW_API = "new-api"
export const VELOERA = "Veloera"
export const ONE_HUB = "one-hub"
export const DONE_HUB = "done-hub"
export const VO_API = "VoAPI"
export const SUPER_API = "Super-API"

export type SiteType = (typeof SITE_TITLE_RULES)[number]["name"]

// 定义网站类型及匹配规则
export const SITE_TITLE_RULES = [
  { name: ONE_API, regex: makeTitleRegex(ONE_API) },
  { name: NEW_API, regex: makeTitleRegex(NEW_API) },
  { name: VELOERA, regex: makeTitleRegex(VELOERA) },
  { name: ONE_HUB, regex: makeTitleRegex(ONE_HUB) },
  { name: DONE_HUB, regex: makeTitleRegex(DONE_HUB) },
  { name: VO_API, regex: makeTitleRegex(VO_API) },
  { name: SUPER_API, regex: makeTitleRegex(SUPER_API) }
]

/**
 * 根据站点名生成正则
 * - 自动处理连字符替换成 [-_ ]?
 * - 加上单词边界 \b，避免误匹配
 */
function makeTitleRegex(name: string): RegExp {
  const pattern = name.replace("-", "[-_ ]?")
  return new RegExp(`\\b${pattern}\\b`, "i")
}
