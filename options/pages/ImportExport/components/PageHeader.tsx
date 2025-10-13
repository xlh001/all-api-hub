import { ArrowPathIcon } from "@heroicons/react/24/outline"

const PageHeader = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center space-x-3 mb-2">
        <ArrowPathIcon className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-dark-text-primary">
          导入/导出
        </h1>
      </div>
      <p className="text-gray-500 dark:text-dark-text-secondary">
        备份和恢复插件数据
      </p>
    </div>
  )
}

export default PageHeader
