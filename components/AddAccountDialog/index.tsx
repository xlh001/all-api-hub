import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild
} from "@headlessui/react"
import { Fragment } from "react"

import { useAddAccountDialog } from "~/hooks/useAddAccountDialog"
import type { DisplaySiteData } from "~/types"

import AutoDetectErrorAlert from "../AutoDetectErrorAlert"
import AccountForm from "./AccountForm"
import ActionButtons from "./ActionButtons"
import DialogHeader from "./DialogHeader"
import FormActions from "./FormActions"
import InfoPanel from "./InfoPanel"
import UrlInput from "./UrlInput"

interface AddAccountDialogProps {
  isOpen: boolean
  onClose: () => void
  isCurrentSiteAdded?: boolean
  onEditAccount?: (account: DisplaySiteData) => void
  detectedAccount?: DisplaySiteData | null
}

export default function AddAccountDialog({
  isOpen,
  onClose,
  isCurrentSiteAdded,
  onEditAccount,
  detectedAccount
}: AddAccountDialogProps) {
  const { state, setters, handlers } = useAddAccountDialog({ isOpen, onClose })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handlers.handleSaveAccount()
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

        <div className="fixed inset-0 flex items-center justify-center p-2">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95 translate-y-4"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-4">
            <DialogPanel className="w-full max-w-sm bg-white rounded-lg shadow-xl transform transition-all max-h-[90vh] overflow-y-auto">
              <DialogHeader onClose={onClose} />

              <div className="p-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {state.detectionError && (
                    <AutoDetectErrorAlert
                      error={state.detectionError}
                      siteUrl={state.url}
                    />
                  )}

                  <UrlInput
                    url={state.url}
                    isDetected={state.isDetected}
                    currentTabUrl={state.currentTabUrl}
                    isCurrentSiteAdded={isCurrentSiteAdded}
                    detectedAccount={detectedAccount}
                    onUrlChange={handlers.handleUrlChange}
                    onClearUrl={() => setters.setUrl("")}
                    onUseCurrentTab={handlers.handleUseCurrentTabUrl}
                    onEditAccount={onEditAccount}
                  />

                  {!state.isDetected && !state.showManualForm && (
                    <ActionButtons
                      url={state.url}
                      isDetecting={state.isDetecting}
                      onAutoDetect={handlers.handleAutoDetect}
                      onShowManualForm={() => setters.setShowManualForm(true)}
                    />
                  )}

                  {(state.isDetected || state.showManualForm) && (
                    <>
                      <AccountForm
                        siteName={state.siteName}
                        username={state.username}
                        userId={state.userId}
                        accessToken={state.accessToken}
                        exchangeRate={state.exchangeRate}
                        showAccessToken={state.showAccessToken}
                        onSiteNameChange={setters.setSiteName}
                        onUsernameChange={setters.setUsername}
                        onUserIdChange={setters.setUserId}
                        onAccessTokenChange={setters.setAccessToken}
                        onExchangeRateChange={setters.setExchangeRate}
                        onToggleShowAccessToken={() =>
                          setters.setShowAccessToken(!state.showAccessToken)
                        }
                        notes={state.notes}
                        onNotesChange={setters.setNotes}
                      />
                      <FormActions
                        isDetected={state.isDetected}
                        isSaving={state.isSaving}
                        siteName={state.siteName}
                        username={state.username}
                        accessToken={state.accessToken}
                        userId={state.userId}
                        exchangeRate={state.exchangeRate}
                        onClose={onClose}
                      />
                    </>
                  )}
                </form>
              </div>

              <InfoPanel
                isDetected={state.isDetected}
                showManualForm={state.showManualForm}
              />
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}
