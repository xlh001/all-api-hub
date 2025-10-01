import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useState } from "react"
import toast from "react-hot-toast"

import type { ApiToken } from "~/types"

import { UI_CONSTANTS } from "../../constants/ui"
import { useTokenData } from "../../hooks/useTokenData"
import { useTokenForm } from "../../hooks/useTokenForm"
import {
  createApiToken,
  updateApiToken,
  type CreateTokenRequest
} from "../../services/apiService"
import { DialogHeader } from "./DialogHeader"
import { FormActions } from "./FormActions"
import { LoadingIndicator } from "./LoadingIndicator"
import { TokenForm } from "./TokenForm"
import { WarningNote } from "./WarningNote"

interface AddTokenDialogProps {
  isOpen: boolean
  onClose: () => void
  availableAccounts: Array<{
    id: string
    name: string
    baseUrl: string
    userId: number
    token: string
  }>
  preSelectedAccountId?: string | null
  editingToken?: (ApiToken & { accountName: string }) | null
}

export default function AddTokenDialog(props: AddTokenDialogProps) {
  const { isOpen, onClose, availableAccounts, editingToken } = props
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { formData, setFormData, errors, validateForm, isEditMode, resetForm } =
    useTokenForm(props)

  const currentAccount = availableAccounts.find(
    (acc) => acc.id === formData.accountId
  )

  const { isLoading, availableModels, groups, resetData } = useTokenData(
    isOpen,
    currentAccount,
    setFormData
  )

  const handleClose = () => {
    resetForm()
    resetData()
    onClose()
  }

  const handleSubmit = async () => {
    if (!currentAccount || !validateForm()) return

    setIsSubmitting(true)
    try {
      const tokenData: CreateTokenRequest = {
        name: formData.name.trim(),
        remain_quota: formData.unlimitedQuota
          ? -1
          : Math.floor(
              parseFloat(formData.quota) *
                UI_CONSTANTS.EXCHANGE_RATE.CONVERSION_FACTOR
            ),
        expired_time: formData.expiredTime
          ? Math.floor(new Date(formData.expiredTime).getTime() / 1000)
          : -1,
        unlimited_quota: formData.unlimitedQuota,
        model_limits_enabled: formData.modelLimitsEnabled,
        model_limits: formData.modelLimits.join(","),
        allow_ips: formData.allowIps.trim() || "",
        group: formData.group
      }

      if (isEditMode && editingToken) {
        await updateApiToken(
          currentAccount.baseUrl,
          currentAccount.userId,
          currentAccount.token,
          editingToken.id,
          tokenData
        )
        toast.success("密钥更新成功")
      } else {
        await createApiToken(
          currentAccount.baseUrl,
          currentAccount.userId,
          currentAccount.token,
          tokenData
        )
        toast.success("密钥创建成功")
      }

      handleClose()
    } catch (error) {
      console.error(`${isEditMode ? "更新" : "创建"}密钥失败:`, error)
      toast.error(`${isEditMode ? "更新" : "创建"}密钥失败，请稍后重试`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                <DialogHeader isEditMode={isEditMode} onClose={handleClose} />

                {isLoading ? (
                  <LoadingIndicator />
                ) : (
                  <>
                    <TokenForm
                      formData={formData}
                      setFormData={setFormData}
                      errors={errors}
                      isEditMode={isEditMode}
                      availableAccounts={availableAccounts}
                      groups={groups}
                      availableModels={availableModels}
                    />
                    <WarningNote />
                    <FormActions
                      isSubmitting={isSubmitting}
                      isEditMode={isEditMode}
                      onClose={handleClose}
                      onSubmit={handleSubmit}
                      canSubmit={!!currentAccount}
                    />
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
