import { HeartIcon } from "@heroicons/react/24/outline"

const CreditsCard = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-start space-x-4">
        <HeartIcon className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-2">开发与维护</h3>
          <p className="text-sm text-gray-600 mb-4">
            感谢所有为开源社区做出贡献的开发者们，本插件的开发得益于这些优秀的开源项目和工具。
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Made with ❤️
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Open Source
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Privacy First
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreditsCard
