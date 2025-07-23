import { Fragment } from "react"
import toast from 'react-hot-toast'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import { ExclamationTriangleIcon, XMarkIcon, TrashIcon } from "@heroicons/react/24/outline"
import { accountStorage } from "../services/accountStorage"
import type { DisplaySiteData } from "../types"

interface DelAccountDialogProps {
  isOpen: boolean
  onClose: () => void
  account: DisplaySiteData | null
  onDeleted: () => void
}

export default function DelAccountDialog({ isOpen, onClose, account, onDeleted }: DelAccountDialogProps) {
  const handleDelete = async () => {
    if (!account) {
      return
    }

    try {
      console.log('准备删除账号:', { id: account.id, name: account.name })
      
      await toast.promise(
        accountStorage.deleteAccount(account.id),
        {
          loading: `正在删除账号 ${account.name}...`,
          success: (success) => {
            if (success) {
              onDeleted()
              onClose()
              return `账号 ${account.name} 删除成功!`
            } else {
              throw new Error('删除失败')
            }
          },
          error: (err) => {
            const errorMsg = err instanceof Error ? err.message : '未知错误'
            return `删除失败: ${errorMsg}`
          },
        }
      )
    } catch (error) {
      console.error('删除账号失败:', error)
    }
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        onClose={onClose}
        className="relative z-50"
      >
        {/* 背景遮罩动画 */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        </TransitionChild>
        
        {/* 居中容器 */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          {/* 弹窗面板动画 */}
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95 translate-y-4"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-4"
          >
            <DialogPanel className="w-full max-w-sm bg-white rounded-lg shadow-xl transform transition-all">
              {/* 头部 */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <TrashIcon className="w-4 h-4 text-white" />
                  </div>
                  <DialogTitle className="text-lg font-semibold text-gray-900">
                    删除账号
                  </DialogTitle>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* 内容区域 */}
              <div className="p-4">
                {/* 警告图标和信息 */}
                <div className="flex items-start space-x-3 mb-4">
                  <div className="flex-shrink-0">
                    <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      删除确认
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      您即将删除账号 <span className="font-medium text-gray-900">{account?.name}</span>。
                    </p>
                    <p className="text-sm text-gray-500">
                      请核对后确认是否删除此账号
                    </p>
                  </div>
                </div>

                {/* 账号信息显示 */}
                {account && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="text-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-500">站点名称：</span>
                        <span className="font-medium text-gray-900">{account.name}</span>
                      </div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-500">用户名：</span>
                        <span className="font-medium text-gray-900">{account.username}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">站点地址：</span>
                        <span className="font-medium text-gray-900 truncate ml-2 max-w-48" title={account.baseUrl}>
                          {account.baseUrl}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 按钮组 */}
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-pink-600 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
                  >
                    确认删除
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}