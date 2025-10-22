import { CpuChipIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import { Body, Heading2 } from "~/components/ui"

export function Header() {
  const { t } = useTranslation("modelList")
  return (
    <div className="mb-6">
      <div className="flex items-center space-x-3 mb-2">
        <CpuChipIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <Heading2>{t("title")}</Heading2>
      </div>
      <Body className="text-gray-500 dark:text-dark-text-secondary">
        {t("description")}
      </Body>
    </div>
  )
}
