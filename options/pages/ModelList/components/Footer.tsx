import { CpuChipIcon } from "@heroicons/react/24/outline"

export function Footer() {
  return (
    <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-start space-x-3">
        <CpuChipIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="text-blue-800 font-medium mb-1">模型定价说明</p>
          <p className="text-blue-700">
            价格信息来源于站点提供的 API 接口，实际费用以各站点公布的价格为准。
            按量计费模型的价格为每 1M tokens
            的费用，按次计费模型显示每次调用的费用。
          </p>
        </div>
      </div>
    </div>
  )
}
