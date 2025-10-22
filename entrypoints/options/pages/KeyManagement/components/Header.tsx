import { KeyIcon, PlusIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import { BodySmall, Button, Heading2 } from "~/components/ui"

interface HeaderProps {
  onAddToken: () => void
  onRefresh: () => void
  isLoading: boolean
  isAddTokenDisabled: boolean
}

export function Header({
  onAddToken,
  onRefresh,
  isLoading,
  isAddTokenDisabled
}: HeaderProps) {
  const { t } = useTranslation("keyManagement")
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <KeyIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <Heading2>{t("title")}</Heading2>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={onAddToken} disabled={isAddTokenDisabled} size="sm">
            <PlusIcon className="w-4 h-4" />
            <span className="ml-1">{t("dialog.addToken")}</span>
          </Button>
          <Button onClick={onRefresh} disabled={isLoading} size="sm">
            {isLoading ? t("common:status.refreshing") : t("refreshTokenList")}
          </Button>
        </div>
      </div>
      <BodySmall>{t("description")}</BodySmall>
    </div>
  )
}
