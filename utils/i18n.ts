import dayjs from "dayjs"

import "dayjs/locale/zh-cn"

import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

import { DEFAULT_LANG } from "~/constants"
import enTranslation from "~/locales/en/translation.json"
import zhCNTranslation from "~/locales/zh_CN/translation.json"
import { userPreferences } from "~/services/userPreferences"

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: process.env.NODE_ENV === "development",
    fallbackLng: DEFAULT_LANG,
    defaultNS: "translation",
    resources: {
      en: {
        translation: enTranslation
      },
      zh_CN: {
        translation: zhCNTranslation
      }
    },
    interpolation: {
      escapeValue: false // react already escapes by default
    },
    // Set the language determined by user preferences, or let detector handle it
    react: {
      useSuspense: false
    }
  })
  .then(async () => {
    const storedLanguage = (await userPreferences.getLanguage()) || DEFAULT_LANG
    await i18n.changeLanguage(storedLanguage)
    dayjs.locale(mapToDayjsLocale(storedLanguage.toLowerCase()))
  })

export default i18n

i18n.on("languageChanged", async (lng) => {
  dayjs.locale(mapToDayjsLocale(lng))
})

/**
 * 将 i18next 的语言代码转换为 dayjs 可识别的 locale 名称
 * 自动处理大小写、下划线/连字符问题、区域回退等。
 */
export function mapToDayjsLocale(lng: string): string {
  // 统一格式为小写，并将下划线替换为连字符
  return lng.toLowerCase().replace("_", "-")
}
