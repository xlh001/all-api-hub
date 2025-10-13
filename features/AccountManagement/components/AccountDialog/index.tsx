import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild
} from "@headlessui/react"
import { Fragment } from "react"

import { useAccountDataContext } from "~/features/AccountManagement/hooks/AccountDataContext"
import { useDialogStateContext } from "~/features/AccountManagement/hooks/DialogStateContext"
import type { DisplaySiteData } from "~/types"

import AccountForm from "./AccountForm"
import ActionButtons from "./ActionButtons"
import AutoDetectErrorAlert from "./AutoDetectErrorAlert"
import DialogHeader from "./DialogHeader"
import { useAccountDialog } from "./hooks/useAccountDialog"
import InfoPanel from "./InfoPanel"
import SiteInfoInput from "./SiteInfoInput"

interface AccountDialogProps {
  isOpen: boolean
  onClose: () => void
  mode: "add" | "edit"
  account?: DisplaySiteData | null
  onSuccess: (data: any) => void
  onError: (error: Error) => void
}

export default function AccountDialog({
  isOpen,
  onClose,
  mode,
  account,
  onSuccess,
  onError
}: AccountDialogProps) {
  const { displayData, detectedAccount } = useAccountDataContext()
  const { openEditAccount } = useDialogStateContext()

  const { state, setters, handlers } = useAccountDialog({
    isOpen,
    onClose: () => {
      onClose()
      onError(new Error("Dialog closed by user"))
    },
    mode,
    account
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await handlers.handleSaveAccount()
      onSuccess(result)
    } catch (error) {
      onError(error)
    }
  }

  const detectedDisplayAccount =
    displayData.find((acc) => acc.id === detectedAccount?.id) ?? null

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
            <DialogPanel className="w-full max-w-md bg-white dark:bg-dark-bg-secondary rounded-lg shadow-xl transform transition-all max-h-[90vh] overflow-y-auto">
              <DialogHeader mode={mode} onClose={onClose} />

              <div className="p-4">
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                  {state.detectionError && (
                    <AutoDetectErrorAlert
                      error={state.detectionError}
                      siteUrl={state.url}
                    />
                  )}

                  <SiteInfoInput
                    url={state.url}
                    onUrlChange={handlers.handleUrlChange}
                    isDetected={state.isDetected}
                    onClearUrl={() => setters.setUrl("")}
                    authType={state.authType}
                    onAuthTypeChange={setters.setAuthType}
                    {...(mode === "add" && {
                      currentTabUrl: state.currentTabUrl,
                      isCurrentSiteAdded: !!detectedAccount,
                      detectedAccount: detectedDisplayAccount,
                      onUseCurrentTab: handlers.handleUseCurrentTabUrl,
                      onEditAccount: openEditAccount
                    })}
                  />

                  {mode === "add" &&
                    !state.isDetected &&
                    !state.showManualForm && (
                      <ActionButtons
                        mode={mode}
                        url={state.url}
                        isDetecting={state.isDetecting}
                        onAutoDetect={handlers.handleAutoDetect}
                        onShowManualForm={() => setters.setShowManualForm(true)}
                        onClose={onClose}
                        isFormValid={state.isFormValid}
                        isSaving={state.isSaving}
                        onAutoConfig={handlers.handleAutoConfig}
                        isAutoConfiguring={state.isAutoConfiguring}
                      />
                    )}

                  {(state.isDetected || state.showManualForm) && (
                    <>
                      <AccountForm
                        authType={state.authType}
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
                        checkIn={state.checkIn}
                        onCheckInChange={setters.setCheckIn}
                        siteType={state.siteType}
                        onSiteTypeChange={setters.setSiteType}
                      />
                      <ActionButtons
                        mode={mode}
                        url={state.url}
                        isDetecting={state.isDetecting}
                        onAutoDetect={handlers.handleAutoDetect}
                        onShowManualForm={() => setters.setShowManualForm(true)}
                        onClose={onClose}
                        isFormValid={state.isFormValid}
                        isSaving={state.isSaving}
                        isDetected={state.isDetected}
                        onAutoConfig={handlers.handleAutoConfig}
                        isAutoConfiguring={state.isAutoConfiguring}
                      />
                    </>
                  )}
                </form>
              </div>

              <InfoPanel
                mode={mode}
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
