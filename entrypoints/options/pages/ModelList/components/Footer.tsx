import { useTranslation } from "react-i18next"

import { Alert } from "~/components/ui"

export function Footer() {
  const { t } = useTranslation("modelList")
  return (
    <Alert variant="info" className="mt-8">
      <div>
        <h4 className="font-medium mb-1">{t("pricingNote")}</h4>
        <p className="text-sm">{t("pricingDescription")}</p>
      </div>
    </Alert>
  )
}
