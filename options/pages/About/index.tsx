import {
  CodeBracketIcon,
  GlobeAltIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline"

import FeatureList from "~/components/FeatureList"
import LinkCard from "~/components/LinkCard"
import { FEATURES, FUTURE_FEATURES } from "~/constants/about"
import CreditsCard from "~/options/pages/About/components/CreditsCard"
import PluginIntroCard from "~/options/pages/About/components/PluginIntroCard"
import PrivacyNotice from "~/options/pages/About/components/PrivacyNotice"
import TechStackGrid from "~/options/pages/About/components/TechStackGrid"
import packageJson from "~/package.json"
import { getHomepage, getPkgVersion, getRepository } from "~/utils/packageMeta"

export default function About() {
  const version = packageJson.version

  // 从工具函数获取元数据
  const homepage = getHomepage()
  const repository = getRepository()

  // 技术栈版本动态化
  const techStack = [
    {
      name: "Plasmo",
      version: getPkgVersion("plasmo"),
      description: "浏览器扩展开发框架"
    },
    {
      name: "React",
      version: getPkgVersion("react"),
      description: "用户界面库"
    },
    {
      name: "TypeScript",
      version: getPkgVersion("typescript"),
      description: "类型安全的JavaScript"
    },
    {
      name: "Tailwind CSS",
      version: getPkgVersion("tailwindcss"),
      description: "原子化CSS框架"
    },
    {
      name: "Headless UI",
      version: getPkgVersion("@headlessui/react"),
      description: "无样式UI组件"
    }
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

      <div className="space-y-6">
        {/* 插件信息 */}
        <section>
          <PluginIntroCard version={version} />
        </section>

        {/* 项目链接 */}
        <section>
          <h2 className="text-lg font-medium text-gray-900 mb-4">项目链接</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LinkCard
              Icon={CodeBracketIcon}
              title="GitHub 仓库"
              description="查看源代码、提交问题或参与项目开发"
              href={repository}
              buttonText="去点个Star"
              buttonClass="bg-gray-900 text-white hover:bg-gray-800"
              iconClass="text-gray-900"
            />
            <LinkCard
              Icon={GlobeAltIcon}
              title="项目官网"
              description="查看详细文档、使用指南和更多信息"
              href={homepage}
              buttonText="访问官网"
              buttonClass="bg-blue-600 text-white hover:bg-blue-700"
              iconClass="text-blue-600"
            />
          </div>
        </section>

        {/* 功能特性 */}
        <section>
          <h2 className="text-lg font-medium text-gray-900 mb-4">功能特性</h2>
          <div className="space-y-6">
            {/* 主要功能 */}
            <FeatureList title="已实现功能" items={FEATURES} color="green" />

            {/* 未来功能 */}
            <FeatureList
              title="即将支持"
              items={FUTURE_FEATURES}
              color="blue"
            />
          </div>
        </section>

        {/* 技术栈 */}
        <section>
          <h2 className="text-lg font-medium text-gray-900 mb-4">技术栈</h2>
          <TechStackGrid items={techStack} />
        </section>

        {/* 版权和致谢 */}
        <section>
          <h2 className="text-lg font-medium text-gray-900 mb-4">版权与致谢</h2>
          <CreditsCard />
        </section>

        {/* 隐私声明 */}
        <section>
          <PrivacyNotice />
        </section>
      </div>
    </div>
  )
}
