import {
  ChevronDownIcon,
  ChevronUpIcon,
  InboxIcon,
  PlusIcon
} from "@heroicons/react/24/outline"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { EmptyState } from "~/components/ui"
import { DATA_TYPE_BALANCE, DATA_TYPE_CONSUMPTION } from "~/constants"
import { useAccountActionsContext } from "~/features/AccountManagement/hooks/AccountActionsContext"
import { useAccountDataContext } from "~/features/AccountManagement/hooks/AccountDataContext"
import { useDialogStateContext } from "~/features/AccountManagement/hooks/DialogStateContext"
import type { DisplaySiteData, SortField } from "~/types"

import CopyKeyDialog from "../CopyKeyDialog"
import DelAccountDialog from "../DelAccountDialog"
import AccountListItem from "./AccountListItem"

export default function AccountList() {
  const { t } = useTranslation(["account", "common"])
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
      <EmptyState
        icon={<InboxIcon className="w-12 h-12" />}
        title={t("account:emptyState")}
        action={{
          label: t("account:addFirstAccount"),
          onClick: openAddAccount,
          variant: "default",
          icon: <PlusIcon className="w-4 h-4" />
        }}
      />
    )
  }

  const renderSortButton = (field: SortField, label: string) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-0.5 sm:space-x-1 text-[10px] sm:text-xs font-medium text-gray-500 dark:text-dark-text-secondary hover:text-gray-700 dark:hover:text-dark-text-primary transition-colors touch-manipulation tap-highlight-transparent">
      <span>{label}</span>
      {sortField === field &&
        (sortOrder === "asc" ? (
          <ChevronUpIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
        ) : (
          <ChevronDownIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
        ))}
    </button>
  )

  return (
    <div className="flex flex-col">
      <div className="px-3 sm:px-5 py-2 sm:py-3 bg-gray-50 dark:bg-dark-bg-secondary border-y border-gray-200 dark:border-dark-bg-tertiary sticky top-0 z-10">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="flex-1 min-w-0">
            {renderSortButton("name", t("account:list.header.account"))}
          </div>
          <div className="text-right flex-shrink-0">
            <div className="flex items-center space-x-0.5 sm:space-x-1">
              {renderSortButton(
                DATA_TYPE_BALANCE,
                t("account:list.header.balance")
              )}
              <span className="text-[10px] sm:text-xs text-gray-400 dark:text-dark-text-tertiary">
                /
              </span>
              {renderSortButton(
                DATA_TYPE_CONSUMPTION,
                t("account:list.header.todayConsumption")
              )}
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
        account={copyKeyDialogAccount as DisplaySiteData}
      />
    </div>
  )
}
