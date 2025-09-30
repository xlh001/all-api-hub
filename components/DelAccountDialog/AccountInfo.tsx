import type { FC } from "react"

import type { DisplaySiteData } from "../../types"

const AccountInfoDetail: FC<{
  label: string
  value: string
  isUrl?: boolean
}> = ({ label, value, isUrl }) => (
  <div className="flex items-center justify-between">
    <span className="text-gray-500">{label}：</span>
    {isUrl ? (
      <span
        className="truncate ml-2 max-w-48 font-medium text-gray-900"
        title={value}>
        {value}
      </span>
    ) : (
      <span className="font-medium text-gray-900">{value}</span>
    )}
  </div>
)

export const AccountInfo: FC<{ account: DisplaySiteData }> = ({ account }) => (
  <div className="mb-4 space-y-1 rounded-lg bg-gray-50 p-3 text-sm">
    <AccountInfoDetail label="站点名称" value={account.name} />
    <AccountInfoDetail label="用户名" value={account.username} />
    <AccountInfoDetail label="站点地址" value={account.baseUrl} isUrl />
  </div>
)
