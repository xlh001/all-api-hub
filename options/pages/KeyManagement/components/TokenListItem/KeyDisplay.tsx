import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"

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
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <span className="text-gray-500">密钥:</span>
        <code className="bg-gray-100 px-2 py-1 rounded font-mono text-xs">
          {formatKey(tokenKey, tokenId, visibleKeys)}
        </code>
        <button
          onClick={() => toggleKeyVisibility(tokenId)}
          className="p-1 text-gray-400 hover:text-gray-600">
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
