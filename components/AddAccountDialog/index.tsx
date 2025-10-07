import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild
} from "@headlessui/react"
import { Fragment } from "react"

import { useAccountDataContext, useDialogStateContext } from "~/contexts"
import { useAddAccountDialog } from "~/components/AddAccountDialog/useAddAccountDialog"

import AutoDetectErrorAlert from "../AutoDetectErrorAlert"
import AccountForm from "./AccountForm"
import ActionButtons from "./ActionButtons"
import DialogHeader from "./DialogHeader"
import FormActions from "./FormActions"
import InfoPanel from "./InfoPanel"
import UrlInput from "./UrlInput"

export default function AddAccountDialog() {
  const { isAddAccountOpen, closeAddAccount, openEditAccount } =
    useDialogStateContext()
  const { displayData, detectedAccount } = useAccountDataContext()

  const { state, setters, handlers } = useAddAccountDialog({
    isOpen: isAddAccountOpen,
    onClose: closeAddAccount
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handlers.handleSaveAccount()
  }

  const detectedDisplayAccount =
    displayData.find((acc) => acc.id === detectedAccount?.id) ?? null

  return (
    <Transition show={isAddAccountOpen} as={Fragment}>
      <Dialog onClose={closeAddAccount} className="relative z-50">
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
              <DialogHeader onClose={closeAddAccount} />

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
                    isCurrentSiteAdded={!!detectedAccount}
                    detectedAccount={detectedDisplayAccount}
                    onUrlChange={handlers.handleUrlChange}
                    onClearUrl={() => setters.setUrl("")}
                    onUseCurrentTab={handlers.handleUseCurrentTabUrl}
                    onEditAccount={openEditAccount}
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
                        supportsCheckIn={state.supportsCheckIn}
                        setSupportsCheckIn={setters.setSupportsCheckIn}
                        siteType={state.siteType}
                        onSiteTypeChange={setters.setSiteType}
                      />
                      <FormActions
                        isDetected={state.isDetected}
                        isSaving={state.isSaving}
                        siteName={state.siteName}
                        username={state.username}
                        accessToken={state.accessToken}
                        userId={state.userId}
                        exchangeRate={state.exchangeRate}
                        onClose={closeAddAccount}
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
