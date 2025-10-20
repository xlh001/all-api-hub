import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import { UI_CONSTANTS } from "~/constants/ui"
import type { DisplaySiteData } from "~/types"

interface ControlsProps {
  selectedAccount: string
  setSelectedAccount: (value: string) => void
  searchTerm: string
  setSearchTerm: (value: string) => void
  displayData: DisplaySiteData[]
  tokens: unknown[]
  filteredTokens: unknown[]
}

export function Controls({
  selectedAccount,
  setSelectedAccount,
  searchTerm,
  setSearchTerm,
  displayData,
  tokens,
  filteredTokens
}: ControlsProps) {
  const { t } = useTranslation("keyManagement")

  return (
    <div className="mb-6 space-y-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-2">
          {t("selectAccount")}
        </label>
        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="w-full sm:w-80 px-3 py-2 border border-gray-300 dark:border-dark-bg-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text-primary disabled:bg-gray-100 dark:disabled:bg-dark-bg-tertiary disabled:cursor-not-allowed">
          <option value="">{t("pleaseSelectAccount")}</option>
          {displayData.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-dark-text-tertiary" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={!selectedAccount}
            className={UI_CONSTANTS.STYLES.INPUT.SEARCH}
          />
        </div>
      </div>

      {selectedAccount && (
        <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-dark-text-secondary">
          <span>{t("totalKeys", { count: tokens.length })}</span>
          <span>
            {t("enabledCount", {
              count: tokens.filter((t: any) => t.status === 1).length
            })}
          </span>
          <span>
            {t("showingCount", { count: filteredTokens.length })}
          </span>
        </div>
      )}
    </div>
  )
}
