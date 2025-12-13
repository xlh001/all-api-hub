import { useTranslation } from "react-i18next"

import { SettingSection } from "~/components/SettingSection"
import {
  Card,
  CardItem,
  CardList,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui"
import { useUserPreferencesContext } from "~/contexts/UserPreferencesContext"
import { showUpdateToast } from "~/utils/toastHelpers"

/**
 * Component for selecting which managed site type to use (New API or Veloera).
 * @returns Section with dropdown to select managed site type.
 */
export default function ManagedSiteSelector() {
  const { t } = useTranslation("settings")
  const { managedSiteType, updateManagedSiteType } = useUserPreferencesContext()

  const handleManagedSiteTypeChange = async (value: string) => {
    const siteType = value as "new-api" | "veloera"
    if (siteType === managedSiteType) return

    const success = await updateManagedSiteType(siteType)
    showUpdateToast(success, t("managedSite.siteTypeLabel"))
  }

  return (
    <SettingSection
      id="managed-site-selector"
      title={t("managedSite.title")}
      description={t("managedSite.description")}
    >
      <Card padding="none">
        <CardList>
          <CardItem
            title={t("managedSite.siteTypeLabel")}
            description={t("managedSite.siteTypeDesc")}
            rightContent={
              <Select
                value={managedSiteType}
                onValueChange={handleManagedSiteTypeChange}
              >
                <SelectTrigger
                  className="w-full"
                  aria-label={t("managedSite.siteTypeLabel")}
                >
                  <SelectValue placeholder={t("managedSite.siteTypeLabel")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new-api">
                    {t("managedSite.newApi")}
                  </SelectItem>
                  <SelectItem value="veloera">
                    {t("managedSite.veloera")}
                  </SelectItem>
                </SelectContent>
              </Select>
            }
          />
        </CardList>
      </Card>
    </SettingSection>
  )
}
