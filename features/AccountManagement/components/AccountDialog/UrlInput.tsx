import {
  ExclamationTriangleIcon,
  GlobeAltIcon,
  InformationCircleIcon,
  PencilIcon,
  XCircleIcon
} from "@heroicons/react/24/outline"

import Tooltip from "~/components/Tooltip"
import { AuthTypeEnum, type DisplaySiteData } from "~/types"

interface UrlInputProps {
  url: string
  onUrlChange: (url: string) => void
  isDetected: boolean
  onClearUrl: () => void
  authType: AuthTypeEnum
  onAuthTypeChange: (authType: AuthTypeEnum) => void
  // Props for "add" mode
  currentTabUrl?: string | null
  isCurrentSiteAdded?: boolean
  detectedAccount?: DisplaySiteData | null
  onUseCurrentTab?: () => void
  onEditAccount?: (account: DisplaySiteData) => void
}

export default function UrlInput({
  url,
  onUrlChange,
  isDetected,
  onClearUrl,
  authType,
  onAuthTypeChange,
  currentTabUrl,
  isCurrentSiteAdded,
  detectedAccount,
  onUseCurrentTab,
  onEditAccount
}: UrlInputProps) {
  const handleEditClick = () => {
    if (detectedAccount && onEditAccount) {
      onEditAccount(detectedAccount)
    }
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor="site-url"
        className="block text-sm font-medium text-gray-700">
        网站 URL
      </label>
      <div className="flex items-center gap-2">
        <div className="relative flex-grow">
          <input
            id="site-url"
            type="text"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="https://example.com"
            className="block w-full pr-10 py-3 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100"
            disabled={isDetected}
          />
          {url && !isDetected && (
            <button
              type="button"
              onClick={onClearUrl}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
              <XCircleIcon className="h-5 w-5" />
            </button>
          )}
        </div>
        <Tooltip content="Cookie 认证使用您的当前登录账号，无法站点多账号，非必要请勿使用">
          <select
            value={authType}
            onChange={(e) => onAuthTypeChange(e.target.value as AuthTypeEnum)}
            className="block py-3 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            disabled={isDetected}>
            <option value={AuthTypeEnum.AccessToken}>Access Token</option>
            <option value={AuthTypeEnum.Cookie}>Cookie</option>
          </select>
        </Tooltip>
      </div>
      <div className="flex flex-col gap-y-2 justify-between text-xs">
        {isCurrentSiteAdded && handleEditClick && (
          <div className="w-full flex items-center justify-between text-xs text-yellow-700 bg-yellow-50 p-2 rounded-md">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
              <span>当前站点已添加</span>
            </div>
            <button
              type="button"
              onClick={handleEditClick}
              className="flex items-center font-medium text-yellow-800 hover:text-yellow-900">
              <PencilIcon className="w-3 h-3 mr-1" />
              <span>立即编辑</span>
            </button>
          </div>
        )}
        {!isDetected && onUseCurrentTab && (
          <div className="w-full flex items-center justify-between text-xs text-blue-700 bg-blue-50 p-2 rounded-md">
            <div className="flex items-center">
              <InformationCircleIcon className="h-4 w-4" />
              <span className="ml-1">当前站点:</span>
              <Tooltip content={currentTabUrl}>
                <span className="font-medium max-w-[150px] truncate ml-1">
                  {currentTabUrl || "无法获取"}
                </span>
              </Tooltip>
            </div>

            <button
              type="button"
              onClick={onUseCurrentTab}
              className="flex items-center font-medium text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
              disabled={!currentTabUrl}>
              <GlobeAltIcon className="w-3 h-3 mr-1" />
              <span>使用当前站点</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
