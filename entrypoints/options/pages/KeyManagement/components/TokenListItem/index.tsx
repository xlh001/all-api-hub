import type { DisplaySiteData } from "~/types"

import { AccountToken } from "../../type.ts"
import { KeyDisplay } from "./KeyDisplay"
import { TokenDetails } from "./TokenDetails"
import { TokenHeader } from "./TokenHeader"

interface TokenListItemProps {
  token: AccountToken
  visibleKeys: Set<number>
  toggleKeyVisibility: (id: number) => void
  copyKey: (key: string, name: string) => void
  handleEditToken: (token: AccountToken) => void
  handleDeleteToken: (token: AccountToken) => void
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
    <div className="flex flex-col space-y-2 border border-gray-200 dark:border-dark-bg-tertiary rounded-lg p-4 hover:border-gray-300 dark:hover:border-blue-500/50 bg-white dark:bg-dark-bg-secondary transition-all duration-200 shadow-sm hover:shadow-md">
      <TokenHeader
        token={token}
        copyKey={copyKey}
        handleEditToken={handleEditToken}
        handleDeleteToken={handleDeleteToken}
        account={account}
      />
      <div className="flex-1">
        <div className="space-y-2 text-sm text-gray-600 dark:text-dark-text-secondary">
          <KeyDisplay
            tokenKey={token.key}
            tokenId={token.id}
            visibleKeys={visibleKeys}
            toggleKeyVisibility={toggleKeyVisibility}
          />
          <TokenDetails token={token} />
          {token.group && (
            <div>
              <span className="text-gray-500 dark:text-dark-text-tertiary">
                分组:
              </span>
              <span className="ml-2 font-medium text-gray-900 dark:text-dark-text-primary">
                {token.group}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
