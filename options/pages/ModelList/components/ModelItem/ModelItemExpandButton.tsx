import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline"
import React from "react"

interface ModelItemExpandButtonProps {
  isExpanded: boolean
  onToggleExpand: () => void
}

export const ModelItemExpandButton: React.FC<ModelItemExpandButtonProps> = ({
  isExpanded,
  onToggleExpand
}) => {
  return (
    <button
      onClick={onToggleExpand}
      className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
      title={isExpanded ? "收起详细信息" : "展开详细信息"}>
      {isExpanded ? (
        <ChevronUpIcon className="w-4 h-4 text-gray-400" />
      ) : (
        <ChevronDownIcon className="w-4 h-4 text-gray-400" />
      )}
    </button>
  )
}
