import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon
} from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import { BodySmall, Button, Caption, Heading5 } from "~/components/ui"
import { ANIMATIONS, COLORS } from "~/constants/designTokens"
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
    <div
      className={`flex items-center justify-between px-6 py-4 border-b ${COLORS.border.default} ${ANIMATIONS.transition.base}`}>
      <div className="flex items-center space-x-3">
        <div
          className={`p-2 rounded-lg ${COLORS.background.tertiary} ${ANIMATIONS.transition.base}`}>
          <SunIcon className="w-5 h-5 text-amber-500 dark:text-amber-400" />
        </div>
        <div>
          <Heading5
            className={`text-sm font-semibold ${COLORS.text.primary} ${ANIMATIONS.transition.base}`}>
            {t("theme.appearance")}
          </Heading5>
          <BodySmall
            className={`${COLORS.text.secondary} ${ANIMATIONS.transition.base}`}>
            {t("theme.selectTheme")}
          </BodySmall>
          <Caption
            className={`${COLORS.text.tertiary} mt-1 ${ANIMATIONS.transition.base}`}>
            {t("theme.currentTheme", {
              theme: themeOptions.find((opt) => opt.mode === themeMode)?.label,
              resolvedTheme:
                resolvedTheme === "dark" ? t("theme.dark") : t("theme.light")
            })}
          </Caption>
        </div>
      </div>

      <div
        className={`flex ${COLORS.background.tertiary} rounded-lg p-1 shadow-sm ${ANIMATIONS.transition.base}`}>
        {themeOptions.map(({ mode, label, icon: Icon, description }) => {
          const isActive = themeMode === mode
          return (
            <Button
              key={mode}
              onClick={() => handleThemeChange(mode)}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              className={`
                relative p-2 text-sm font-medium rounded-md
                focus:outline-none focus:ring-2 focus:ring-offset-1
                ${
                  isActive
                    ? `${COLORS.background.elevated} ${COLORS.text.primary} shadow-sm scale-105`
                    : `${COLORS.text.secondary} hover:${COLORS.text.primary} hover:${COLORS.background.secondary}`
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
            </Button>
          )
        })}
      </div>
    </div>
  )
}

export default ThemeToggle
