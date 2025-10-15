import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import { formatKey } from "../../utils"

interface KeyDisplayProps {
  tokenKey: string
  tokenId: number
  visibleKeys: Set<number>
  toggleKeyVisibility: (id: number) => void
}

export function KeyDisplay({
  tokenKey,
  tokenId,
  visibleKeys,
  toggleKeyVisibility
}: KeyDisplayProps) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <span className="text-gray-500 dark:text-dark-text-tertiary">
          {t("keyManagement.key")}
        </span>
        <code className="bg-gray-100 dark:bg-dark-bg-tertiary px-2 py-1 rounded font-mono text-xs text-gray-800 dark:text-dark-text-secondary">
          {formatKey(tokenKey, tokenId, visibleKeys)}
        </code>
        <button
          onClick={() => toggleKeyVisibility(tokenId)}
          className="p-1 text-gray-400 dark:text-dark-text-tertiary hover:text-gray-600 dark:hover:text-dark-text-secondary">
          {visibleKeys.has(tokenId) ? (
            <EyeSlashIcon className="w-4 h-4" />
          ) : (
            <EyeIcon className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  )
}
