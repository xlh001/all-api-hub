// 站点名称常量
export const ONE_API = "one-api"
export const NEW_API = "new-api"
export const VELOERA = "Veloera"
export const ONE_HUB = "one-hub"
export const DONE_HUB = "done-hub"
export const VO_API = "VoAPI"
export const SUPER_API = "Super-API"

// 定义网站类型及匹配规则
export const SITE_TITLE_RULES = [
  { name: ONE_API, regex: new RegExp(ONE_API.replace("-", "[-_ ]?"), "i") },
  { name: NEW_API, regex: new RegExp(NEW_API.replace("-", "[-_ ]?"), "i") },
  { name: VELOERA, regex: new RegExp(VELOERA, "i") },
  { name: ONE_HUB, regex: new RegExp(ONE_HUB.replace("-", "[-_ ]?"), "i") },
  { name: DONE_HUB, regex: new RegExp(DONE_HUB.replace("-", "[-_ ]?"), "i") },
  { name: VO_API, regex: new RegExp(VO_API.replace("-", "[-_ ]?"), "i") },
  { name: SUPER_API, regex: new RegExp(SUPER_API.replace("-", "[-_ ]?"), "i") }
]
