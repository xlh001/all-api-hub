import { UserIcon } from "@heroicons/react/24/outline"
import { Toaster } from "react-hot-toast"

import AccountList from "~/features/AccountManagement/components/AccountList"
import { AccountManagementProvider } from "~/features/AccountManagement/hooks/AccountManagementProvider"

function AccountManagement() {
  return (
    <div className="p-6 bg-white flex flex-col">
      {/* 页面标题 */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <UserIcon className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-semibold text-gray-900">账户管理</h1>
        </div>
        <p className="text-gray-500">查看和管理站点账户</p>
      </div>
      <AccountManagementProvider>
        <div className={`bg-white flex flex-col`}>
          <AccountList />
        </div>
      </AccountManagementProvider>
    </div>
  )
}

export default AccountManagement
