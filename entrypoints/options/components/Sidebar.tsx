import { useTranslation } from "react-i18next"

import { menuItems } from "../constants"

interface SidebarProps {
  activeMenuItem: string
  onMenuItemClick: (itemId: string) => void
}

function Sidebar({ activeMenuItem, onMenuItemClick }: SidebarProps) {
  const { t } = useTranslation("ui")
  return (
    <aside className="w-64 flex-shrink-0">
      <nav className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-sm border border-gray-200 dark:border-dark-bg-tertiary overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-dark-bg-tertiary">
          <h2 className="text-sm font-medium text-gray-500 dark:text-dark-text-tertiary uppercase tracking-wide">
            {t("navigation.settingsOptions")}
          </h2>
        </div>
        <ul className="divide-y divide-gray-100 dark:divide-dark-bg-tertiary">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeMenuItem === item.id

            return (
              <li key={item.id}>
                <button
                  onClick={() => onMenuItemClick(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-colors ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-r-2 border-blue-600 dark:border-blue-500"
                      : "text-gray-700 dark:text-dark-text-secondary"
                  }`}>
                  <Icon
                    className={`w-5 h-5 mr-3 ${
                      isActive
                        ? "text-blue-600 dark:text-blue-500"
                        : "text-gray-400 dark:text-dark-text-tertiary"
                    }`}
                  />
                  <span className="font-medium">
                    {t(`navigation.${item.id}`)}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
