import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import iconImage from "~/assets/icon.png"
import { LanguageSwitcher } from "~/components/LanguageSwitcher"

interface HeaderProps {
  onTitleClick: () => void
  onMenuToggle?: () => void
  isMobileSidebarOpen?: boolean
}

function Header({
  onTitleClick,
  onMenuToggle,
  isMobileSidebarOpen
}: HeaderProps) {
  const { t } = useTranslation("ui")
  return (
    <header className="bg-white dark:bg-dark-bg-secondary shadow-sm border-b border-gray-200 dark:border-dark-bg-tertiary sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* 移动端菜单按钮 */}
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary touch-manipulation tap-highlight-transparent"
            aria-label="Toggle menu">
            {isMobileSidebarOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>

          {/* 插件图标和名称 */}
          <div
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer touch-manipulation tap-highlight-transparent"
            onClick={onTitleClick}>
            <img
              src={iconImage}
              alt={t("app.name")}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg shadow-sm"
            />
            <div className="hidden xs:block">
              <h1 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-dark-text-primary">
                {t("app.name")}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-dark-text-tertiary hidden sm:block">
                {t("app.description")}
              </p>
            </div>
          </div>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}

export default Header
