import { useTranslation } from "react-i18next"

import { Alert } from "~/components/ui"

export function WarningNote() {
  const { t } = useTranslation("keyManagement")

  return (
    <Alert variant="warning">
      <div>
        <p className="font-medium mb-1">{t("dialog.warningTitle")}</p>
        <ul className="text-xs space-y-1">
          <li>• {t("dialog.warningText")}</li>
        </ul>
      </div>
    </Alert>
  )
}
