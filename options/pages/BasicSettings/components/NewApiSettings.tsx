import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import React, { useEffect, useState } from "react"

import { useUserPreferencesContext } from "~/contexts/UserPreferencesContext"

import { showUpdateToast } from "../utils/toastHelpers"

export default function NewApiSettings() {
  const {
    newApiBaseUrl,
    newApiAdminToken,
    newApiUserId,
    updateNewApiBaseUrl,
    updateNewApiAdminToken,
    updateNewApiUserId
  } = useUserPreferencesContext()

  const [localBaseUrl, setLocalBaseUrl] = useState(newApiBaseUrl ?? "")
  const [localAdminToken, setLocalAdminToken] = useState(newApiAdminToken ?? "")
  const [showAdminToken, setShowAdminToken] = useState(false)
  const [localUserId, setLocalUserId] = useState(newApiUserId ?? "")

  useEffect(() => {
    setLocalBaseUrl(newApiBaseUrl ?? "")
  }, [newApiBaseUrl])

  useEffect(() => {
    setLocalAdminToken(newApiAdminToken ?? "")
  }, [newApiAdminToken])

  useEffect(() => {
    setLocalUserId(newApiUserId ?? "")
  }, [newApiUserId])

  const handleNewApiBaseUrlChange = async (url: string) => {
    if (url === newApiBaseUrl) return
    const success = await updateNewApiBaseUrl(url)
    showUpdateToast(success, "New API Base URL")
  }

  const handleNewApiAdminTokenChange = async (token: string) => {
    if (token === newApiAdminToken) return
    const success = await updateNewApiAdminToken(token)
    showUpdateToast(success, "Admin Token")
  }

  const handleNewApiUserIdChange = async (id: string) => {
    if (id === newApiUserId) return
    const success = await updateNewApiUserId(id)
    showUpdateToast(success, "User ID")
  }

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
            onBlur={(e) => handleNewApiBaseUrlChange(e.target.value)}
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
          <div className="relative w-72">
            <input
              type={showAdminToken ? "text" : "password"}
              value={localAdminToken}
              onChange={(e) => setLocalAdminToken(e.target.value)}
              onBlur={(e) => handleNewApiAdminTokenChange(e.target.value)}
              className="w-full px-3 py-1.5 pr-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowAdminToken(!showAdminToken)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors">
              {showAdminToken ? (
                <EyeSlashIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
          </div>
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
            onBlur={(e) => handleNewApiUserIdChange(e.target.value)}
            className="w-72 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </section>
  )
}
