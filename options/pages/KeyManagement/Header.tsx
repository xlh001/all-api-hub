import { KeyIcon, PlusIcon } from "@heroicons/react/24/outline"

interface HeaderProps {
  onAddToken: () => void
  onRefresh: () => void
  isLoading: boolean
  isAddTokenDisabled: boolean
}

export function Header({
  onAddToken,
  onRefresh,
  isLoading,
  isAddTokenDisabled
}: HeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <KeyIcon className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-semibold text-gray-900">密钥管理</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onAddToken}
            disabled={isAddTokenDisabled}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2">
            <PlusIcon className="w-4 h-4" />
            <span>添加密钥</span>
          </button>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50">
            {isLoading ? "刷新中..." : "刷新列表"}
          </button>
        </div>
      </div>
      <p className="text-gray-500">选择账号后查看和管理该账号的API密钥</p>
    </div>
  )
}