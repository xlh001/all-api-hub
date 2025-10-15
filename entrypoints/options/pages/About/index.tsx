import {
  CodeBracketIcon,
  GlobeAltIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import FeatureList from "~/components/FeatureList"
import LinkCard from "~/components/LinkCard"
import { FEATURES, FUTURE_FEATURES } from "~/constants/about"
import packageJson from "~/package.json"
import { getHomepage, getPkgVersion, getRepository } from "~/utils/packageMeta"

import CreditsCard from "./components/CreditsCard"
import PluginIntroCard from "./components/PluginIntroCard"
import PrivacyNotice from "./components/PrivacyNotice"
import TechStackGrid from "./components/TechStackGrid"

export default function About() {
  const { t } = useTranslation()
  const version = packageJson.version

  // 从工具函数获取元数据
  const homepage = getHomepage()
  const repository = getRepository()

  // 技术栈版本动态化
  const techStack = [
    {
      name: "WXT",
      version: getPkgVersion("wxt"),
      description: t("about.techStack.wxt", "浏览器扩展开发框架")
    },
    {
      name: "React",
      version: getPkgVersion("react"),
      description: t("about.techStack.react", "用户界面库")
    },
    {
      name: "TypeScript",
      version: getPkgVersion("typescript"),
      description: t("about.techStack.typescript", "类型安全的JavaScript")
    },
    {
      name: "Tailwind CSS",
      version: getPkgVersion("tailwindcss"),
      description: t("about.techStack.tailwindcss", "原子化CSS框架")
    },
    {
      name: "Headless UI",
      version: getPkgVersion("@headlessui/react"),
      description: t("about.techStack.headlessui", "无样式UI组件")
    }
  ]

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <InformationCircleIcon className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-dark-text-primary">
            {t("about.title")}
          </h1>
        </div>
        <p className="text-gray-500 dark:text-dark-text-secondary">
          {t("about.intro")}
        </p>
      </div>

      <div className="space-y-6">
        {/* 插件信息 */}
        <section>
          <PluginIntroCard version={version} />
        </section>

        {/* 项目链接 */}
        <section>
          <h2 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary mb-4">
            {t("about.projectLinks")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LinkCard
              Icon={CodeBracketIcon}
              title={t("about.githubRepo")}
              description={t("about.githubDesc")}
              href={repository}
              buttonText={t("about.starRepo")}
              buttonClass="bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600"
              iconClass="text-gray-900 dark:text-gray-100"
            />
            <LinkCard
              Icon={GlobeAltIcon}
              title={t("about.homepage")}
              description={t("about.homepageDesc")}
              href={homepage}
              buttonText={t("about.visitHomepage")}
              buttonClass="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-400"
              iconClass="text-blue-600 dark:text-blue-400"
            />
          </div>
        </section>

        {/* 功能特性 */}
        {isNotEmptyArray(FEATURES) && isNotEmptyArray(FUTURE_FEATURES) && (
          <section>
            <h2 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary mb-4">
              {t("about.features")}
            </h2>
            <div className="space-y-6">
              {/* 主要功能 */}
              <FeatureList
                title={t("about.implementedFeatures")}
                items={FEATURES}
                color="green"
              />

              {/* 未来功能 */}
              <FeatureList
                title={t("about.upcomingFeatures")}
                items={FUTURE_FEATURES}
                color="blue"
              />
            </div>
          </section>
        )}

        {/* 技术栈 */}
        <section>
          <h2 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary mb-4">
            {t("about.techStack")}
          </h2>
          <TechStackGrid items={techStack} />
        </section>

        {/* 版权和致谢 */}
        <section>
          <h2 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary mb-4">
            {t("about.copyrightAck")}
          </h2>
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
