import {
  DocumentDuplicateIcon,
  PencilIcon,
  TrashIcon
} from "@heroicons/react/24/outline"
import { NewAPI } from "@lobehub/icons"
import { useState } from "react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

import { CherryIcon } from "~/components/icons/CherryIcon"
import { importToNewApi } from "~/services/newApiService"
import type { DisplaySiteData } from "~/types"
import { OpenInCherryStudio } from "~/utils/cherryStudio"
import { getErrorMessage } from "~/utils/error"

import { showSettingsToast } from "../../../BasicSettings/utils/toastHelpers"
import { AccountToken } from "../../type"

interface TokenHeaderProps {
  token: AccountToken
  copyKey: (key: string, name: string) => void
  handleEditToken: (token: AccountToken) => void
  handleDeleteToken: (token: AccountToken) => void
  account: DisplaySiteData
}

function TokenActionButtons({
  token,
  copyKey,
  handleEditToken,
  handleDeleteToken,
  account
}: TokenHeaderProps) {
  const { t } = useTranslation("keyManagement")
  const [isImporting, setIsImporting] = useState(false)

  const handleImportToNewApi = async () => {
    setIsImporting(true)
    try {
      const ImportResult = await importToNewApi(account, token)
      showSettingsToast(ImportResult)
    } catch (error) {
      toast.error(
        t("messages:toast.error.importFailed", {
          error: getErrorMessage(error)
        })
      )
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
      <button
        onClick={() => copyKey(token.key, token.name)}
        className="p-1.5 sm:p-2 text-gray-400 dark:text-dark-text-tertiary hover:text-gray-600 dark:hover:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary rounded-lg transition-colors touch-manipulation tap-highlight-transparent"
        title={t("common:actions.copyKey")}>
        <DocumentDuplicateIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>
      <button
        onClick={() => OpenInCherryStudio(account, token)}
        className="p-1.5 sm:p-2 text-purple-400 dark:text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors touch-manipulation tap-highlight-transparent"
        title={t("actions.useInCherry")}>
        <CherryIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>
      <button
        onClick={handleImportToNewApi}
        disabled={isImporting}
        className="p-1.5 sm:p-2 text-blue-400 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation tap-highlight-transparent"
        title={t("actions.importToNewApi")}>
        <NewAPI.Color className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>
      <button
        onClick={() => handleEditToken(token)}
        className="p-1.5 sm:p-2 text-blue-400 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors touch-manipulation tap-highlight-transparent"
        title={t("actions.editKey")}>
        <PencilIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>
      <button
        onClick={() => handleDeleteToken(token)}
        className="p-1.5 sm:p-2 text-red-400 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors touch-manipulation tap-highlight-transparent"
        title={t("actions.deleteKey")}>
        <TrashIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>
    </div>
  )
}

export function TokenHeader({
  token,
  copyKey,
  handleEditToken,
  handleDeleteToken,
  account
}: TokenHeaderProps) {
  const { t } = useTranslation("keyManagement")
  return (
    <div className="flex items-start gap-2 min-w-0">
      {/* 左侧：标题和标签 - 可压缩 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
          <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-900 dark:text-dark-text-primary truncate">
            {token.name}
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span
            className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap ${
              token.status === 1
                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
            }`}>
            {token.status === 1 ? t("actions.enable") : t("actions.disable")}
          </span>
          <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 whitespace-nowrap">
            {token.accountName}
          </span>
        </div>
      </div>

      {/* 右侧：操作按钮 - 固定不压缩 */}
      <TokenActionButtons
        token={token}
        copyKey={copyKey}
        handleEditToken={handleEditToken}
        handleDeleteToken={handleDeleteToken}
        account={account}
      />
    </div>
  )
}
