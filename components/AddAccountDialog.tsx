import { useState, useEffect, Fragment } from "react"
import { Dialog, DialogPanel, DialogTitle, Transition } from "@headlessui/react"
import { GlobeAltIcon, XMarkIcon, SparklesIcon } from "@heroicons/react/24/outline"

interface AddAccountDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddAccountDialog({ isOpen, onClose }: AddAccountDialogProps) {
  const [url, setUrl] = useState("")
  const [isDetecting, setIsDetecting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // 获取当前标签页的 URL
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.url) {
          try {
            const urlObj = new URL(tabs[0].url)
            const baseUrl = `${urlObj.protocol}//${urlObj.host}`
            setUrl(baseUrl)
          } catch (error) {
            console.log('无法解析 URL:', error)
            setUrl("")
          }
        }
      })
    }
  }, [isOpen])

  const handleAutoDetect = async () => {
    if (!url.trim()) {
      return
    }

    setIsDetecting(true)
    
    try {
      // TODO: 实现自动识别逻辑
      // 这里应该向指定的 URL 发送请求，检测是否为 one-api 站点
      await new Promise(resolve => setTimeout(resolve, 1500)) // 模拟API调用
      
      // 模拟识别成功，这里应该调用实际的添加账号逻辑
      console.log('识别站点:', url)
      
      // 关闭弹窗
      onClose()
    } catch (error) {
      console.error('识别失败:', error)
    } finally {
      setIsDetecting(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleAutoDetect()
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        onClose={onClose}
        className="relative z-50"
      >
        {/* 背景遮罩动画 */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        </Transition.Child>
        
        {/* 居中容器 */}
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          {/* 弹窗面板动画 */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95 translate-y-4"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-4"
          >
            <DialogPanel className="mx-auto max-w-md w-full bg-white rounded-xl shadow-xl transform transition-all">
              {/* 头部 */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <SparklesIcon className="w-4 h-4 text-white" />
                  </div>
                  <DialogTitle className="text-lg font-semibold text-gray-900">
                    新增账号
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
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* URL 输入框 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      站点地址
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <GlobeAltIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        required
                      />
                      {url && (
                        <button
                          type="button"
                          onClick={() => setUrl('')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      请输入 One API 或 New API 站点的完整地址
                    </p>
                  </div>

                  {/* 按钮组 */}
                  <div className="flex space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      disabled={!url.trim() || isDetecting}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      {isDetecting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>识别中...</span>
                        </>
                      ) : (
                        <>
                          <SparklesIcon className="w-4 h-4" />
                          <span>自动识别</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* 提示信息 */}
              <div className="px-6 pb-6">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <SparklesIcon className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        自动识别功能
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          插件将自动检测站点类型，创建访问令牌并添加到站点列表中。支持 One API 和 New API 等兼容站点。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}