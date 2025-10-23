import { useTranslation } from "react-i18next"

import iconImage from "~/assets/icon.png"
import { Body, Card, CardContent, Heading4 } from "~/components/ui"

export interface PluginIntroCardProps {
  version: string
}

const PluginIntroCard = ({ version }: PluginIntroCardProps) => {
  const { t } = useTranslation("about")
  return (
    <Card
      padding="lg"
      variant="default"
      className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200 dark:border-blue-800">
      <CardContent>
        <div className="flex items-start space-x-4">
          <img
            src={iconImage}
            alt="All API Hub"
            className="w-16 h-16 rounded-lg shadow-sm flex-shrink-0"
          />
          <div className="flex-1">
            <Heading4 className="mb-2">All API Hub</Heading4>
            <Body className="text-gray-600 dark:text-dark-text-secondary mb-4">
              {t("intro")}
            </Body>
            <div className="text-sm">
              <div>
                <span className="text-gray-500 dark:text-dark-text-secondary">
                  {t("version")}
                </span>
                <span className="ml-2 font-medium text-gray-900 dark:text-dark-text-primary">
                  v{version}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PluginIntroCard
