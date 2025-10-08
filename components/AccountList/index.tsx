import {
  ChevronDownIcon,
  ChevronUpIcon,
  InboxIcon
} from "@heroicons/react/24/outline"
import { useState } from "react"

import { DATA_TYPE_BALANCE, DATA_TYPE_CONSUMPTION } from "~/constants/ui"
import {
  useAccountActionsContext,
  useAccountDataContext,
  useDialogStateContext
} from "~/contexts"
import type { DisplaySiteData, SortField } from "~/types"

import CopyKeyDialog from "../CopyKeyDialog"
import DelAccountDialog from "../DelAccountDialog"
import AccountListItem from "./AccountListItem"

export default function AccountList() {
  const { sortedData, handleSort, sortField, sortOrder } =
    useAccountDataContext()
  const { openAddAccount } = useDialogStateContext()
  const { handleDeleteAccount } = useAccountActionsContext()

  const [deleteDialogAccount, setDeleteDialogAccount] =
    useState<DisplaySiteData | null>(null)
  const [copyKeyDialogAccount, setCopyKeyDialogAccount] =
    useState<DisplaySiteData | null>(null)

  const handleDeleteWithDialog = (site: DisplaySiteData) => {
    setDeleteDialogAccount(site)
  }

  const handleCopyKeyWithDialog = (site: DisplaySiteData) => {
    setCopyKeyDialogAccount(site)
  }

  if (sortedData.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <InboxIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <p className="text-gray-500 text-sm mb-4">暂无站点账号</p>
        <button
          onClick={openAddAccount}
          className="px-6 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm">
          添加你的第一个站点账号
        </button>
      </div>
    )
  }

  const renderSortButton = (field: SortField, label: string) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors">
      <span>{label}</span>
      {sortField === field &&
        (sortOrder === "asc" ? (
          <ChevronUpIcon className="w-3 h-3" />
        ) : (
          <ChevronDownIcon className="w-3 h-3" />
        ))}
    </button>
  )

  return (
    <div className="flex flex-col">
      <div className="px-5 py-3 bg-gray-50 border-y border-gray-200 sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <div className="flex-1">{renderSortButton("name", "账号")}</div>
          <div className="text-right flex-shrink-0">
            <div className="flex items-center space-x-1">
              {renderSortButton(DATA_TYPE_BALANCE, "余额")}
              <span className="text-xs text-gray-400">/</span>
              {renderSortButton(DATA_TYPE_CONSUMPTION, "今日消费")}
            </div>
          </div>
        </div>
      </div>

      {sortedData.map((site) => (
        <AccountListItem
          key={site.id}
          site={site}
          onDeleteWithDialog={handleDeleteWithDialog}
          onCopyKey={handleCopyKeyWithDialog}
        />
      ))}

      <DelAccountDialog
        isOpen={deleteDialogAccount !== null}
        onClose={() => setDeleteDialogAccount(null)}
        account={deleteDialogAccount}
        onDeleted={() => {
          handleDeleteAccount(deleteDialogAccount!)
          setDeleteDialogAccount(null)
        }}
      />

      <CopyKeyDialog
        isOpen={copyKeyDialogAccount !== null}
        onClose={() => setCopyKeyDialogAccount(null)}
        account={copyKeyDialogAccount}
      />
    </div>
  )
}
