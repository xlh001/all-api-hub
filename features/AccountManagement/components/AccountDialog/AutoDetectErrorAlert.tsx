import {
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon
} from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import type { AutoDetectErrorProps } from "~/utils/autoDetectUtils"
import { openLoginTab } from "~/utils/autoDetectUtils"

export default function AutoDetectErrorAlert({
  error,
  siteUrl,
  onHelpClick,
  onActionClick
}: AutoDetectErrorProps) {
  const { t } = useTranslation("accountDialog")

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
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 rounded-lg p-3 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-4 w-4 text-amber-400" />
        </div>
        <div className="ml-2 flex-1">
          <p className="text-xs text-amber-700 dark:text-amber-300">
            {error.message}
          </p>

          {/* 操作按钮区域 */}
          {(error.actionText || error.helpDocUrl) && (
            <div className="mt-2 flex space-x-2">
              {/* 主要操作按钮 */}
              {error.actionText && (
                <button
                  type="button"
                  onClick={handleActionClick}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium text-amber-800 dark:text-amber-200 bg-amber-100 dark:bg-amber-900/50 border border-amber-300 dark:border-amber-800 rounded hover:bg-amber-200 dark:hover:bg-amber-900 transition-colors">
                  {error.actionText}
                </button>
              )}

              {/* 帮助文档按钮 */}
              {error.helpDocUrl && (
                <button
                  type="button"
                  onClick={handleHelpClick}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 transition-colors">
                  <QuestionMarkCircleIcon className="w-3 h-3 mr-1" />
                  {t("common:actions.helpDocument")}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
