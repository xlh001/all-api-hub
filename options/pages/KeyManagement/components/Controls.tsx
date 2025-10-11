import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"

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
  return (
    <div className="mb-6 space-y-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          选择账号
        </label>
        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="w-full sm:w-80 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">请选择账号</option>
          {displayData.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索密钥名称..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={!selectedAccount}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-ray-100 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {selectedAccount && (
        <div className="flex items-center space-x-6 text-sm text-gray-500">
          <span>总计 {tokens.length} 个密钥</span>
          <span>
            启用 {tokens.filter((t: any) => t.status === 1).length} 个
          </span>
          <span>显示 {filteredTokens.length} 个</span>
        </div>
      )}
    </div>
  )
}
