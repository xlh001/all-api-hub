import { UsersIcon } from "@heroicons/react/24/outline"

export default function InfoPanel() {
  return (
    <div className="px-4 pb-4">
      <div className="bg-green-50 border border-green-100 rounded-lg p-3">
        <div className="flex">
          <div className="flex-shrink-0">
            <UsersIcon className="h-5 w-5 text-green-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-xs font-medium text-green-800">编辑账号信息</h3>
            <div className="mt-1 text-xs text-green-700">
              <p>修改账号信息后，系统会重新验证并获取最新的余额数据。</p>
              <p>
                如果站点信息有变化，建议点击"重新识别"按钮（需要在目标站点先自行登录）
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
