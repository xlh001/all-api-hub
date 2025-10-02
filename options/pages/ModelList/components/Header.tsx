import { CpuChipIcon } from "@heroicons/react/24/outline"

export function Header() {
  return (
    <div className="mb-6">
      <div className="flex items-center space-x-3 mb-2">
        <CpuChipIcon className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-semibold text-gray-900">模型列表</h1>
      </div>
      <p className="text-gray-500">查看和管理可用的AI模型</p>
    </div>
  )
}