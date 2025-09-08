import {
  CodeBracketIcon,
  GlobeAltIcon,
  HeartIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline"

import iconImage from "../../assets/icon.png"
import packageJson from "../../package.json"

export default function About() {
  const version = packageJson.version

  const features = [
    "自动识别中转站点，自动创建系统访问 token",
    "每个站点可添加多个账号",
    "账号的余额、使用日志进行查看",
    "密钥(key)查看与管理",
    "站点支持模型信息和渠道查看",
    "插件无需联网，保护隐私安全"
  ]

  const futureFeatures = [
    "模型降智测试",
    "WebDAV 数据备份",
    "更多API站点支持",
    "高级统计分析功能"
  ]

  const techStack = [
    { name: "Plasmo", version: "0.90.5", description: "浏览器扩展开发框架" },
    { name: "React", version: "18.2.0", description: "用户界面库" },
    {
      name: "TypeScript",
      version: "5.3.3",
      description: "类型安全的JavaScript"
    },
    { name: "Tailwind CSS", version: "3.4.17", description: "原子化CSS框架" },
    { name: "Headless UI", version: "2.2.4", description: "无样式UI组件" }
  ]

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <InformationCircleIcon className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-semibold text-gray-900">关于</h1>
        </div>
        <p className="text-gray-500">了解插件信息和开发团队</p>
      </div>

      <div className="space-y-8">
        {/* 插件信息 */}
        <section>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <img
                src={iconImage}
                alt="All API Hub"
                className="w-16 h-16 rounded-lg shadow-sm flex-shrink-0"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  All API Hub
                </h2>
                <p className="text-gray-600 mb-4">
                  AI 中转站账号管理插件，帮助用户便捷地管理多个AI
                  API中转站点的账号。
                </p>
                <div className="text-sm">
                  <div>
                    <span className="text-gray-500">版本号:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      v{version}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 项目链接 */}
        <section>
          <h2 className="text-lg font-medium text-gray-900 mb-4">项目链接</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <CodeBracketIcon className="w-6 h-6 text-gray-900 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-2">
                    GitHub 仓库
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    查看源代码、提交问题或参与项目开发
                  </p>
                  <a
                    href="https://github.com/qixing-jk/all-api-hub"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors">
                    去点个Star
                  </a>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <GlobeAltIcon className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-2">项目官网</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    查看详细文档、使用指南和更多信息
                  </p>
                  <a
                    href="https://qixing-jk.github.io/all-api-hub/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                    访问官网
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 功能特性 */}
        <section>
          <h2 className="text-lg font-medium text-gray-900 mb-4">功能特性</h2>
          <div className="space-y-6">
            {/* 主要功能 */}
            <div>
              <h3 className="text-base font-medium text-gray-800 mb-3 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                已实现功能
              </h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-2 text-sm text-green-800">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 未来功能 */}
            <div>
              <h3 className="text-base font-medium text-gray-800 mb-3 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                即将支持
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <ul className="space-y-2">
                  {futureFeatures.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-2 text-sm text-blue-800">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 技术栈 */}
        <section>
          <h2 className="text-lg font-medium text-gray-900 mb-4">技术栈</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{tech.name}</h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    v{tech.version}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{tech.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 版权和致谢 */}
        <section>
          <h2 className="text-lg font-medium text-gray-900 mb-4">版权与致谢</h2>
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
        </section>

        {/* 隐私声明 */}
        <section>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <InformationCircleIcon className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-green-800 font-medium mb-1">隐私保护</p>
                <p className="text-green-700">
                  本插件所有数据均存储在本地浏览器中，不会上传到任何服务器。
                  您的账号信息和使用数据完全由您自己掌控，确保隐私安全。
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
