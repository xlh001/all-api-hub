import { KeyIcon, PlusIcon } from "@heroicons/react/24/outline"

import type { ApiToken } from "~/types"

import { TokenListItem } from "./TokenListItem"

interface TokenListProps {
  isLoading: boolean
  tokens: (ApiToken & { accountName: string })[]
  filteredTokens: (ApiToken & { accountName: string })[]
  visibleKeys: Set<number>
  toggleKeyVisibility: (id: number) => void
  copyKey: (key: string, name: string) => void
  handleEditToken: (token: ApiToken & { accountName: string }) => void
  handleDeleteToken: (token: ApiToken & { accountName: string }) => void
  handleAddToken: () => void
  selectedAccount: string
  displayData: { id: string }[]
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="border border-gray-200 rounded-lg p-4 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({
  tokens,
  handleAddToken,
  displayData
}: {
  tokens: unknown[]
  handleAddToken: () => void
  displayData: { id: string }[]
}) {
  return (
    <div className="text-center py-12">
      <KeyIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500 mb-4">
        {tokens.length === 0 ? "暂无密钥数据" : "没有找到匹配的密钥"}
      </p>
      {displayData.length === 0 ? (
        <p className="text-sm text-gray-400">请先添加账号</p>
      ) : tokens.length === 0 ? (
        <button
          onClick={handleAddToken}
          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center space-x-2 mx-auto">
          <PlusIcon className="w-4 h-4" />
          <span>创建第一个密钥</span>
        </button>
      ) : null}
    </div>
  )
}

export function TokenList({
  isLoading,
  tokens,
  filteredTokens,
  visibleKeys,
  toggleKeyVisibility,
  copyKey,
  handleEditToken,
  handleDeleteToken,
  handleAddToken,
  selectedAccount,
  displayData
}: TokenListProps) {
  if (!selectedAccount) {
    return (
      <div className="text-center py-12">
        <KeyIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">请先选择一个账号查看密钥列表</p>
      </div>
    )
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (filteredTokens.length === 0) {
    return (
      <EmptyState
        tokens={tokens}
        handleAddToken={handleAddToken}
        displayData={displayData}
      />
    )
  }

  return (
    <div className="space-y-3">
      {filteredTokens.map((token) => (
        <TokenListItem
          key={`${token.accountName}-${token.id}`}
          token={token}
          visibleKeys={visibleKeys}
          toggleKeyVisibility={toggleKeyVisibility}
          copyKey={copyKey}
          handleEditToken={handleEditToken}
          handleDeleteToken={handleDeleteToken}
        />
      ))}
    </div>
  )
}