import { useEffect } from "react"
import { useTranslation } from "react-i18next"

import { menuItems } from "../constants"

interface SidebarProps {
  activeMenuItem: string
  onMenuItemClick: (itemId: string) => void
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

function Sidebar({
  activeMenuItem,
  onMenuItemClick,
  isMobileOpen,
  onMobileClose
}: SidebarProps) {
  const { t } = useTranslation("ui")

  // 移动端打开时禁止背景滚动
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileOpen])

  return (
    <>
      {/* 移动端遮罩层 */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* 侧边栏 */}
      <aside
        className={`
        w-64 flex-shrink-0
        md:relative md:translate-x-0
        fixed inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        mt-0 md:mt-0
      `}>
        <nav className="bg-white dark:bg-dark-bg-secondary rounded-none md:rounded-lg shadow-sm border-r md:border border-gray-200 dark:border-dark-bg-tertiary overflow-hidden h-full md:h-auto">
          <div className="p-3 sm:p-4 border-b border-gray-100 dark:border-dark-bg-tertiary">
            <h2 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-dark-text-tertiary uppercase tracking-wide">
              {t("navigation.settingsOptions")}
            </h2>
          </div>
          <ul className="divide-y divide-gray-100 dark:divide-dark-bg-tertiary overflow-y-auto max-h-[calc(100vh-8rem)] md:max-h-none">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeMenuItem === item.id

              return (
                <li key={item.id}>
                  <button
                    onClick={() => onMenuItemClick(item.id)}
                    className={`w-full flex items-center px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-colors touch-manipulation tap-highlight-transparent ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-r-2 border-blue-600 dark:border-blue-500"
                        : "text-gray-700 dark:text-dark-text-secondary"
                    }`}>
                    <Icon
                      className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0 ${
                        isActive
                          ? "text-blue-600 dark:text-blue-500"
                          : "text-gray-400 dark:text-dark-text-tertiary"
                      }`}
                    />
                    <span className="font-medium text-sm sm:text-base">
                      {t(`navigation.${item.id}`)}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
