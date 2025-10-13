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

const ThemeToggle = () => {
  const { themeMode, setThemeMode, resolvedTheme } = useTheme()

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
            外观
          </h3>
          <p className="text-sm text-gray-600 dark:text-dark-text-secondary transition-colors">
            选择一个外观主题
          </p>
          <p className="text-xs text-gray-500 dark:text-dark-text-tertiary mt-1 transition-colors">
            当前: {themeOptions.find((opt) => opt.mode === themeMode)?.label}
            {themeMode === "system" &&
              ` (${resolvedTheme === "dark" ? "深色" : "浅色"})`}
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
              aria-label={`切换到${label}主题: ${description}`}
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
