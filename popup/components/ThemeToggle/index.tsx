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
}[] = [
  { mode: "light", label: "浅色", icon: SunIcon },
  { mode: "dark", label: "深色", icon: MoonIcon },
  { mode: "system", label: "跟随系统", icon: ComputerDesktopIcon }
]

const CompactThemeToggle = () => {
  const { themeMode, setThemeMode } = useTheme()

  const currentIndex = themeOptions.findIndex(
    (option) => option.mode === themeMode
  )
  const nextIndex = (currentIndex + 1) % themeOptions.length
  const nextTheme = themeOptions[nextIndex]

  const CurrentIcon = themeOptions[currentIndex]?.icon || ComputerDesktopIcon

  return (
    <button
      onClick={() => setThemeMode(nextTheme.mode)}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-colors"
      title={`切换到${nextTheme.label}模式`}>
      <CurrentIcon className="w-5 h-5 text-gray-500 dark:text-dark-text-secondary" />
    </button>
  )
}

export default CompactThemeToggle
