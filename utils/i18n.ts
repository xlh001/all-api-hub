import dayjs from "dayjs"

import "dayjs/locale/zh-cn"

import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

import { DEFAULT_LANG } from "~/constants"
// Import all namespace files
import enCommon from "~/locales/en/common.json"
import enAccount from "~/locales/en/account.json"
import enAccountDialog from "~/locales/en/accountDialog.json"
import enKeyManagement from "~/locales/en/keyManagement.json"
import enModelList from "~/locales/en/modelList.json"
import enSettings from "~/locales/en/settings.json"
import enMessages from "~/locales/en/messages.json"
import enUi from "~/locales/en/ui.json"
import enImportExport from "~/locales/en/importExport.json"
import enAbout from "~/locales/en/about.json"
import enTranslation from "~/locales/en/translation.json"

import zhCNCommon from "~/locales/zh_CN/common.json"
import zhCNAccount from "~/locales/zh_CN/account.json"
import zhCNAccountDialog from "~/locales/zh_CN/accountDialog.json"
import zhCNKeyManagement from "~/locales/zh_CN/keyManagement.json"
import zhCNModelList from "~/locales/zh_CN/modelList.json"
import zhCNSettings from "~/locales/zh_CN/settings.json"
import zhCNMessages from "~/locales/zh_CN/messages.json"
import zhCNUi from "~/locales/zh_CN/ui.json"
import zhCNImportExport from "~/locales/zh_CN/importExport.json"
import zhCNAbout from "~/locales/zh_CN/about.json"
import zhCNTranslation from "~/locales/zh_CN/translation.json"
import { userPreferences } from "~/services/userPreferences"

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: process.env.NODE_ENV === "development",
    fallbackLng: DEFAULT_LANG,
    defaultNS: "translation",
    ns: [
      "translation",
      "common",
      "account",
      "accountDialog",
      "keyManagement",
      "modelList",
      "settings",
      "messages",
      "ui",
      "importExport",
      "about"
    ],
    resources: {
      en: {
        translation: enTranslation,
        common: enCommon,
        account: enAccount,
        accountDialog: enAccountDialog,
        keyManagement: enKeyManagement,
        modelList: enModelList,
        settings: enSettings,
        messages: enMessages,
        ui: enUi,
        importExport: enImportExport,
        about: enAbout
      },
      zh_CN: {
        translation: zhCNTranslation,
        common: zhCNCommon,
        account: zhCNAccount,
        accountDialog: zhCNAccountDialog,
        keyManagement: zhCNKeyManagement,
        modelList: zhCNModelList,
        settings: zhCNSettings,
        messages: zhCNMessages,
        ui: zhCNUi,
        importExport: zhCNImportExport,
        about: zhCNAbout
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
