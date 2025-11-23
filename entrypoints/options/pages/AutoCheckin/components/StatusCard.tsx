import { useTranslation } from "react-i18next"

import { Card, CardContent } from "~/components/ui"
import type { AutoCheckinStatus } from "~/types/autoCheckin"

interface StatusCardProps {
  status: AutoCheckinStatus
}

export default function StatusCard({ status }: StatusCardProps) {
  const { t } = useTranslation("autoCheckin")

  const formatDateTime = (isoString?: string): string => {
    if (!isoString) return t("status.notScheduled")
    try {
      const date = new Date(isoString)
      return Number.isNaN(date.getTime())
        ? t("status.notScheduled")
        : date.toLocaleString()
    } catch {
      return t("status.notScheduled")
    }
  }

  const getResultBadgeColor = (
    result?: "success" | "partial" | "failed"
  ): string => {
    switch (result) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "partial":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    }
  }

  const accountResults = status.perAccount
    ? Object.values(status.perAccount)
    : []
  const derivedSuccess = accountResults.filter(
    (r) => r.status === "success" || r.status === "already_checked"
  ).length
  const derivedFailed = accountResults.filter(
    (r) => r.status === "failed"
  ).length
  const derivedSkipped = accountResults.length - derivedSuccess - derivedFailed

  const summary = status.summary ?? {
    totalEligible: accountResults.length,
    executed: accountResults.length,
    successCount: derivedSuccess,
    failedCount: derivedFailed,
    skippedCount: Math.max(derivedSkipped, 0),
    needsRetry: false
  }

  const summaryItems = [
    {
      label: t("status.summary.eligible"),
      value: summary.totalEligible ?? accountResults.length
    },
    {
      label: t("status.summary.executed"),
      value: summary.executed ?? accountResults.length
    },
    {
      label: t("status.summary.success"),
      value: summary.successCount ?? derivedSuccess
    },
    {
      label: t("status.summary.failed"),
      value: summary.failedCount ?? derivedFailed
    },
    {
      label: t("status.summary.skipped"),
      value: summary.skippedCount ?? derivedSkipped
    }
  ]

  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {t("status.lastRun")}
            </div>
            <div className="mt-1 text-lg font-semibold">
              {formatDateTime(status.lastRunAt)}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {t("status.nextScheduled")}
            </div>
            <div className="mt-1 text-lg font-semibold">
              {formatDateTime(status.nextScheduledAt)}
              {status.pendingRetry && (
                <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                  {t("status.pendingRetry")}
                </span>
              )}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {t("execution.statistics.result")}
            </div>
            <div className="mt-1">
              {status.lastRunResult && (
                <span
                  className={`inline-block rounded px-2 py-1 text-sm font-medium ${getResultBadgeColor(status.lastRunResult)}`}>
                  {t(`status.result.${status.lastRunResult}`)}
                </span>
              )}
              {!status.lastRunResult && (
                <span className="text-lg font-semibold text-gray-400">-</span>
              )}
            </div>
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {t("status.summary.title")}
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-300">
            {summaryItems.map((item) => (
              <div key={item.label} className="flex flex-col">
                <span className="text-xs tracking-wide text-gray-400 uppercase dark:text-gray-500">
                  {item.label}
                </span>
                <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {item.value ?? "-"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
