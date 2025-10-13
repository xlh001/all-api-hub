import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild
} from "@headlessui/react"
import { Fragment } from "react"
import toast from "react-hot-toast"

import { accountStorage } from "~/services/accountStorage"
import type { DisplaySiteData } from "~/types"

import { AccountInfo } from "./AccountInfo"
import { ActionButtons } from "./ActionButtons"
import { DialogHeader } from "./DialogHeader"
import { WarningSection } from "./WarningSection"

interface DelAccountDialogProps {
  isOpen: boolean
  onClose: () => void
  account: DisplaySiteData | null
  onDeleted: () => void
}

export default function DelAccountDialog({
  isOpen,
  onClose,
  account,
  onDeleted
}: DelAccountDialogProps) {
  const handleDelete = async () => {
    if (!account) return

    try {
      await toast.promise(accountStorage.deleteAccount(account.id), {
        loading: `正在删除账号 ${account.name}...`,
        success: (isSuccess) => {
          if (!isSuccess) {
            throw new Error("删除操作未成功返回")
          }
          onDeleted()
          onClose()
          return `账号 ${account.name} 删除成功!`
        },
        error: (err: Error) => `删除失败: ${err.message || "未知错误"}`
      })
    } catch (error) {
      // toast.promise already handles showing the error toast
      console.error("删除账号失败:", error)
    }
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
            leave="ease-in duration-20"
            leaveFrom="opacity-10 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-4">
            <DialogPanel className="w-full max-w-md transform rounded-lg bg-white shadow-xl transition-all">
              <DialogHeader onClose={onClose} />
              <div className="p-4">
                <WarningSection accountName={account?.name} />
                {account && <AccountInfo account={account} />}
                <ActionButtons onClose={onClose} onDelete={handleDelete} />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}
