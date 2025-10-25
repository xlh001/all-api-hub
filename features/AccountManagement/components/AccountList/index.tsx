import {
  ChevronDownIcon,
  ChevronUpIcon,
  InboxIcon,
  PlusIcon
} from "@heroicons/react/24/outline"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import {
  Card,
  CardContent,
  CardList,
  EmptyState,
  IconButton
} from "~/components/ui"
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
        icon={<InboxIcon className="h-12 w-12" />}
        title={t("account:emptyState")}
        action={{
          label: t("account:addFirstAccount"),
          onClick: openAddAccount,
          variant: "default",
          icon: <PlusIcon className="h-4 w-4" />
        }}
      />
    )
  }

  const renderSortButton = (field: SortField, label: string) => (
    <IconButton
      onClick={() => handleSort(field)}
      variant="ghost"
      size="none"
      aria-label={`${t("account:list.sort")} ${label}`}
      className="space-x-0.5 text-[10px] font-medium sm:space-x-1 sm:text-xs">
      <span>{label}</span>
      {sortField === field &&
        (sortOrder === "asc" ? (
          <ChevronUpIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
        ) : (
          <ChevronDownIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
        ))}
    </IconButton>
  )

  return (
    <Card padding="none" className="flex flex-col overflow-hidden">
      <CardContent padding={"none"} spacing={"none"}>
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50 px-3 py-2 dark:border-dark-bg-tertiary dark:bg-dark-bg-secondary sm:px-5">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Account Name Column */}
            <div className="min-w-0 flex-1">
              {renderSortButton("name", t("account:list.header.account"))}
            </div>

            {/* Balance & Consumption Column */}
            <div className="flex flex-shrink-0 items-end gap-0.5">
              <div className="flex items-center">
                {renderSortButton(
                  DATA_TYPE_BALANCE,
                  t("account:list.header.balance")
                )}
              </div>
              <div className="text-[10px] text-gray-400 dark:text-dark-text-tertiary sm:text-xs">
                /
              </div>
              <div className="flex items-center text-[9px] text-gray-400 dark:text-dark-text-tertiary sm:text-[10px]">
                {renderSortButton(
                  DATA_TYPE_CONSUMPTION,
                  t("account:list.header.todayConsumption")
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Account List */}
        <CardList>
          {sortedData.map((site) => (
            <AccountListItem
              key={site.id}
              site={site}
              onDeleteWithDialog={handleDeleteWithDialog}
              onCopyKey={handleCopyKeyWithDialog}
            />
          ))}
        </CardList>
      </CardContent>

      {/* Dialogs */}
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
    </Card>
  )
}
