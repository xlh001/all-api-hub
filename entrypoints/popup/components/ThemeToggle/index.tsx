import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon
} from "@heroicons/react/24/outline"
import React from "react"

import { useTheme } from "~/contexts/ThemeContext"
import type { ThemeMode } from "~/types/theme"

const themeOptions: {
  mode: ThemeMode
  label: string
  icon: React.ElementType
  description: string
}[] = [
  {
    mode: "light",
    label: "浅色",
    icon: SunIcon,
    description: "使用浅色主题"
  },
  {
    mode: "dark",
    label: "深色",
    icon: MoonIcon,
    description: "使用深色主题"
  },
  {
    mode: "system",
    label: "跟随系统",
    icon: ComputerDesktopIcon,
    description: "跟随系统主题设置"
  }
]

const CompactThemeToggle = () => {
  const { themeMode, setThemeMode, resolvedTheme } = useTheme()

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
      title={`当前: ${currentTheme?.label} (${themeMode === "system" ? (resolvedTheme === "dark" ? "深色" : "浅色") : currentTheme?.label})\n点击切换到${nextTheme.label}模式`}
      aria-label={`主题切换，当前${currentTheme?.label}模式，点击切换到${nextTheme.label}模式`}>
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
