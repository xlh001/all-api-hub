import { KeyIcon } from "@heroicons/react/24/outline"

export function Footer() {
  return (
    <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex items-start space-x-3">
        <KeyIcon className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="text-yellow-800 font-medium mb-1">密钥管理说明</p>
          <p className="text-yellow-700">
            此页面显示所有账号的API密钥信息，包括使用情况和过期时间。
            可以通过右上角的"添加密钥"按钮或点击各密钥项目旁的"+"按钮为指定账号创建新密钥。
            请妥善保管您的API密钥，避免泄露给他人。
          </p>
        </div>
      </div>
    </div>
  )
}
