import {
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon
} from "@heroicons/react/24/outline"

import type { AutoDetectErrorProps } from "~/utils/autoDetectUtils"
import { openLoginTab } from "~/utils/autoDetectUtils"

export default function AutoDetectErrorAlert({
  error,
  siteUrl,
  onHelpClick,
  onActionClick
}: AutoDetectErrorProps) {
  const handleActionClick = () => {
    if (onActionClick) {
      onActionClick()
    } else if (error.type === "unauthorized" && siteUrl) {
      // 默认行为：打开登录页面
      openLoginTab(siteUrl)
    }
  }

  const handleHelpClick = () => {
    if (onHelpClick) {
      onHelpClick()
    } else if (error.helpDocUrl) {
      // 默认行为：打开帮助文档
      chrome.tabs.create({ url: error.helpDocUrl })
    }
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-4 w-4 text-amber-400" />
        </div>
        <div className="ml-2 flex-1">
          <p className="text-xs text-amber-700">{error.message}</p>

          {/* 操作按钮区域 */}
          {(error.actionText || error.helpDocUrl) && (
            <div className="mt-2 flex space-x-2">
              {/* 主要操作按钮 */}
              {error.actionText && (
                <button
                  type="button"
                  onClick={handleActionClick}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium text-amber-800 bg-amber-100 border border-amber-300 rounded hover:bg-amber-200 transition-colors">
                  {error.actionText}
                </button>
              )}

              {/* 帮助文档按钮 */}
              {error.helpDocUrl && (
                <button
                  type="button"
                  onClick={handleHelpClick}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium text-amber-600 hover:text-amber-800 transition-colors">
                  <QuestionMarkCircleIcon className="w-3 h-3 mr-1" />
                  帮助文档
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
