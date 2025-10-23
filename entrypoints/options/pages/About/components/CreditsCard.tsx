import { HeartIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import { Badge, BodySmall, Card, Heading6 } from "~/components/ui"

const CreditsCard = () => {
  const { t } = useTranslation("about")
  return (
    <Card>
      <div className="flex items-start space-x-4">
        <HeartIcon className="w-6 h-6 text-red-500 dark:text-red-400 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <Heading6 className="mb-2">{t("devMaintenance")}</Heading6>
          <BodySmall className="text-gray-600 dark:text-dark-text-secondary mb-4">
            {t("thanksDesc")}
          </BodySmall>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="destructive"
              size="sm"
              className="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/70">
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
