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
  const { t } = useTranslation("keyManagement")

  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="text-gray-500 dark:text-dark-text-tertiary whitespace-nowrap flex-shrink-0">
        {t("keyDetails.key")}
      </span>
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <code className="bg-gray-100 dark:bg-dark-bg-tertiary px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-mono text-[10px] sm:text-xs text-gray-800 dark:text-dark-text-secondary truncate inline-block max-w-full align-middle">
          {formatKey(tokenKey, tokenId, visibleKeys)}
        </code>
        <button
          onClick={() => toggleKeyVisibility(tokenId)}
          className="p-1 sm:p-1.5 text-gray-400 dark:text-dark-text-tertiary hover:text-gray-600 dark:hover:text-dark-text-secondary flex-shrink-0 touch-manipulation tap-highlight-transparent hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary rounded transition-colors">
          {visibleKeys.has(tokenId) ? (
            <EyeSlashIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          ) : (
            <EyeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          )}
        </button>
      </div>
    </div>
  )
}
