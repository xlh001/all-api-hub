import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild
} from "@headlessui/react"
import { Fragment } from "react"

import { useDialogStateContext } from "~/contexts"
import { useEditAccountDialog } from "~/hooks/useEditAccountDialog"

import AutoDetectErrorAlert from "../AutoDetectErrorAlert"
import AccountForm from "./AccountForm"
import ActionButtons from "./ActionButtons"
import DialogHeader from "./DialogHeader"
import InfoPanel from "./InfoPanel"
import UrlInput from "./UrlInput"

export default function EditAccountDialog() {
  const { isEditAccountOpen, closeEditAccount, editingAccount } =
    useDialogStateContext()

  const {
    url,
    setUrl,
    isDetecting,
    siteName,
    setSiteName,
    username,
    setUsername,
    accessToken,
    setAccessToken,
    userId,
    setUserId,
    isDetected,
    isSaving,
    showAccessToken,
    setShowAccessToken,
    detectionError,
    exchangeRate,
    setExchangeRate,
    handleAutoDetect,
    handleSubmit,
    isFormValid,
    notes,
    setNotes,
    supportsCheckIn,
    setSupportsCheckIn,
    siteType,
    setSiteType
  } = useEditAccountDialog({
    account: editingAccount,
    onClose: closeEditAccount
  })

  return (
    <Transition show={isEditAccountOpen} as={Fragment}>
      <Dialog onClose={closeEditAccount} className="relative z-50">
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
              <DialogHeader onClose={closeEditAccount} />

              <div className="p-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {detectionError && (
                    <AutoDetectErrorAlert
                      error={detectionError}
                      siteUrl={url}
                    />
                  )}

                  <UrlInput url={url} setUrl={setUrl} isDetected={isDetected} />

                  <AccountForm
                    siteName={siteName}
                    setSiteName={setSiteName}
                    username={username}
                    setUsername={setUsername}
                    userId={userId}
                    setUserId={setUserId}
                    accessToken={accessToken}
                    setAccessToken={setAccessToken}
                    showAccessToken={showAccessToken}
                    setShowAccessToken={setShowAccessToken}
                    exchangeRate={exchangeRate}
                    setExchangeRate={setExchangeRate}
                    notes={notes}
                    setNotes={setNotes}
                    supportsCheckIn={supportsCheckIn}
                    setSupportsCheckIn={setSupportsCheckIn}
                    siteType={siteType}
                    setSiteType={setSiteType}
                  />

                  <ActionButtons
                    onClose={closeEditAccount}
                    handleAutoDetect={handleAutoDetect}
                    isDetected={isDetected}
                    isDetecting={isDetecting}
                    isSaving={isSaving}
                    isFormValid={isFormValid}
                    url={url}
                  />
                </form>
              </div>

              <InfoPanel />
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}
