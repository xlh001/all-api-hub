import {
  DocumentDuplicateIcon,
  PencilIcon,
  TrashIcon
} from "@heroicons/react/24/outline"
import { NewAPI } from "@lobehub/icons"
import { useState } from "react"
import toast from "react-hot-toast"

import { CherryIcon } from "~/components/icons/CherryIcon"
import { importToNewApi } from "~/services/newApiService"
import type { ApiToken, DisplaySiteData } from "~/types"
import { OpenInCherryStudio } from "~/utils/cherryStudio"

interface TokenHeaderProps {
  token: ApiToken & { accountName: string }
  copyKey: (key: string, name: string) => void
  handleEditToken: (token: ApiToken & { accountName: string }) => void
  handleDeleteToken: (token: ApiToken & { accountName: string }) => void
  account: DisplaySiteData | undefined
}

function TokenActionButtons({
  token,
  copyKey,
  handleEditToken,
  handleDeleteToken,
  account
}: TokenHeaderProps) {
  const [isImporting, setIsImporting] = useState(false)

  const handleImportToNewApi = async () => {
    setIsImporting(true)
    try {
      const ImportResult = await importToNewApi(account, token)
      if (ImportResult.success) {
        toast.success(ImportResult.message)
      } else {
        toast.error(ImportResult.message)
      }
    } catch (error) {
      toast.error(`导入失败: ${getErrorMessage(error)}`)
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="flex items-center space-x-2 ml-4">
      <button
        onClick={() => copyKey(token.key, token.name)}
        className="p-2 text-gray-400 dark:text-dark-text-tertiary hover:text-gray-600 dark:hover:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary rounded-lg transition-colors"
        title="复制密钥">
        <DocumentDuplicateIcon className="w-4 h-4" />
      </button>
      <button
        onClick={() => OpenInCherryStudio(account, token)}
        className="p-2 text-purple-400 dark:text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
        title="在Cherry Studio中使用">
        <CherryIcon className="w-4 h-4" />
      </button>
      <button
        onClick={handleImportToNewApi}
        disabled={isImporting}
        className="p-2 text-blue-400 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="导入到New API">
        <NewAPI.Color className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleEditToken(token)}
        className="p-2 text-blue-400 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
        title="编辑密钥">
        <PencilIcon className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleDeleteToken(token)}
        className="p-2 text-red-400 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        title="删除密钥">
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
          {token.status === 1 ? "启用" : "禁用"}
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
