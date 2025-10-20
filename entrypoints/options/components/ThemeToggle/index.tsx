import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon
} from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import { useTheme } from "~/contexts/ThemeContext"
import type { ThemeMode } from "~/types/theme"

const getThemeOptions = (t: (key: string) => string) => {
  return [
    {
      mode: "light" as ThemeMode,
      label: t("settings:theme.light"),
      icon: SunIcon,
      description: t("settings:theme.useLightTheme")
    },
    {
      mode: "dark" as ThemeMode,
      label: t("settings:theme.dark"),
      icon: MoonIcon,
      description: t("settings:theme.useDarkTheme")
    },
    {
      mode: "system" as ThemeMode,
      label: t("settings:theme.followSystem"),
      icon: ComputerDesktopIcon,
      description: t("settings:theme.followSystemTheme")
    }
  ]
}

const ThemeToggle = () => {
  const { themeMode, setThemeMode, resolvedTheme } = useTheme()
  const { t } = useTranslation("settings")
  const themeOptions = getThemeOptions(t)

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode)
  }

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-dark-bg-tertiary transition-colors">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-gray-100 dark:bg-dark-bg-primary transition-colors">
          <SunIcon className="w-5 h-5 text-amber-500 dark:text-amber-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-dark-text-primary transition-colors">
            {t("theme.appearance")}
          </h3>
          <p className="text-sm text-gray-600 dark:text-dark-text-secondary transition-colors">
            {t("theme.selectTheme")}
          </p>
          <p className="text-xs text-gray-500 dark:text-dark-text-tertiary mt-1 transition-colors">
            {t("theme.currentTheme", {
              theme: themeOptions.find((opt) => opt.mode === themeMode)?.label,
              resolvedTheme:
                resolvedTheme === "dark" ? t("theme.dark") : t("theme.light")
            })}
          </p>
        </div>
      </div>

      <div className="flex bg-gray-100 dark:bg-dark-bg-primary rounded-lg p-1 shadow-sm transition-all duration-200">
        {themeOptions.map(({ mode, label, icon: Icon, description }) => {
          const isActive = themeMode === mode
          return (
            <button
              key={mode}
              onClick={() => handleThemeChange(mode)}
              className={`
                relative px-3 py-2 text-sm font-medium rounded-md transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-1
                ${
                  isActive
                    ? "bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text-primary shadow-sm scale-105"
                    : "text-gray-600 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text-primary hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary"
                }
                focus:ring-blue-500 dark:focus:ring-blue-400
              `}
              title={description}
              aria-label={t("theme.switchTo", { theme: label, description })}
              aria-pressed={isActive}>
              <span className="flex items-center">
                <Icon
                  className={`
                  w-4 h-4 mr-2 transition-colors
                  ${
                    isActive
                      ? "text-blue-500 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400"
                  }
                `}
                />
                {label}
              </span>
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

export default ThemeToggle
