import {
  ArrowPathIcon,
  ArrowsPointingOutIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/outline"
import { useCallback } from "react"
import toast from "react-hot-toast"

import { UI_CONSTANTS } from "~/constants/ui"
import { openFullManagerPage, openSettingsPage } from "~/utils/navigation"

import iconImage from "../../assets/icon.png"
import Tooltip from "../../components/Tooltip"
import { useAccountDataContext } from "~/options/pages/AccountManagement/hooks/AccountDataContext"

export default function HeaderSection() {
  const { isRefreshing, handleRefresh } = useAccountDataContext()

  const handleGlobalRefresh = useCallback(async () => {
    try {
      await toast.promise(handleRefresh(true), {
        loading: "正在刷新所有账号...",
        success: (result) => {
          if (result.failed > 0) {
            return `刷新完成: ${result.success} 成功, ${result.failed} 失败`
          }
          return "所有账号刷新成功！"
        },
        error: "刷新失败，请稍后重试"
      })
    } catch (error) {
      console.error("Error during global refresh:", error)
    }
  }, [handleRefresh])

  const handleOpenFullManagerPage = () => {
    openFullManagerPage()
  }

  const handleOpenSetting = () => {
    openSettingsPage()
  }

  return (
    <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-gray-100 flex-shrink-0">
      <div className="flex items-center space-x-3">
        <img
          src={iconImage}
          alt="All API Hub"
          className="w-7 h-7 rounded-lg shadow-sm"
        />
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">All API Hub</span>
          <span className="text-xs text-gray-500">一键管理所有AI中转站</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Tooltip content="刷新数据">
          <button
            onClick={handleGlobalRefresh}
            disabled={isRefreshing}
            className={`${UI_CONSTANTS.STYLES.BUTTON.ICON} ${isRefreshing ? "animate-spin" : ""}`}
            title="刷新数据">
            <ArrowPathIcon className="w-4 h-4" />
          </button>
        </Tooltip>
        <button
          onClick={handleOpenFullManagerPage}
          className={UI_CONSTANTS.STYLES.BUTTON.ICON}
          title="打开完整管理页面">
          <ArrowsPointingOutIcon className="w-4 h-4" />
        </button>
        <button
          onClick={handleOpenSetting}
          className={UI_CONSTANTS.STYLES.BUTTON.ICON}
          title="设置">
          <Cog6ToothIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
