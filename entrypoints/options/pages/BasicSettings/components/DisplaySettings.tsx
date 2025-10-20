import { EyeIcon, GlobeAltIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import { DATA_TYPE_BALANCE, DATA_TYPE_CONSUMPTION } from "~/constants"
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
        <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text-primary transition-colors">
          {t("display.title")}
        </h2>
        <p className="text-sm text-gray-600 dark:text-dark-text-secondary transition-colors">
          {t("display.description")}
        </p>
      </div>

      <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-sm border border-gray-200 dark:border-dark-bg-tertiary transition-all duration-200">
        <div className="divide-y divide-gray-200 dark:divide-dark-bg-tertiary">
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
            <div className="flex bg-gray-100 dark:bg-dark-bg-primary rounded-lg p-1 shadow-sm transition-all duration-200">
              <button
                onClick={() => handleCurrencyChange("USD")}
                className={`
                  px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-offset-1
                  ${
                    currencyType === "USD"
                      ? "bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text-primary shadow-sm scale-105"
                      : "text-gray-600 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text-primary hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary"
                  }
                  focus:ring-green-500 dark:focus:ring-green-400
                `}
                aria-label={t("display.usd")}
                aria-pressed={currencyType === "USD"}>
                {t("display.usd")}
              </button>
              <button
                onClick={() => handleCurrencyChange("CNY")}
                className={`
                  px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-offset-1
                  ${
                    currencyType === "CNY"
                      ? "bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text-primary shadow-sm scale-105"
                      : "text-gray-600 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text-primary hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary"
                  }
                  focus:ring-green-500 dark:focus:ring-green-400
                `}
                aria-label={t("display.cny")}
                aria-pressed={currencyType === "CNY"}>
                {t("display.cny")}
              </button>
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
            <div className="flex bg-gray-100 dark:bg-dark-bg-primary rounded-lg p-1 shadow-sm transition-all duration-200">
              <button
                onClick={() => handleDefaultTabChange(DATA_TYPE_CONSUMPTION)}
                className={`
                  px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-offset-1
                  ${
                    activeTab === DATA_TYPE_CONSUMPTION
                      ? "bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text-primary shadow-sm scale-105"
                      : "text-gray-600 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text-primary hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary"
                  }
                  focus:ring-blue-500 dark:focus:ring-blue-400
                `}
                aria-label={t("display.todayConsumption")}
                aria-pressed={activeTab === DATA_TYPE_CONSUMPTION}>
                {t("display.todayConsumption")}
              </button>
              <button
                onClick={() => handleDefaultTabChange(DATA_TYPE_BALANCE)}
                className={`
                  px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-offset-1
                  ${
                    activeTab === DATA_TYPE_BALANCE
                      ? "bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text-primary shadow-sm scale-105"
                      : "text-gray-600 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text-primary hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary"
                  }
                  focus:ring-blue-500 dark:focus:ring-blue-400
                `}
                aria-label={t("display.totalBalance")}
                aria-pressed={activeTab === DATA_TYPE_BALANCE}>
                {t("display.totalBalance")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
