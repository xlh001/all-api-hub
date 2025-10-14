import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild
} from "@headlessui/react"
import { Fragment } from "react"

import { useCopyKeyDialog } from "~/features/AccountManagement/components/CopyKeyDialog/hooks/useCopyKeyDialog"
import type { DisplaySiteData } from "~/types"
import {
  formatQuota,
  formatTimestamp,
  formatUsedQuota,
  getGroupBadgeStyle,
  getStatusBadgeStyle
} from "~/utils/formatters"

import { DialogFooter } from "./DialogFooter"
import { DialogHeader } from "./DialogHeader"
import { ErrorDisplay } from "./ErrorDisplay"
import { LoadingIndicator } from "./LoadingIndicator"
import { TokenList } from "./TokenList"

interface CopyKeyDialogProps {
  isOpen: boolean
  onClose: () => void
  account: DisplaySiteData
}

export default function CopyKeyDialog({
  isOpen,
  onClose,
  account
}: CopyKeyDialogProps) {
  const {
    tokens,
    isLoading,
    error,
    copiedKey,
    expandedTokens,
    fetchTokens,
    copyKey,
    toggleTokenExpansion
  } = useCopyKeyDialog(isOpen, account)

  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator />
    }
    if (error) {
      return <ErrorDisplay error={error} onRetry={fetchTokens} />
    }
    return (
      <TokenList
        tokens={tokens}
        expandedTokens={expandedTokens}
        copiedKey={copiedKey}
        onToggleToken={toggleTokenExpansion}
        onCopyKey={copyKey}
        formatTime={formatTimestamp}
        formatUsedQuota={formatUsedQuota}
        formatQuota={formatQuota}
        getGroupBadgeStyle={getGroupBadgeStyle}
        getStatusBadgeStyle={getStatusBadgeStyle}
        account={account}
      />
    )
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            aria-hidden="true"
          />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95 translate-y-4"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-4">
            <DialogPanel className="w-full max-w-md bg-white dark:bg-dark-bg-secondary rounded-lg shadow-xl transform transition-all max-h-[85vh] overflow-hidden flex flex-col">
              <DialogHeader account={account} onClose={onClose} />
              <div className="flex-1 overflow-y-auto p-4">
                {renderContent()}
              </div>
              <DialogFooter tokenCount={tokens.length} onClose={onClose} />
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}
