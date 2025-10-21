import { useState } from "react"

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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // 获取当前活动的组件
  const ActiveComponent =
    menuItems.find((item) => item.id === activeMenuItem)?.component ||
    BasicSettings

  const handleTitleClick = () => {
    handleMenuItemChange("basic")
  }

  const handleMenuItemClick = (itemId: string) => {
    handleMenuItemChange(itemId)
    setIsMobileSidebarOpen(false) // 移动端选择后关闭侧边栏
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg-primary">
      <Header
        onTitleClick={handleTitleClick}
        onMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-4 md:py-8">
        <div className="flex flex-col md:flex-row gap-2 sm:gap-4 md:gap-8">
          <Sidebar
            activeMenuItem={activeMenuItem}
            onMenuItemClick={handleMenuItemClick}
            isMobileOpen={isMobileSidebarOpen}
            onMobileClose={() => setIsMobileSidebarOpen(false)}
          />

          {/* 右侧内容区域 */}
          <main className="flex-1 min-w-0">
            <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-sm border border-gray-200 dark:border-dark-bg-tertiary min-h-[400px] md:min-h-[600px]">
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

function App() {
  return (
    <UserPreferencesProvider>
      <ThemeProvider>
        <OptionsPage />
      </ThemeProvider>
    </UserPreferencesProvider>
  )
}

export default App
