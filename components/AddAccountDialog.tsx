import { useState, useEffect, Fragment } from "react"
import { Dialog, DialogPanel, DialogTitle, Transition } from "@headlessui/react"
import { GlobeAltIcon, XMarkIcon, SparklesIcon, UserIcon, KeyIcon } from "@heroicons/react/24/outline"
import { accountStorage } from "../services/accountStorage"
import type { SiteAccount } from "../types"

interface AddAccountDialogProps {
  isOpen: boolean
  onClose: () => void
}

interface DetectedAccountInfo {
  username: string
  access_token: string
}

export default function AddAccountDialog({ isOpen, onClose }: AddAccountDialogProps) {
  const [url, setUrl] = useState("")
  const [isDetecting, setIsDetecting] = useState(false)
  const [siteName, setSiteName] = useState("")
  const [username, setUsername] = useState("")
  const [accessToken, setAccessToken] = useState("")
  const [isDetected, setIsDetected] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // 重置状态
      setIsDetected(false)
      setSiteName("")
      setUsername("")
      setAccessToken("")
      
      // 获取当前标签页的 URL
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.url) {
          try {
            const urlObj = new URL(tabs[0].url)
            const baseUrl = `${urlObj.protocol}//${urlObj.host}`
            setUrl(baseUrl)
            setSiteName(urlObj.host)
          } catch (error) {
            console.log('无法解析 URL:', error)
            setUrl("")
            setSiteName("")
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
      // 获取当前标签页
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
      const currentTab = tabs[0]
      
      if (!currentTab?.id) {
        throw new Error('无法获取当前标签页')
      }

      // 通过内容脚本获取用户信息
      const userResponse = await chrome.tabs.sendMessage(currentTab.id, {
        action: "getUserFromLocalStorage"
      })

      if (!userResponse.success) {
        throw new Error(userResponse.error)
      }

      const userId = userResponse.data.userId
      if (!userId) {
        throw new Error('无法获取用户 ID')
      }

      // 发起API请求获取用户信息
      const response = await fetch(`${url}/api/user/self`, {
        method: 'GET',
        headers: {
          'neo-api-user': userId.toString(),
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error(`API 请求失败: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.success || !data.data) {
        throw new Error('API 返回数据格式错误')
      }

      const { username: detectedUsername, access_token } = data.data
      
      if (!detectedUsername || !access_token) {
        throw new Error('未能获取到用户名或访问令牌')
      }

      // 更新表单数据
      setUsername(detectedUsername)
      setAccessToken(access_token)
      setIsDetected(true)
      
      console.log('自动识别成功:', { username: detectedUsername, siteName })
      
    } catch (error) {
      console.error('自动识别失败:', error)
      alert(`自动识别失败: ${error.message}`)
    } finally {
      setIsDetecting(false)
    }
  }

  const handleSaveAccount = async () => {
    if (!siteName.trim() || !username.trim() || !accessToken.trim()) {
      alert('请填写完整的账号信息')
      return
    }

    setIsSaving(true)
    
    try {
      const accountData: Omit<SiteAccount, 'id' | 'created_at' | 'updated_at'> = {
        emoji: "", // 不再使用 emoji
        site_name: siteName.trim(),
        site_url: url.trim(),
        health_status: 'unknown', // 初始状态为未知
        exchange_rate: 7.2, // 默认汇率
        account_info: {
          access_token: accessToken.trim(),
          username: username.trim(),
          quota: 0, // 初始值，后续会通过 API 更新
          today_prompt_tokens: 0,
          today_completion_tokens: 0,
          today_quota_consumption: 0,
          today_requests_count: 0
        },
        last_sync_time: Date.now()
      }
      
      const accountId = await accountStorage.addAccount(accountData)
      console.log('账号添加成功:', { id: accountId, siteName })
      
      alert('账号添加成功！')
      onClose()
    } catch (error) {
      console.error('保存账号失败:', error)
      alert(`保存失败: ${error instanceof Error ? error.message : '未知错误'}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isDetected) {
      handleSaveAccount()
    } else {
      handleAutoDetect()
    }
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
                        disabled={isDetected}
                      />
                      {url && (
                        <button
                          type="button"
                          onClick={() => setUrl('')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                          disabled={isDetected}
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      请输入 One API 或 New API 站点的完整地址
                    </p>
                  </div>


                  {/* 识别成功后的表单 */}
                  {isDetected && (
                    <>
                      {/* 网站名称 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          网站名称
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <GlobeAltIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            value={siteName}
                            onChange={(e) => setSiteName(e.target.value)}
                            placeholder="example.com"
                            className="block w-full pl-10 py-3 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            required
                          />
                        </div>
                      </div>

                      {/* 用户名 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          用户名
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="用户名"
                            className="block w-full pl-10 py-3 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            required
                          />
                        </div>
                      </div>

                      {/* 访问令牌 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          访问令牌
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <KeyIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="password"
                            value={accessToken}
                            onChange={(e) => setAccessToken(e.target.value)}
                            placeholder="访问令牌"
                            className="block w-full pl-10 py-3 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* 按钮组 */}
                  <div className="flex space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      取消
                    </button>
                    {isDetected ? (
                      <button
                        type="submit"
                        disabled={!siteName.trim() || !username.trim() || !accessToken.trim() || isSaving}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                      >
                        {isSaving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>保存中...</span>
                          </>
                        ) : (
                          <>
                            <SparklesIcon className="w-4 h-4" />
                            <span>确认添加</span>
                          </>
                        )}
                      </button>
                    ) : (
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
                    )}
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
                        {isDetected ? '账号信息确认' : '自动识别功能'}
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          {isDetected 
                            ? '请确认账号信息无误后点击"确认添加"按钮。账号将被安全地保存在本地存储中。'
                            : '插件将自动检测站点类型，从浏览器中读取登录信息，并获取访问令牌。支持 One API 和 New API 等兼容站点。'
                          }
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