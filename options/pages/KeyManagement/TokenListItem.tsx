import {
  DocumentDuplicateIcon,
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
  TrashIcon
} from "@heroicons/react/24/outline"

import { CherryIcon } from "~/components/icons/CherryIcon"
import type { ApiToken, DisplaySiteData } from "~/types"
import { OpenInCherryStudio } from "~/utils/cherryStudio"

import { formatKey, formatQuota, formatTime } from "./utils"

interface TokenListItemProps {
  token: ApiToken & { accountName: string }
  visibleKeys: Set<number>
  toggleKeyVisibility: (id: number) => void
  copyKey: (key: string, name: string) => void
  handleEditToken: (token: ApiToken & { accountName: string }) => void
  handleDeleteToken: (token: ApiToken & { accountName: string }) => void
  account: DisplaySiteData | undefined
}

export function TokenListItem({
  token,
  visibleKeys,
  toggleKeyVisibility,
  copyKey,
  handleEditToken,
  handleDeleteToken,
  account
}: TokenListItemProps) {
  return (
    <div className="flex flex-col space-y-2 border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
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
      </div>
      <div className="flex-1">
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">密钥:</span>
              <code className="bg-gray-100 px-2 py-1 rounded font-mono text-xs">
                {formatKey(token.key, token.id, visibleKeys)}
              </code>
              <button
                onClick={() => toggleKeyVisibility(token.id)}
                className="p-1 text-gray-400 hover:text-gray-600">
                {visibleKeys.has(token.id) ? (
                  <EyeSlashIcon className="w-4 h-4" />
                ) : (
                  <EyeIcon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-gray-500">剩余额度:</span>
              <span className="ml-2 font-medium">
                {formatQuota(token.remain_quota, token.unlimited_quota)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">已用额度:</span>
              <span className="ml-2 font-medium">
                {formatQuota(token.used_quota, false)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">过期时间:</span>
              <span className="ml-2 font-medium">
                {formatTime(token.expired_time)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">创建时间:</span>
              <span className="ml-2 font-medium">
                {formatTime(token.created_time)}
              </span>
            </div>
          </div>

          {token.group && (
            <div>
              <span className="text-gray-500">分组:</span>
              <span className="ml-2 font-medium">{token.group}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
