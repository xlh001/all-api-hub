import "~/popup/style.css"

import { ThemeAwareToaster } from "~/components/ThemeAwareToaster"
import { ThemeProvider } from "~/contexts/ThemeContext"
import { UserPreferencesProvider } from "~/contexts/UserPreferencesContext"

import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import { menuItems } from "./constants"
import { useHashNavigation } from "./hooks/useHashNavigation"
import BasicSettings from "./pages/BasicSettings"

function OptionsPage() {
  const { activeMenuItem, routeParams, handleMenuItemChange, refreshKey } =
    useHashNavigation()

  // 获取当前活动的组件
  const ActiveComponent =
    menuItems.find((item) => item.id === activeMenuItem)?.component ||
    BasicSettings

  const handleTitleClick = () => {
    handleMenuItemChange("basic")
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg-primary">
      <Header onTitleClick={handleTitleClick} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <Sidebar
            activeMenuItem={activeMenuItem}
            onMenuItemClick={handleMenuItemChange}
          />

          {/* 右侧内容区域 */}
          <main className="flex-1 min-w-0">
            <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-sm border border-gray-200 dark:border-dark-bg-tertiary min-h-[600px]">
              <ActiveComponent
                routeParams={routeParams}
                refreshKey={refreshKey}
              />
            </div>
          </main>
        </div>
      </div>
      <ThemeAwareToaster reverseOrder={false} />
    </div>
  )
}

function WrappedOptionsPage() {
  return (
    <UserPreferencesProvider>
      <ThemeProvider>
        <OptionsPage />
      </ThemeProvider>
    </UserPreferencesProvider>
  )
}

export default WrappedOptionsPage
