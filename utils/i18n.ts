import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

import { userPreferences } from "~/services/userPreferences"

import enTranslation from "../locales/en/translation.json"
import zhCNTranslation from "../locales/zh_CN/translation.json"

// Asynchronously load user's language preference
const loadLanguagePreference = async () => {
  return await userPreferences.getLanguage()
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: process.env.NODE_ENV === "development",
    fallbackLng: "en",
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
    const storedLanguage = await loadLanguagePreference()
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage)
    }
  })

export default i18n
