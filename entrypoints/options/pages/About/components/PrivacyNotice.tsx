import { useTranslation } from "react-i18next"

import { Alert } from "~/components/ui"

const PrivacyNotice = () => {
  const { t } = useTranslation("about")
  return (
    <Alert variant="success">
      <div>
        <p className="font-medium mb-1">{t("privacyTitle")}</p>
        <p className="text-sm">{t("privacyText")}</p>
      </div>
    </Alert>
  )
}

export default PrivacyNotice
