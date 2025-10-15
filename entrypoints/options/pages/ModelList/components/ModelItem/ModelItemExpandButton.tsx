import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline"
import React from "react"
import { useTranslation } from "react-i18next"

interface ModelItemExpandButtonProps {
  isExpanded: boolean
  onToggleExpand: () => void
}

export const ModelItemExpandButton: React.FC<ModelItemExpandButtonProps> = ({
  isExpanded,
  onToggleExpand
}) => {
  const { t } = useTranslation()
  return (
    <button
      onClick={onToggleExpand}
      className="ml-4 p-2 hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary rounded-lg transition-colors"
      title={
        isExpanded
          ? t("modelList.collapseDetails")
          : t("modelList.expandDetails")
      }>
      {isExpanded ? (
        <ChevronUpIcon className="w-4 h-4 text-gray-400 dark:text-dark-text-tertiary" />
      ) : (
        <ChevronDownIcon className="w-4 h-4 text-gray-400 dark:text-dark-text-tertiary" />
      )}
    </button>
  )
}
