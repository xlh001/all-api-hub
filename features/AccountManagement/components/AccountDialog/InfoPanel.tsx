import { SparklesIcon, UsersIcon } from "@heroicons/react/24/outline"

interface InfoPanelProps {
  mode: "add" | "edit"
  isDetected?: boolean
  showManualForm?: boolean
}

export default function InfoPanel({
  mode,
  isDetected,
  showManualForm
}: InfoPanelProps) {
  const isAddMode = mode === "add"

  const getTitle = () => {
    if (isAddMode) {
      if (isDetected) return "账号信息确认"
      if (showManualForm) return "手动添加"
      return "自动识别"
    }
    return "编辑账号信息"
  }

  const getDescription = () => {
    if (isAddMode) {
      if (isDetected) return '请确认账号信息无误后点击"确认添加"按钮。'
      if (showManualForm)
        return "请手动填写账号信息。账号将被安全地保存在本地存储中。"
      return "请先在目标站点进行登录，插件将自动检测站点类型，并自动获取访问令牌。"
    }
    return (
      <>
        <p>修改账号信息后，系统会重新验证并获取最新的余额数据。</p>
        <p>
          如果站点信息有变化，建议点击"重新识别"按钮（需要在目标站点先自行登录）
        </p>
      </>
    )
  }

  const Icon = isAddMode ? SparklesIcon : UsersIcon
  const iconColor = isAddMode ? "text-blue-400" : "text-green-400"
  const bgColor = isAddMode
    ? "bg-blue-50 dark:bg-blue-900/20"
    : "bg-green-50 dark:bg-green-900/20"
  const borderColor = isAddMode
    ? "border-blue-100 dark:border-blue-900/30"
    : "border-green-100 dark:border-green-900/30"
  const titleColor = isAddMode
    ? "text-blue-800 dark:text-blue-300"
    : "text-green-800 dark:text-green-300"
  const textColor = isAddMode
    ? "text-blue-700 dark:text-blue-400"
    : "text-green-700 dark:text-green-400"

  return (
    <div className="px-4 pb-4">
      <div className={`${bgColor} border ${borderColor} rounded-lg p-3`}>
        <div className="flex">
          <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <div className="ml-3">
            <h3 className={`text-xs font-medium ${titleColor}`}>
              {getTitle()}
            </h3>
            <div className={`mt-1 text-xs ${textColor}`}>
              {typeof getDescription() === "string" ? (
                <p>{getDescription()}</p>
              ) : (
                getDescription()
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
