import React, { useEffect, useState } from "react"

interface NewApiSettingsProps {
  newApiBaseUrl: string
  newApiAdminToken: string
  newApiUserId: string
  onBaseUrlChange: (value: string) => void
  onAdminTokenChange: (value: string) => void
  onUserIdChange: (value: string) => void
}

export default function NewApiSettings({
  newApiBaseUrl,
  newApiAdminToken,
  newApiUserId,
  onBaseUrlChange,
  onAdminTokenChange,
  onUserIdChange
}: NewApiSettingsProps) {
  const [localBaseUrl, setLocalBaseUrl] = useState(newApiBaseUrl)
  const [localAdminToken, setLocalAdminToken] = useState(newApiAdminToken)
  const [localUserId, setLocalUserId] = useState(newApiUserId)

  useEffect(() => {
    setLocalBaseUrl(newApiBaseUrl)
  }, [newApiBaseUrl])

  useEffect(() => {
    setLocalAdminToken(newApiAdminToken)
  }, [newApiAdminToken])

  useEffect(() => {
    setLocalUserId(newApiUserId)
  }, [newApiUserId])

  return (
    <section>
      <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        New API 集成设置
      </h2>
      <div className="space-y-6">
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              New API Base URL
            </h3>
            <p className="text-sm text-gray-500">
              设置用于 New API 集成的基础 URL
            </p>
          </div>
          <input
            type="text"
            value={localBaseUrl}
            onChange={(e) => setLocalBaseUrl(e.target.value)}
            onBlur={(e) => onBaseUrlChange(e.target.value)}
            placeholder="https://api.example.com"
            className="w-72 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Admin Token</h3>
            <p className="text-sm text-gray-500">
              用于访问 New API 管理员功能的令牌
            </p>
          </div>
          <input
            type="password"
            value={localAdminToken}
            onChange={(e) => setLocalAdminToken(e.target.value)}
            onBlur={(e) => onAdminTokenChange(e.target.value)}
            className="w-72 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-medium text-gray-900">User ID</h3>
            <p className="text-sm text-gray-500">用于 New API 的用户识别 ID</p>
          </div>
          <input
            type="text"
            value={localUserId}
            onChange={(e) => setLocalUserId(e.target.value)}
            onBlur={(e) => onUserIdChange(e.target.value)}
            className="w-72 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </section>
  )
}
