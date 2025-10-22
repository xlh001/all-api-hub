import { useState } from "react"
import { useTranslation } from "react-i18next"

import {
  Alert,
  AlertDescription,
  AlertTitle,
  BodySmall,
  Button,
  Heading5
} from "~/components/ui"
import { useUserPreferencesContext } from "~/contexts/UserPreferencesContext"

import { showResetToast } from "../utils/toastHelpers"

export default function DangerousZone() {
  const { t } = useTranslation("settings")
  const { resetToDefaults } = useUserPreferencesContext()
  const [isResetting, setIsResetting] = useState(false)

  const handleResetToDefaults = async () => {
    setIsResetting(true)
    const success = await resetToDefaults()
    showResetToast(success)
    setIsResetting(false)
  }

  return (
    <section>
      <Heading5
        className={`text-lg font-medium text-red-600 dark:text-red-400 mb-4`}>
        {t("danger.title")}
      </Heading5>
      <Alert variant="destructive" className="p-4">
        <AlertTitle>{t("danger.resetAllSettings")}</AlertTitle>
        <AlertDescription>
          <BodySmall>{t("danger.resetDesc")}</BodySmall>
        </AlertDescription>
        <div className="mt-3 flex justify-end">
          <Button
            onClick={handleResetToDefaults}
            disabled={isResetting}
            variant="destructive"
            size="sm"
            loading={isResetting}>
            {isResetting
              ? t("common:status.resetting")
              : t("danger.resetSettings")}
          </Button>
        </div>
      </Alert>
    </section>
  )
}
