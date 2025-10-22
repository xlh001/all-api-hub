import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { BodySmall, Heading4, Heading6, Input } from "~/components/ui"
import { useUserPreferencesContext } from "~/contexts/UserPreferencesContext"

import { showUpdateToast } from "../utils/toastHelpers"

export default function NewApiSettings() {
  const { t } = useTranslation("settings")
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
      <Heading4 className="mb-2 flex items-center">
        {t("newApi.title")}
      </Heading4>
      <BodySmall className="mb-4">
        {t("newApi.description", { defaultValue: "" })}
      </BodySmall>
      <div className="space-y-6">
        <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-dark-bg-tertiary">
          <div>
            <Heading6>New API Base URL</Heading6>
            <BodySmall>{t("newApi.urlDesc")}</BodySmall>
          </div>
          <Input
            type="text"
            value={localBaseUrl}
            onChange={(e) => setLocalBaseUrl(e.target.value)}
            onBlur={(e) => handleNewApiBaseUrlChange(e.target.value)}
            placeholder="https://api.example.com"
            className="w-72"
          />
        </div>

        <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-dark-bg-tertiary">
          <div>
            <Heading6>Admin Token</Heading6>
            <BodySmall>{t("newApi.tokenDesc")}</BodySmall>
          </div>
          <div className="relative w-72">
            <Input
              type={showAdminToken ? "text" : "password"}
              value={localAdminToken}
              onChange={(e) => setLocalAdminToken(e.target.value)}
              onBlur={(e) => handleNewApiAdminTokenChange(e.target.value)}
              className="w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setShowAdminToken(!showAdminToken)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-dark-text-secondary transition-colors">
              {showAdminToken ? (
                <EyeSlashIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-dark-bg-tertiary">
          <div>
            <Heading6>User ID</Heading6>
            <BodySmall>{t("newApi.userIdDesc")}</BodySmall>
          </div>
          <Input
            type="text"
            value={localUserId}
            onChange={(e) => setLocalUserId(e.target.value)}
            onBlur={(e) => handleNewApiUserIdChange(e.target.value)}
            className="w-72"
          />
        </div>
      </div>
    </section>
  )
}
