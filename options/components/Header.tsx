import iconImage from "~/assets/icon.png"

interface HeaderProps {
  onTitleClick: () => void
}

function Header({ onTitleClick }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-dark-bg-secondary shadow-sm border-b border-gray-200 dark:border-dark-bg-tertiary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* 插件图标和名称 */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={onTitleClick}>
            <img
              src={iconImage}
              alt="All API Hub"
              className="w-8 h-8 rounded-lg shadow-sm"
            />
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-dark-text-primary">
                All API Hub
              </h1>
              <p className="text-sm text-gray-500 dark:text-dark-text-tertiary">
                AI 中转站账号管理插件
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
