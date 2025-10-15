import {
  ExclamationTriangleIcon,
  GlobeAltIcon,
  InformationCircleIcon,
  PencilIcon,
  XCircleIcon
} from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import Tooltip from "~/components/Tooltip"
import { AuthTypeEnum, type DisplaySiteData } from "~/types"

interface SiteInfoInputProps {
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

export default function SiteInfoInput({
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
}: SiteInfoInputProps) {
  const { t } = useTranslation()

  const handleEditClick = () => {
    if (detectedAccount && onEditAccount) {
      onEditAccount(detectedAccount)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label
          htmlFor="site-url"
          className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
          {t("accountDialog.siteInfo.siteUrl")}
        </label>
        <label
          htmlFor="auth-type"
          className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
          {t("accountDialog.siteInfo.authMethod")}
        </label>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative flex-grow">
          <input
            id="site-url"
            type="text"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="https://example.com"
            className="block w-full pr-10 py-3 border border-gray-200 dark:border-dark-bg-tertiary rounded-lg text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 dark:disabled:bg-dark-bg-tertiary bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text-primary"
            disabled={isDetected}
          />
          {url && !isDetected && (
            <button
              type="button"
              onClick={onClearUrl}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-60 dark:hover:text-gray-300">
              <XCircleIcon className="h-5 w-5" />
            </button>
          )}
        </div>
        <Tooltip content={t("accountDialog.siteInfo.cookieWarning")}>
          <select
            id="auth-type"
            value={authType}
            onChange={(e) => onAuthTypeChange(e.target.value as AuthTypeEnum)}
            className="block py-3 border border-gray-200 dark:border-dark-bg-tertiary rounded-lg text-sm placeholder-gray-400 dark:placeholder-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text-primary"
            disabled={isDetected}>
            <option value={AuthTypeEnum.AccessToken}>Access Token</option>
            <option value={AuthTypeEnum.Cookie}>Cookie</option>
          </select>
        </Tooltip>
      </div>
      <div className="flex flex-col gap-y-2 justify-between text-xs">
        {isCurrentSiteAdded && handleEditClick && (
          <div className="w-full flex items-center justify-between text-xs text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-md">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
              <span>{t("accountDialog.siteInfo.alreadyAdded")}</span>
            </div>
            <button
              type="button"
              onClick={handleEditClick}
              className="flex items-center font-medium text-yellow-800 dark:text-yellow-200 hover:text-yellow-900 dark:hover:text-yellow-100">
              <PencilIcon className="w-3 h-3 mr-1" />
              <span>{t("accountDialog.siteInfo.editNow")}</span>
            </button>
          </div>
        )}
        {!isDetected && onUseCurrentTab && (
          <div className="w-full flex items-center justify-between text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md">
            <div className="flex items-center">
              <InformationCircleIcon className="h-4 w-4" />
              <span className="ml-1">
                {t("accountDialog.siteInfo.currentSite")}:
              </span>
              <Tooltip content={currentTabUrl}>
                <span className="font-medium max-w-[150px] truncate ml-1">
                  {currentTabUrl ||
                    t("accountList.site_info.unknown", "无法获取")}
                </span>
              </Tooltip>
            </div>

            <button
              type="button"
              onClick={onUseCurrentTab}
              className="flex items-center font-medium text-blue-800 dark:text-blue-200 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed"
              disabled={!currentTabUrl}>
              <GlobeAltIcon className="w-3 h-3 mr-1" />
              <span>{t("accountDialog.siteInfo.useCurrent")}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
