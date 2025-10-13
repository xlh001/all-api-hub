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

const ThemeToggle = () => {
  const { themeMode, setThemeMode } = useTheme()

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-dark-bg-tertiary">
      <div className="flex items-center space-x-3">
        <SunIcon className="w-5 h-5 text-gray-400" />
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">
            外观
          </h3>
          <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
            选择一个外观主题
          </p>
        </div>
      </div>
      <div className="flex bg-gray-100 dark:bg-dark-bg-primary rounded-lg p-1">
        {themeOptions.map(({ mode, label, icon: Icon }) => (
          <button
            key={mode}
            onClick={() => setThemeMode(mode)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              themeMode === mode
                ? "bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text-primary shadow-sm"
                : "text-gray-500 dark:text-dark-text-secondary hover:text-gray-700 dark:hover:text-dark-text-primary"
            }`}>
            <span className="flex items-center">
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ThemeToggle
