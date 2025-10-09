import {
  DocumentDuplicateIcon,
  PencilIcon,
  TrashIcon
} from "@heroicons/react/24/outline"

import { CherryIcon } from "~/components/icons/CherryIcon"
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
  return (
    <div className="flex items-center space-x-2 ml-4">
      <button
        onClick={() => copyKey(token.key, token.name)}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        title="复制密钥">
        <DocumentDuplicateIcon className="w-4 h-4" />
      </button>
      <button
        onClick={() => OpenInCherryStudio(account, token)}
        className="p-2 text-purple-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
        title="在Cherry Studio中使用">
        <CherryIcon className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleEditToken(token)}
        className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title="编辑密钥">
        <PencilIcon className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleDeleteToken(token)}
        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        <h3 className="text-lg font-medium text-gray-900 truncate">
          {token.name}
        </h3>
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            token.status === 1
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}>
          {token.status === 1 ? "启用" : "禁用"}
        </span>
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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
