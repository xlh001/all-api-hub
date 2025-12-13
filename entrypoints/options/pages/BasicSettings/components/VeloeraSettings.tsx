import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { SettingSection } from "~/components/SettingSection"
import { Card, CardItem, CardList, IconButton, Input } from "~/components/ui"
import { useUserPreferencesContext } from "~/contexts/UserPreferencesContext"
import { showUpdateToast } from "~/utils/toastHelpers"

/**
 * Settings panel for configuring Veloera connection credentials (base URL, admin token, user ID).
 * @returns Section containing inputs and reset handling for the Veloera config.
 */
export default function VeloeraSettings() {
  const { t } = useTranslation("settings")
  const {
    veloeraBaseUrl,
    veloeraAdminToken,
    veloeraUserId,
    updateVeloeraBaseUrl,
    updateVeloeraAdminToken,
    updateVeloeraUserId,
    resetVeloeraConfig,
  } = useUserPreferencesContext()

  const [localBaseUrl, setLocalBaseUrl] = useState(veloeraBaseUrl)
  const [localAdminToken, setLocalAdminToken] = useState(veloeraAdminToken)
  const [showAdminToken, setShowAdminToken] = useState(false)
  const [localUserId, setLocalUserId] = useState(veloeraUserId)

  useEffect(() => {
    setLocalBaseUrl(veloeraBaseUrl)
  }, [veloeraBaseUrl])

  useEffect(() => {
    setLocalAdminToken(veloeraAdminToken)
  }, [veloeraAdminToken])

  useEffect(() => {
    setLocalUserId(veloeraUserId)
  }, [veloeraUserId])

  const handleVeloeraBaseUrlChange = async (url: string) => {
    if (url === veloeraBaseUrl) return
    const success = await updateVeloeraBaseUrl(url)
    showUpdateToast(success, "Veloera Base URL")
  }

  const handleVeloeraAdminTokenChange = async (token: string) => {
    if (token === veloeraAdminToken) return
    const success = await updateVeloeraAdminToken(token)
    showUpdateToast(success, "Admin Token")
  }

  const handleVeloeraUserIdChange = async (id: string) => {
    if (id === veloeraUserId) return
    const success = await updateVeloeraUserId(id)
    showUpdateToast(success, "User ID")
  }

  return (
    <SettingSection
      id="veloera"
      title={t("veloera.title")}
      description={t("veloera.description")}
      onReset={resetVeloeraConfig}
    >
      <Card padding="none">
        <CardList>
          <CardItem
            title={"Veloera Base URL"}
            description={t("veloera.urlDesc")}
            rightContent={
              <Input
                type="text"
                value={localBaseUrl}
                onChange={(e) => setLocalBaseUrl(e.target.value)}
                onBlur={(e) => handleVeloeraBaseUrlChange(e.target.value)}
                placeholder="https://api.example.com"
              />
            }
          />

          <CardItem
            title={"Admin Token"}
            description={t("veloera.tokenDesc")}
            rightContent={
              <div className="relative">
                <Input
                  type={showAdminToken ? "text" : "password"}
                  value={localAdminToken}
                  onChange={(e) => setLocalAdminToken(e.target.value)}
                  onBlur={(e) => handleVeloeraAdminTokenChange(e.target.value)}
                  rightIcon={
                    <IconButton
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAdminToken(!showAdminToken)}
                      aria-label={
                        showAdminToken ? "Hide password" : "Show password"
                      }
                    >
                      {showAdminToken ? (
                        <EyeSlashIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </IconButton>
                  }
                />
              </div>
            }
          />

          <CardItem
            title={"User ID"}
            description={t("veloera.userIdDesc")}
            rightContent={
              <Input
                type="text"
                value={localUserId}
                onChange={(e) => setLocalUserId(e.target.value)}
                onBlur={(e) => handleVeloeraUserIdChange(e.target.value)}
              />
            }
          />
        </CardList>
      </Card>
    </SettingSection>
  )
}
