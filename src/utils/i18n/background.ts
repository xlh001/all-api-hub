import dayjs from "dayjs"

import "dayjs/locale/zh-cn"

import { DEFAULT_LANG } from "~/constants"
import { userPreferences } from "~/services/preferences/userPreferences"

import i18n from "./core"
import { mapToDayjsLocale, resources } from "./resources"

/**
 * 初始化 background i18n
 */
export async function initBackgroundI18n() {
  await i18n.init({
    resources,
    fallbackLng: DEFAULT_LANG,
    defaultNS: "common",
    interpolation: { escapeValue: false },
    returnEmptyString: false,
  })

  // 尝试读取用户偏好语言
  const storedLanguage = (await userPreferences.getLanguage()) || DEFAULT_LANG
  await i18n.changeLanguage(storedLanguage)

  // 同步 dayjs locale
  dayjs.locale(mapToDayjsLocale(storedLanguage))
}

// 监听语言变更，保持 dayjs 一致
i18n.on("languageChanged", (lng) => {
  dayjs.locale(mapToDayjsLocale(lng))
})

export default i18n
