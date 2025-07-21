import "./style.css"
import { useState } from "react"
import { Cog6ToothIcon, ChartBarIcon, ShieldCheckIcon } from "@heroicons/react/24/outline"

function IndexPopup() {
  const [isLoading, setIsLoading] = useState(false)

  const features = [
    {
      icon: ChartBarIcon,
      title: "API监控",
      description: "实时监控API调用状态和性能"
    },
    {
      icon: ShieldCheckIcon,
      title: "安全管理", 
      description: "统一管理API密钥和权限"
    },
    {
      icon: Cog6ToothIcon,
      title: "配置管理",
      description: "灵活的API配置和路由规则"
    }
  ]

  return (
    <div className="w-96 min-h-96 bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">One API Manager</h1>
              <p className="text-sm text-gray-500">统一API管理平台</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Welcome Message */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-medium text-gray-800 mb-2">欢迎使用</h2>
          <p className="text-sm text-gray-600">开始管理你的API服务</p>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
            >
              <div className="flex items-start space-x-3">
                <feature.icon className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm">{feature.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button 
          onClick={() => setIsLoading(!isLoading)}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium text-sm hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              连接中...
            </span>
          ) : (
            "开始使用"
          )}
        </button>

        {/* Footer Links */}
        <div className="flex justify-center space-x-6 mt-6 pt-4 border-t border-gray-200">
          <a 
            href="#" 
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            帮助文档
          </a>
          <a 
            href="#" 
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            设置
          </a>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup
