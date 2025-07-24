import { Fragment, useState, useEffect } from "react"
import toast from 'react-hot-toast'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import { 
  XMarkIcon, 
  KeyIcon, 
  DocumentDuplicateIcon, 
  ExclamationTriangleIcon,
  CheckIcon
} from "@heroicons/react/24/outline"
import { UI_CONSTANTS } from "../constants/ui"
import { fetchAccountTokens, type ApiToken } from "../services/apiService"
import type { DisplaySiteData } from "../types"

interface CopyKeyDialogProps {
  isOpen: boolean
  onClose: () => void
  account: DisplaySiteData | null
}

export default function CopyKeyDialog({ isOpen, onClose, account }: CopyKeyDialogProps) {
  const [tokens, setTokens] = useState<ApiToken[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // 获取令牌列表
  const fetchTokens = async () => {
    if (!account) return

    setIsLoading(true)
    setError(null)
    
    try {
      // 使用 DisplaySiteData 中的 userId 字段
      const tokens = await fetchAccountTokens(account.baseUrl, account.userId, account.token)
      setTokens(tokens)
    } catch (error) {
      console.error('获取令牌列表失败:', error)
      const errorMessage = error instanceof Error ? error.message : '未知错误'
      setError(`获取令牌列表失败: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  // 当对话框打开时获取令牌列表
  useEffect(() => {
    if (isOpen && account) {
      fetchTokens()
    } else {
      // 关闭时重置状态
      setTokens([])
      setError(null)
      setCopiedKey(null)
    }
  }, [isOpen, account])

  // 复制密钥到剪贴板
  const copyKey = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key)
      setCopiedKey(key)
      toast.success('密钥已复制到剪贴板')
      
      // 2秒后清除复制状态
      setTimeout(() => {
        setCopiedKey(null)
      }, 2000)
    } catch (error) {
      console.error('复制失败:', error)
      toast.error('复制失败，请手动复制')
    }
  }

  // 格式化额度显示
  const formatQuota = (token: ApiToken) => {
    if (token.unlimited_quota || token.remain_quota < 0) {
      return '无限额度'
    }
    
    // 使用CONVERSION_FACTOR转换真实额度
    const realQuota = token.remain_quota / UI_CONSTANTS.EXCHANGE_RATE.CONVERSION_FACTOR
    return `$${realQuota.toFixed(2)}`
  }

  // 格式化已用额度
  const formatUsedQuota = (token: ApiToken) => {
    const realUsedQuota = token.used_quota / UI_CONSTANTS.EXCHANGE_RATE.CONVERSION_FACTOR
    return `$${realUsedQuota.toFixed(2)}`
  }

  // 格式化时间
  const formatTime = (timestamp: number) => {
    if (timestamp <= 0) return '永不过期'
    return new Date(timestamp * 1000).toLocaleDateString('zh-CN')
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
            <DialogPanel className="w-full max-w-lg bg-white rounded-lg shadow-xl transform transition-all max-h-[80vh] overflow-hidden flex flex-col">
              {/* 头部 */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <KeyIcon className="w-4 h-4 text-white" />
                  </div>
                  <DialogTitle className="text-lg font-semibold text-gray-900">
                    {account?.name} - 令牌列表
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
              <div className="flex-1 overflow-y-auto p-4">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-8 h-8 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin mb-4" />
                    <p className="text-sm text-gray-500">正在获取令牌列表...</p>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">获取失败</h3>
                        <p className="text-sm text-red-700 mt-1">{error}</p>
                        <button
                          onClick={fetchTokens}
                          className="mt-3 px-3 py-1.5 bg-red-100 text-red-800 text-xs rounded-lg hover:bg-red-200 transition-colors"
                        >
                          重试
                        </button>
                      </div>
                    </div>
                  </div>
                ) : tokens.length === 0 ? (
                  <div className="text-center py-8">
                    <KeyIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">暂无令牌数据</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tokens.map((token) => (
                      <div
                        key={token.id}
                        className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm truncate">
                              {token.name}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              组别: {token.group}
                            </p>
                          </div>
                          <button
                            onClick={() => copyKey(token.key)}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-purple-500 text-white text-xs rounded-lg hover:bg-purple-600 transition-colors"
                          >
                            {copiedKey === token.key ? (
                              <>
                                <CheckIcon className="w-3 h-3" />
                                <span>已复制</span>
                              </>
                            ) : (
                              <>
                                <DocumentDuplicateIcon className="w-3 h-3" />
                                <span>复制</span>
                              </>
                            )}
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-gray-500">已用额度:</span>
                            <span className="ml-2 font-medium text-gray-900">
                              {formatUsedQuota(token)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">剩余额度:</span>
                            <span className="ml-2 font-medium text-gray-900">
                              {formatQuota(token)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">状态:</span>
                            <span className={`ml-2 font-medium ${
                              token.status === 1 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {token.status === 1 ? '启用' : '禁用'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">过期时间:</span>
                            <span className="ml-2 font-medium text-gray-900">
                              {formatTime(token.expired_time)}
                            </span>
                          </div>
                        </div>

                        {/* 密钥预览（部分显示） */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <span className="text-gray-500 text-xs">密钥:</span>
                          <div className="mt-1 font-mono text-xs text-gray-700 bg-white p-2 rounded border break-all">
                            {token.key.substring(0, 20)}...{token.key.substring(token.key.length - 8)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 底部操作区 */}
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    {tokens.length > 0 && `共 ${tokens.length} 个令牌`}
                  </p>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    关闭
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