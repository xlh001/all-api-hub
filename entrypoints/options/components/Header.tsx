import { useTranslation } from "react-i18next"

import iconImage from "~/assets/icon.png"
import { LanguageSwitcher } from "~/components/LanguageSwitcher"

interface HeaderProps {
  onTitleClick: () => void
}

function Header({ onTitleClick }: HeaderProps) {
  const { t } = useTranslation("ui")
  return (
    <header className="bg-white dark:bg-dark-bg-secondary shadow-sm border-b border-gray-200 dark:border-dark-bg-tertiary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 插件图标和名称 */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={onTitleClick}>
            <img
              src={iconImage}
              alt={t("app.name")}
              className="w-8 h-8 rounded-lg shadow-sm"
            />
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-dark-text-primary">
                {t("app.name")}
              </h1>
              <p className="text-sm text-gray-500 dark:text-dark-text-tertiary">
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
