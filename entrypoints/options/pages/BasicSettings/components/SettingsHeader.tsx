import { CogIcon } from "@heroicons/react/24/outline"

export default function SettingsHeader() {
  return (
    <div className="mb-8">
      <div className="flex items-center space-x-3 mb-2">
        <CogIcon className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-dark-text-primary">
          基本设置
        </h1>
      </div>
      <p className="text-gray-500 dark:text-dark-text-secondary">
        管理插件的基本配置选项
      </p>
    </div>
  )
}
