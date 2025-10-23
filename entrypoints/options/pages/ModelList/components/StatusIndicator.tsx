import { ArrowPathIcon, CpuChipIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import { Alert, Button, EmptyState, Spinner } from "~/components/ui"
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
      <EmptyState
        icon={<CpuChipIcon className="h-12 w-12" />}
        title={t("pleaseSelectFirst")}
      />
    )
  }

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <Spinner size="lg" className="mx-auto mb-4" />
        <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
          {t("status.loading")}
        </p>
      </div>
    )
  }

  if (dataFormatError && currentAccount) {
    return (
      <Alert variant="warning" className="mb-6">
        <div>
          <h3 className="mb-2 text-lg font-medium">
            {t("status.incompatibleFormat")}
          </h3>
          <p className="mb-4 text-sm">{t("status.incompatibleDesc")}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="warning"
              onClick={() =>
                window.open(`${currentAccount.baseUrl}/pricing`, "_blank")
              }
              rightIcon={
                <svg
                  className="h-4 w-4"
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
              }>
              {t("status.goToSitePricing")}
            </Button>
            <Button
              variant="secondary"
              onClick={loadPricingData}
              leftIcon={<ArrowPathIcon className="h-4 w-4" />}>
              {t("status.retryLoad")}
            </Button>
          </div>
        </div>
      </Alert>
    )
  }

  return null
}
