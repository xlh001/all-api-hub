import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon
} from "@heroicons/react/24/outline"
import React from "react"
import { useTranslation } from "react-i18next"

import { useTheme } from "~/contexts/ThemeContext"
import type { ThemeMode } from "~/types/theme"

const getThemeOptions = (t: (key: string) => string) => {
  return [
    {
      mode: "light" as ThemeMode,
      label: t("theme.light"),
      icon: SunIcon,
      description: t("theme.useLightTheme")
    },
    {
      mode: "dark" as ThemeMode,
      label: t("theme.dark"),
      icon: MoonIcon,
      description: t("theme.useDarkTheme")
    },
    {
      mode: "system" as ThemeMode,
      label: t("theme.followSystem"),
      icon: ComputerDesktopIcon,
      description: t("theme.followSystemTheme")
    }
  ]
}

const CompactThemeToggle = () => {
  const { themeMode, setThemeMode, resolvedTheme } = useTheme()
  const { t } = useTranslation()
  const themeOptions = getThemeOptions(t)

  const currentIndex = themeOptions.findIndex(
    (option) => option.mode === themeMode
  )
  const nextIndex = (currentIndex + 1) % themeOptions.length
  const nextTheme = themeOptions[nextIndex]

  const CurrentIcon = themeOptions[currentIndex]?.icon || ComputerDesktopIcon
  const currentTheme = themeOptions[currentIndex]

  const handleThemeToggle = () => {
    setThemeMode(nextTheme.mode)
  }

  // Get the resolved theme label for system mode
  const resolvedThemeLabel =
    themeMode === "system"
      ? resolvedTheme === "dark"
        ? t("theme.dark")
        : t("theme.light")
      : t(`theme.${currentTheme?.mode}`)

  return (
    <button
      onClick={handleThemeToggle}
      className={`
        relative p-2.5 rounded-full transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        bg-gray-100 dark:bg-dark-bg-primary
        hover:bg-gray-200 dark:hover:bg-dark-bg-tertiary
        hover:scale-105 active:scale-95
        focus:ring-blue-500 dark:focus:ring-blue-400
        shadow-sm hover:shadow-md
      `}
      title={
        t("theme.current", {
          theme: t(`theme.${currentTheme?.mode}`),
          resolvedTheme: resolvedThemeLabel
        }) +
        "\n" +
        t("theme.clickSwitch", { nextMode: t(`theme.${nextTheme.mode}`) })
      }
      aria-label={t("theme.toggle", {
        currentMode: t(`theme.${currentTheme?.mode}`),
        nextMode: t(`theme.${nextTheme.mode}`)
      })}>
      <CurrentIcon
        className={`
        w-5 h-5 transition-colors duration-200
        ${
          themeMode === "light"
            ? "text-amber-500 dark:text-amber-400"
            : themeMode === "dark"
              ? "text-blue-500 dark:text-blue-400"
              : "text-purple-500 dark:text-purple-400"
        }
      `}
      />
    </button>
  )
}

export default CompactThemeToggle
