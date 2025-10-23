import { Modal } from "~/components/ui/Dialog/Modal"
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      panelClassName="w-full max-w-md bg-white dark:bg-dark-bg-secondary rounded-lg shadow-xl transform transition-all max-h-[85vh] overflow-hidden flex flex-col"
      header={<DialogHeader account={account} />}
      footer={<DialogFooter tokenCount={tokens.length} onClose={onClose} />}>
      <div className="flex-1 overflow-y-auto p-4">{renderContent()}</div>
    </Modal>
  )
}
