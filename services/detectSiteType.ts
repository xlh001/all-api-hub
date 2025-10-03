import { SITE_TITLE_RULES } from "~/constants/siteType"

export const fetchSiteOriginalTitle = async (url: string) => {
  const response = await fetch(url, { cache: "no-store" })
  const html = await response.text()
  const match = html.match(/<title>(.*?)<\/title>/i)
  const title = match ? match[1] : "未找到"
  console.log("原始 document title:", title)
}

export const getSiteType = async (title: string) => {
  let detected = "unknown"
  for (const rule of SITE_TITLE_RULES) {
    if (rule.regex.test(title)) {
      detected = rule.name
      break
    }
  }
  return detected
}
