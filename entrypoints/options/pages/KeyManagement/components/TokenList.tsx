import { KeyIcon, PlusIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import type { DisplaySiteData } from "~/types"

import { AccountToken } from "../type.ts"
import { TokenListItem } from "./TokenListItem"

interface TokenListProps {
  isLoading: boolean
  tokens: AccountToken[]
  filteredTokens: AccountToken[]
  visibleKeys: Set<number>
  toggleKeyVisibility: (id: number) => void
  copyKey: (key: string, name: string) => void
  handleEditToken: (token: AccountToken) => void
  handleDeleteToken: (token: AccountToken) => void
  handleAddToken: () => void
  selectedAccount: string
  displayData: DisplaySiteData[]
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="border border-gray-200 dark:border-dark-bg-tertiary rounded-lg p-4 animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-dark-bg-tertiary rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-dark-bg-tertiary rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-dark-bg-tertiary rounded w-3/4"></div>
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
  const { t } = useTranslation("keyManagement")

  return (
    <div className="text-center py-12">
      <KeyIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
      <p className="text-gray-500 dark:text-dark-text-secondary mb-4">
        {tokens.length === 0
          ? t("keyManagement.noKeys")
          : t("keyManagement.noMatchingKeys")}
      </p>
      {displayData.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-dark-text-tertiary">
          {t("keyManagement.pleaseAddAccount")}
        </p>
      ) : tokens.length === 0 ? (
        <button
          onClick={handleAddToken}
          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg-primary transition-colors flex items-center space-x-2 mx-auto">
          <PlusIcon className="w-4 h-4" />
          <span>{t("createFirstKey")}</span>
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
  const { t } = useTranslation("keyManagement")

  if (!selectedAccount) {
    return (
      <div className="text-center py-12">
        <KeyIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-dark-text-secondary mb-4">
          {t("noKeys")}
        </p>
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
          account={
            displayData.find(
              (account) => account.name === token.accountName
            ) as DisplaySiteData
          }
        />
      ))}
    </div>
  )
}
