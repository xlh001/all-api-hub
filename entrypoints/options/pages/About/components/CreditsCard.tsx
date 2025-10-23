import { HeartIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import { Badge, BodySmall, Card, Heading6 } from "~/components/ui"

const CreditsCard = () => {
  const { t } = useTranslation("about")
  return (
    <Card>
      <div className="flex items-start space-x-4">
        <HeartIcon className="mt-1 h-6 w-6 flex-shrink-0 text-red-500 dark:text-red-400" />
        <div className="flex-1">
          <Heading6 className="mb-2">{t("devMaintenance")}</Heading6>
          <BodySmall className="mb-4 text-gray-600 dark:text-dark-text-secondary">
            {t("thanksDesc")}
          </BodySmall>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="destructive"
              size="sm"
              className="bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900/70">
              Made with ❤️
            </Badge>
            <Badge variant="secondary" size="sm">
              Open Source
            </Badge>
            <Badge variant="default" size="sm">
              Privacy First
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default CreditsCard
