import { SparklesIcon } from "@heroicons/react/24/outline"

interface InfoPanelProps {
  isDetected: boolean
  showManualForm: boolean
}

export default function InfoPanel({
  isDetected,
  showManualForm
}: InfoPanelProps) {
  const getTitle = () => {
    if (isDetected) return "账号信息确认"
    if (showManualForm) return "手动添加"
    return "自动识别"
  }

  const getDescription = () => {
    if (isDetected) return '请确认账号信息无误后点击"确认添加"按钮。'
    if (showManualForm)
      return "请手动填写账号信息。账号将被安全地保存在本地存储中。"
    return "请先在目标站点进行登录，插件将自动检测站点类型，并自动获取访问令牌。"
  }

  return (
    <div className="px-4 pb-4">
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
        <div className="flex">
          <div className="flex-shrink-0">
            <SparklesIcon className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-xs font-medium text-blue-800">{getTitle()}</h3>
            <div className="mt-1 text-xs text-blue-700">
              <p>{getDescription()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
