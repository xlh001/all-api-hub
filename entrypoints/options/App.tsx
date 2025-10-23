import { useState } from "react"

import { ThemeAwareToaster } from "~/components/ThemeAwareToaster"
import { DeviceProvider } from "~/contexts/DeviceContext"
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

      <div className="mx-auto max-w-7xl px-2 py-2 sm:px-4 sm:py-4 md:px-6 md:py-8 lg:px-8">
        <div className="flex flex-col gap-2 sm:gap-4 md:flex-row md:gap-8">
          <Sidebar
            activeMenuItem={activeMenuItem}
            onMenuItemClick={handleMenuItemClick}
            isMobileOpen={isMobileSidebarOpen}
            onMobileClose={() => setIsMobileSidebarOpen(false)}
          />

          {/* 右侧内容区域 */}
          <main className="min-w-0 flex-1">
            <div className="min-h-[400px] rounded-lg border border-gray-200 bg-white shadow-sm dark:border-dark-bg-tertiary dark:bg-dark-bg-secondary md:min-h-[600px]">
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
    <DeviceProvider>
      <UserPreferencesProvider>
        <ThemeProvider>
          <OptionsPage />
        </ThemeProvider>
      </UserPreferencesProvider>
    </DeviceProvider>
  )
}

export default App
