import { useTranslation } from "react-i18next"

import { LanguageSwitcher } from "~/components/LanguageSwitcher"
import { BodySmall, Card, CardItem, CardList, Heading3 } from "~/components/ui"

import ThemeToggle from "../../../components/ThemeToggle"

export default function AppearanceLanguageTab() {
  const { t } = useTranslation("settings")

  return (
    <div className="space-y-6">
      <section id="appearance">
        <div className="mb-4 space-y-1.5">
          <Heading3>{t("theme.appearance")}</Heading3>
          <BodySmall>{t("display.description")}</BodySmall>
        </div>

        <Card padding="none">
          <CardList>
            <ThemeToggle />
            <CardItem
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
