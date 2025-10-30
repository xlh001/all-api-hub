import { LanguageIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import { BodySmall, Card, CardItem, CardList, Heading3 } from "~/components/ui"
import { LanguageSwitcher } from "~/components/LanguageSwitcher"

import ThemeToggle from "../../../components/ThemeToggle"
import DisplaySettings from "./DisplaySettings"

export default function GeneralTab() {
  const { t } = useTranslation("settings")

  return (
    <div className="space-y-6">
      <DisplaySettings />

      {/* Appearance & Language Section */}
      <section id="appearance">
        <div className="space-y-1.5">
          <Heading3>{t("theme.appearance")}</Heading3>
          <BodySmall>{t("display.description")}</BodySmall>
        </div>

        <Card padding="none">
          <CardList>
            <ThemeToggle />
            <CardItem
              icon={
                <LanguageIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              }
              title={t("appearanceLanguage.language")}
              description={t("appearanceLanguage.languageDesc")}
              rightContent={<LanguageSwitcher />}
            />
          </CardList>
        </Card>
      </section>
    </div>
  )
}
