import {
  ArrowPathIcon,
  CpuChipIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import type { DisplaySiteData } from "~/types"

interface StatusIndicatorProps {
  selectedAccount: string
  isLoading: boolean
  dataFormatError: boolean
  currentAccount: DisplaySiteData | undefined
  loadPricingData: () => void
}

export function StatusIndicator({
  selectedAccount,
  isLoading,
  dataFormatError,
  currentAccount,
  loadPricingData
}: StatusIndicatorProps) {
  const { t } = useTranslation("modelList")
  if (!selectedAccount) {
    return (
      <div className="text-center py-12">
        <CpuChipIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
          {t("pleaseSelectFirst")}
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <ArrowPathIcon className="w-8 h-8 text-blue-600 mx-auto mb-4 animate-spin" />
        <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
          {t("status.loading")}
        </p>
      </div>
    )
  }

  if (dataFormatError && currentAccount) {
    return (
      <div className="mb-6 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-4">
          <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">
              {t("status.incompatibleFormat")}
            </h3>
            <p className="text-sm text-red-700 dark:text-red-400 mt-1">
              {t("status.incompatibleDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`${currentAccount.baseUrl}/pricing`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                <span>{t("status.goToSitePricing")}</span>
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M17 3l4 4m-5 0l5-5"
                  />
                </svg>
              </a>
              <button
                onClick={loadPricingData}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                <span>{t("status.retryLoad")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
