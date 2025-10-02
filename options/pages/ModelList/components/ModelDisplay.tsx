import { CpuChipIcon } from "@heroicons/react/24/outline"
import { Virtuoso } from "react-virtuoso"

import ModelItem from "~/components/ModelItem"
import type { DisplaySiteData } from "~/types"

interface ModelDisplayProps {
  models: any[]
  currentAccount: DisplaySiteData | undefined
  showRealPrice: boolean
  showRatioColumn: boolean
  showEndpointTypes: boolean
  selectedGroup: string
  handleGroupClick: (group: string) => void
  availableGroups: string[]
}

export function ModelDisplay({
  models,
  currentAccount,
  showRealPrice,
  showRatioColumn,
  showEndpointTypes,
  selectedGroup,
  handleGroupClick,
  availableGroups
}: ModelDisplayProps) {
  if (models.length === 0) {
    return (
      <div className="text-center py-12">
        <CpuChipIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">没有找到匹配的模型</p>
      </div>
    )
  }

  return (
    <div className="h-[70vh]">
      <Virtuoso
        data={models}
        components={{
          Item: ({ children, ...props }) => (
            <div className="my-3 first:mt-0" {...props}>
              {children}
            </div>
          )
        }}
        itemContent={(index, item) => (
          <ModelItem
            key={`${item.model.model_name}-${index}`}
            model={item.model}
            calculatedPrice={item.calculatedPrice}
            exchangeRate={
              currentAccount?.balance?.USD > 0
                ? currentAccount.balance.CNY / currentAccount.balance.USD
                : 7
            }
            showRealPrice={showRealPrice}
            showRatioColumn={showRatioColumn}
            showEndpointTypes={showEndpointTypes}
            userGroup={selectedGroup === "all" ? "default" : selectedGroup}
            onGroupClick={handleGroupClick}
            availableGroups={availableGroups}
            isAllGroupsMode={selectedGroup === "all"}
          />
        )}
      />
    </div>
  )
}
