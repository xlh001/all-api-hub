import { ArrowPathIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import { EmptyState } from "~/components/ui"

interface EmptyResultsProps {
  hasHistory: boolean
}

export default function EmptyResults({ hasHistory }: EmptyResultsProps) {
  const { t } = useTranslation("newApiModelSync")

  if (!hasHistory) {
    return (
      <EmptyState
        title={t("execution.empty.noData")}
        description={t("execution.empty.noDataDesc")}
        icon={<ArrowPathIcon className="h-12 w-12" />}
      />
    )
  }

  return (
    <EmptyState
      title={t("execution.empty.noResults")}
      description={t("execution.empty.noResultsDesc")}
      icon={<MagnifyingGlassIcon className="h-12 w-12" />}
    />
  )
}
