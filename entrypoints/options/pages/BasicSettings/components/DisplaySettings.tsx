import { EyeIcon, GlobeAltIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import {
  BodySmall,
  Card,
  CardContent,
  Heading2,
  ToggleButton
} from "~/components/ui"
import { DATA_TYPE_BALANCE, DATA_TYPE_CONSUMPTION } from "~/constants"
import { ANIMATIONS, COLORS } from "~/constants/designTokens"
import { useUserPreferencesContext } from "~/contexts/UserPreferencesContext"
import type { BalanceType, CurrencyType } from "~/types"

import ThemeToggle from "../../../components/ThemeToggle"
import { showUpdateToast } from "../utils/toastHelpers"

export default function DisplaySettings() {
  const { t } = useTranslation("settings")
  const { currencyType, activeTab, updateCurrencyType, updateDefaultTab } =
    useUserPreferencesContext()

  const handleCurrencyChange = async (currency: CurrencyType) => {
    if (currency === currencyType) return
    const success = await updateCurrencyType(currency)
    showUpdateToast(success, t("display.currencyUnit"))
  }

  const handleDefaultTabChange = async (tab: BalanceType) => {
    if (tab === activeTab) return
    const success = await updateDefaultTab(tab)
    showUpdateToast(success, t("display.defaultTab"))
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <Heading2>{t("display.title")}</Heading2>
        <BodySmall>{t("display.description")}</BodySmall>
      </div>

      <Card>
        <CardContent>
          <div className={`divide-y ${COLORS.border.default}`}>
            <ThemeToggle />

            {/* 默认货币单位 */}
            <div className="flex items-center justify-between py-4 px-6 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 transition-colors">
                  <GlobeAltIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-dark-text-primary transition-colors">
                    {t("display.currencyUnit")}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-dark-text-secondary transition-colors">
                    {t("display.currencyDesc")}
                  </p>
                </div>
              </div>
              <div
                className={`flex ${COLORS.background.tertiary} rounded-lg p-1 shadow-sm ${ANIMATIONS.transition.base}`}>
                <ToggleButton
                  onClick={() => handleCurrencyChange("USD")}
                  isActive={currencyType === "USD"}
                  size="default"
                  aria-label={t("display.usd")}>
                  {t("display.usd")}
                </ToggleButton>
                <ToggleButton
                  onClick={() => handleCurrencyChange("CNY")}
                  isActive={currencyType === "CNY"}
                  size="default"
                  aria-label={t("display.cny")}>
                  {t("display.cny")}
                </ToggleButton>
              </div>
            </div>

            <div className="flex items-center justify-between py-4 px-6 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 transition-colors">
                  <EyeIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-dark-text-primary transition-colors">
                    {t("display.defaultTab")}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-dark-text-secondary transition-colors">
                    {t("display.defaultTabDesc")}
                  </p>
                </div>
              </div>
              <div
                className={`flex ${COLORS.background.tertiary} rounded-lg p-1 shadow-sm ${ANIMATIONS.transition.base}`}>
                <ToggleButton
                  onClick={() => handleDefaultTabChange(DATA_TYPE_CONSUMPTION)}
                  isActive={activeTab === DATA_TYPE_CONSUMPTION}
                  size="default"
                  aria-label={t("display.todayConsumption")}>
                  {t("display.todayConsumption")}
                </ToggleButton>
                <ToggleButton
                  onClick={() => handleDefaultTabChange(DATA_TYPE_BALANCE)}
                  isActive={activeTab === DATA_TYPE_BALANCE}
                  size="default"
                  aria-label={t("display.totalBalance")}>
                  {t("display.totalBalance")}
                </ToggleButton>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
