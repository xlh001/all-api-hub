import { Fragment } from "react"
import { Transition, TransitionChild } from "@headlessui/react"
import {
  GlobeAltIcon,
  InformationCircleIcon,
  PencilIcon,
  XMarkIcon
} from "@heroicons/react/24/outline"
import type { DisplaySiteData } from "../../types"

interface UrlInputProps {
  url: string
  isDetected: boolean
  currentTabUrl: string | null
  isCurrentSiteAdded?: boolean
  detectedAccount?: DisplaySiteData | null
  onUrlChange: (url: string) => void
  onClearUrl: () => void
  onUseCurrentTab: () => void
  onEditAccount?: (account: DisplaySiteData) => void
}

export default function UrlInput({
  url,
  isDetected,
  currentTabUrl,
  isCurrentSiteAdded,
  detectedAccount,
  onUrlChange,
  onClearUrl,
  onUseCurrentTab,
  onEditAccount
}: UrlInputProps) {
  return (
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
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://example.com"
          className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          required
          disabled={isDetected}
        />
        {url && (
          <button
            type="button"
            onClick={onClearUrl}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isDetected}>
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>
      <p className="mt-2 text-xs text-gray-500">
        请输入 One API 或 New API 站点的完整地址
      </p>

      {/* 已添加提示 */}
      <Transition
        show={isCurrentSiteAdded && !!currentTabUrl && !url}
        as={Fragment}>
        <TransitionChild
          as="div"
          enter="ease-out duration-300 delay-200"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100 translate-y-0"
          className="mt-2">
          <div className="flex items-center justify-between text-xs text-yellow-700 bg-yellow-50 p-2 rounded-md">
            <div className="flex items-center">
              <InformationCircleIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
              <span>当前站点已添加</span>
            </div>
            {onEditAccount && detectedAccount && (
              <button
                type="button"
                onClick={() => onEditAccount(detectedAccount)}
                className="flex items-center font-medium text-yellow-800 hover:text-yellow-900">
                <PencilIcon className="w-3 h-3 mr-1" />
                <span>立即编辑</span>
              </button>
            )}
          </div>
        </TransitionChild>
      </Transition>

      {/* 当前标签页 URL 提示 */}
      <Transition show={!!(currentTabUrl && !url)} as={Fragment}>
        <TransitionChild
          as="div"
          enter="ease-out duration-500 delay-500"
          enterFrom="opacity-0 translate-y-3 scale-90"
          enterTo="opacity-100 translate-y-0 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0 scale-100"
          leaveTo="opacity-0 translate-y-2 scale-95"
          className="mt-2">
          <button
            type="button"
            onClick={onUseCurrentTab}
            className="inline-flex items-center px-3 py-1.5 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md">
            <GlobeAltIcon className="w-3 h-3 mr-1.5 animate-pulse" />
            <span>
              使用当前: {currentTabUrl && new URL(currentTabUrl).host}
            </span>
          </button>
        </TransitionChild>
      </Transition>
    </div>
  )
}