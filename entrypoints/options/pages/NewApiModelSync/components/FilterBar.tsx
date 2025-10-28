import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import { Input } from "~/components/ui"

export type FilterStatus = "all" | "success" | "failed"

interface FilterBarProps {
  status: FilterStatus
  keyword: string
  onStatusChange: (status: FilterStatus) => void
  onKeywordChange: (keyword: string) => void
}

export default function FilterBar({
  status,
  keyword,
  onStatusChange,
  onKeywordChange
}: FilterBarProps) {
  const { t } = useTranslation("newApiModelSync")

  const renderFilterButton = (value: FilterStatus, color: string) => (
    <button
      onClick={() => onStatusChange(value)}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
        status === value
          ? `${color} text-white`
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
      }`}>
      {t(`execution.filters.${value}`)}
    </button>
  )

  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex gap-2">
        {renderFilterButton("all", "bg-blue-600")}
        {renderFilterButton("success", "bg-green-600")}
        {renderFilterButton("failed", "bg-red-600")}
      </div>
      <div className="relative flex-1 md:max-w-xs">
        <Input
          type="text"
          placeholder={t("execution.filters.searchPlaceholder") as string}
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
        />
      </div>
    </div>
  )
}
