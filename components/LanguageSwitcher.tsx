import { Languages } from "lucide-react"
import { useTranslation } from "react-i18next"

import { userPreferences } from "~/services/userPreferences"

const languageOptions = [
  { code: "en", label: "EN" },
  { code: "zh_CN", label: "中文" }
]

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const handleLanguageChange = async (lng: string) => {
    await i18n.changeLanguage(lng)
    await userPreferences.setLanguage(lng)
  }

  return (
    <div className="flex items-center space-x-1.5 sm:space-x-2">
      <Languages className="h-4 w-4 sm:h-[1.2rem] sm:w-[1.2rem]" />
      <div className="flex bg-gray-100 dark:bg-dark-bg-primary rounded-lg p-0.5 sm:p-1 shadow-sm transition-all duration-200">
        {languageOptions.map(({ code, label }) => {
          const isActive = i18n.language === code
          return (
            <button
              key={code}
              onClick={() => handleLanguageChange(code)}
              className={`
                relative px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-1
                touch-manipulation tap-highlight-transparent
                ${
                  isActive
                    ? "bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text-primary shadow-sm scale-105"
                    : "text-gray-600 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text-primary hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary"
                }
                focus:ring-blue-500 dark:focus:ring-blue-400
              `}
              title={`Switch to ${label}`}
              aria-label={`Switch to ${label}`}
              aria-pressed={isActive}>
              {label}
              {isActive && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-500 dark:bg-blue-400 rounded-t-sm" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
