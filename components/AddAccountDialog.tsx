import { useState, useEffect, Fragment } from "react"
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import { GlobeAltIcon, XMarkIcon, SparklesIcon, UserIcon, KeyIcon, EyeIcon, EyeSlashIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline"
import { accountStorage } from "../services/accountStorage"
import { fetchAccountData, getOrCreateAccessToken } from "../services/apiService"
import type { SiteAccount } from "../types"

interface AddAccountDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddAccountDialog({ isOpen, onClose }: AddAccountDialogProps) {
  const [url, setUrl] = useState("")
  const [isDetecting, setIsDetecting] = useState(false)
  const [siteName, setSiteName] = useState("")
  const [username, setUsername] = useState("")
  const [accessToken, setAccessToken] = useState("")
  const [userId, setUserId] = useState("")
  const [isDetected, setIsDetected] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showAccessToken, setShowAccessToken] = useState(false)
  const [detectionError, setDetectionError] = useState<string | null>(null)
  const [showManualForm, setShowManualForm] = useState(false)
  const [exchangeRate, setExchangeRate] = useState("")

  // 验证充值比例是否有效
  const isValidExchangeRate = (rate: string): boolean => {
    const num = parseFloat(rate)
    return !isNaN(num) && num > 0 && num <= 100
  }

  // 提取域名的主要部分（一级域名前缀）
  const extractDomainPrefix = (hostname: string): string => {
    if (!hostname) return ""
    
    // 移除 www. 前缀
    const withoutWww = hostname.replace(/^www\./, "")
    
    // 处理子域名情况，例如：xxx.xx.google.com -> google
    const parts = withoutWww.split(".")
    if (parts.length >= 2) {
      // 如果是常见的二级域名（如 .com.cn, .co.uk 等），取倒数第三个部分
      const lastPart = parts[parts.length - 1]
      const secondLastPart = parts[parts.length - 2]
      
      // 检查是否为双重后缀
      const doubleSuffixes = ['com', 'net', 'org', 'gov', 'edu', 'co']
      if (parts.length >= 3 && doubleSuffixes.includes(secondLastPart) && lastPart.length === 2) {
        // 首字母大写
        return parts[parts.length - 3].charAt(0).toUpperCase() + parts[parts.length - 3].slice(1)
      }
      
      // 否则返回倒数第二个部分
      return secondLastPart.charAt(0).toUpperCase() + secondLastPart.slice(1)
    }
    
    return withoutWww.charAt(0).toUpperCase() + withoutWww.slice(1)
  }

  useEffect(() => {
    if (isOpen) {
      // 重置状态
      setIsDetected(false)
      setSiteName("")
      setUsername("")
      setAccessToken("")
      setUserId("")
      setShowAccessToken(false)
      setDetectionError(null)
      setShowManualForm(false)
      setExchangeRate("")
      
      // 获取当前标签页的 URL 作为初始参考
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.url) {
          try {
            const urlObj = new URL(tabs[0].url)
            const baseUrl = `${urlObj.protocol}//${urlObj.host}`
            // 如果站点不是以http开头，则不处理（可能为空白页）
            if (!baseUrl.startsWith('http')) {
              return
            }
            setUrl(baseUrl)
            // 设置站点名称为域名前缀
            const domainPrefix = extractDomainPrefix(urlObj.hostname)
            setSiteName(domainPrefix)
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
    setDetectionError(null)
    
    try {
      // 生成唯一的请求ID
      const requestId = `auto-detect-${Date.now()}`
      
      // 尝试通过 background script 自动打开窗口并获取信息
      const response = await chrome.runtime.sendMessage({
        action: "autoDetectSite",
        url: url.trim(),
        requestId: requestId
      })

      if (!response.success) {
        // 如果自动检测失败，回退到手动方式
        console.log('自动检测失败，尝试当前标签页方式:', response.error)
        setDetectionError('自动检测失败，请手动输入信息或确保已在目标站点登录')
        setShowManualForm(true)
        return
      }

      const userId = response.data.userId
      if (!userId) {
        throw new Error('无法获取用户 ID')
      }

      // 发起API请求获取用户信息
      const { username: detectedUsername, access_token } = await getOrCreateAccessToken(url, userId)
      
      if (!detectedUsername || !access_token) {
        throw new Error('未能获取到用户名或访问令牌')
      }

      // 更新表单数据
      setUsername(detectedUsername)
      setAccessToken(access_token)
      setUserId(userId.toString())
      setIsDetected(true)
      
      console.log('自动识别成功:', { username: detectedUsername, siteName })
      
    } catch (error) {
      console.error('自动识别失败:', error)
      const errorMessage = error instanceof Error ? error.message : '未知错误'
      setDetectionError(`自动识别失败: ${errorMessage}`)
      setShowManualForm(true) // 识别失败后显示手动表单
    } finally {
      setIsDetecting(false)
    }
  }


  const handleSaveAccount = async () => {
    if (!siteName.trim() || !username.trim() || !accessToken.trim() || !userId.trim()) {
      alert('请填写完整的账号信息')
      return
    }

    const parsedUserId = parseInt(userId.trim())
    if (isNaN(parsedUserId)) {
      alert('用户 ID 必须是数字')
      return
    }

    setIsSaving(true)
    
    try {
      // 获取账号余额和今日使用情况
      console.log('正在获取账号数据...')
      const freshAccountData = await fetchAccountData(url.trim(), parsedUserId, accessToken.trim())

      const accountData: Omit<SiteAccount, 'id' | 'created_at' | 'updated_at'> = {
        emoji: "", // 不再使用 emoji
        site_name: siteName.trim(),
        site_url: url.trim(),
        health_status: 'healthy', // 成功获取数据说明状态正常
        exchange_rate: parseFloat(exchangeRate) || 7.2, // 使用用户输入的汇率
        account_info: {
          id: parsedUserId,
          access_token: accessToken.trim(),
          username: username.trim(),
          quota: freshAccountData.quota,
          today_prompt_tokens: freshAccountData.today_prompt_tokens,
          today_completion_tokens: freshAccountData.today_completion_tokens,
          today_quota_consumption: freshAccountData.today_quota_consumption,
          today_requests_count: freshAccountData.today_requests_count
        },
        last_sync_time: Date.now()
      }
      
      const accountId = await accountStorage.addAccount(accountData)
      console.log('账号添加成功:', { 
        id: accountId, 
        siteName, 
        freshAccountData 
      })
      
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
    if (isDetected || showManualForm) {
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
        
        {/* 居中容器 - 针对插件优化 */}
        <div className="fixed inset-0 flex items-center justify-center p-2">
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
            <DialogPanel className="w-full max-w-sm bg-white rounded-lg shadow-xl transform transition-all max-h-[90vh] overflow-y-auto">
              {/* 头部 */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
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
              <div className="p-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 识别错误提示 */}
                  {detectionError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <XMarkIcon className="h-4 w-4 text-red-400" />
                        </div>
                        <div className="ml-2">
                          <p className="text-xs text-red-700">{detectionError}</p>
                        </div>
                      </div>
                    </div>
                  )}

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
                        onChange={(e) => {
                          const inputUrl = e.target.value
                          
                          // 当用户输入 URL 时，提取协议和主机部分
                          if (inputUrl.trim()) {
                            try {
                              const urlObj = new URL(inputUrl)
                              // 只保留协议和主机部分，不带路径
                              const baseUrl = `${urlObj.protocol}//${urlObj.host}`
                              setUrl(baseUrl)
                              
                              // 自动更新站点名称
                              const domainPrefix = extractDomainPrefix(urlObj.hostname)
                              setSiteName(domainPrefix)
                            } catch (error) {
                              // 如果 URL 格式不完整，先保存用户输入，但尝试提取域名
                              setUrl(inputUrl)
                              const match = inputUrl.match(/\/\/([^\/]+)/)
                              if (match) {
                                const domainPrefix = extractDomainPrefix(match[1])
                                setSiteName(domainPrefix)
                              }
                            }
                          } else {
                            setUrl("")
                            setSiteName("")
                          }
                        }}
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


                  {/* 识别成功后的表单或手动添加表单 */}
                  {(isDetected || showManualForm) && (
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

                      {/* 用户 ID */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          用户 ID
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-400 font-mono text-sm">#</span>
                          </div>
                          <input
                            type="number"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="用户 ID (数字)"
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
                            type={showAccessToken ? "text" : "password"}
                            value={accessToken}
                            onChange={(e) => setAccessToken(e.target.value)}
                            placeholder="访问令牌"
                            className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowAccessToken(!showAccessToken)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showAccessToken ? (
                              <EyeSlashIcon className="h-4 w-4" />
                            ) : (
                              <EyeIcon className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* 充值金额比例 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          充值金额比例 (CNY/USD)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            max="100"
                            value={exchangeRate}
                            onChange={(e) => setExchangeRate(e.target.value)}
                            placeholder="7.2"
                            className={`block w-full pl-10 py-3 border rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                              isValidExchangeRate(exchangeRate) 
                                ? 'border-gray-200 focus:ring-blue-500 focus:border-transparent' 
                                : 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            }`}
                            required
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-sm text-gray-500">CNY</span>
                          </div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          表示充值 1 美元需要多少人民币，例如 7.2 表示 7.2 元人民币 = 1 美元
                        </p>
                        {!isValidExchangeRate(exchangeRate) && exchangeRate && (
                          <p className="mt-1 text-xs text-red-600">
                            请输入有效的汇率 (0.1 - 100)
                          </p>
                        )}
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
                        disabled={!siteName.trim() || !username.trim() || !accessToken.trim() || !userId.trim() || !isValidExchangeRate(exchangeRate) || isSaving}
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
                    ) : showManualForm ? (
                      <button
                        type="submit"
                        disabled={!siteName.trim() || !username.trim() || !accessToken.trim() || !userId.trim() || !isValidExchangeRate(exchangeRate) || isSaving}
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
                            <span>手动添加</span>
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
                  
                  {/* 手动添加按钮 - 在自动识别失败后显示 */}
                  {!isDetected && !showManualForm && detectionError && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setShowManualForm(true)}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        <UserIcon className="w-4 h-4" />
                        <span>手动添加账号信息</span>
                      </button>
                    </div>
                  )}
                </form>
              </div>

              {/* 提示信息 */}
              <div className="px-4 pb-4">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <SparklesIcon className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-xs font-medium text-blue-800">
                        {isDetected ? '账号信息确认' : showManualForm ? '手动添加' : '自动识别'}
                      </h3>
                      <div className="mt-1 text-xs text-blue-700">
                        <p>
                          {isDetected 
                            ? '请确认账号信息无误后点击"确认添加"按钮。'
                            : showManualForm
                            ? '请手动填写账号信息。账号将被安全地保存在本地存储中。'
                            : '插件将自动检测站点类型，如果浏览器在此站点保持了登录状态，则自动获取访问令牌。'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}