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

import { showSettingsToast } from "../../../BasicSettings/utils/toastHelpers.ts"
import { AccountToken } from "../../type.ts"

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
  const { t } = useTranslation()
  const [isImporting, setIsImporting] = useState(false)

  const handleImportToNewApi = async () => {
    setIsImporting(true)
    try {
      const ImportResult = await importToNewApi(account, token)
      showSettingsToast(ImportResult)
    } catch (error) {
      toast.error(
        t("toast.error.importFailed", { error: getErrorMessage(error) })
      )
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="flex items-center space-x-2 ml-4">
      <button
        onClick={() => copyKey(token.key, token.name)}
        className="p-2 text-gray-400 dark:text-dark-text-tertiary hover:text-gray-600 dark:hover:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary rounded-lg transition-colors"
        title={t("keyManagement.copyKey")}>
        <DocumentDuplicateIcon className="w-4 h-4" />
      </button>
      <button
        onClick={() => OpenInCherryStudio(account, token)}
        className="p-2 text-purple-400 dark:text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
        title={t("keyManagement.useInCherry")}>
        <CherryIcon className="w-4 h-4" />
      </button>
      <button
        onClick={handleImportToNewApi}
        disabled={isImporting}
        className="p-2 text-blue-400 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title={t("keyManagement.importToNewApi")}>
        <NewAPI.Color className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleEditToken(token)}
        className="p-2 text-blue-400 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
        title={t("keyManagement.editKey")}>
        <PencilIcon className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleDeleteToken(token)}
        className="p-2 text-red-400 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        title={t("keyManagement.deleteKey")}>
        <TrashIcon className="w-4 h-4" />
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
  const { t } = useTranslation()
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-3 mb-2">
        <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary truncate">
          {token.name}
        </h3>
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            token.status === 1
              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
              : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
          }`}>
          {token.status === 1
            ? t("keyManagement.enable")
            : t("keyManagement.disable")}
        </span>
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
          {token.accountName}
        </span>
      </div>
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
