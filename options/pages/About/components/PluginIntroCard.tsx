import iconImage from "~/assets/icon.png"
import { ABOUT_INTRO } from "~/constants/about"

export interface PluginIntroCardProps {
  version: string
}

const PluginIntroCard = ({ version }: PluginIntroCardProps) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-start space-x-4">
        <img
          src={iconImage}
          alt="All API Hub"
          className="w-16 h-16 rounded-lg shadow-sm flex-shrink-0"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">All API Hub</h2>
          <p className="text-gray-600 mb-4">{ABOUT_INTRO}</p>
          <div className="text-sm">
            <div>
              <span className="text-gray-500">版本号:</span>
              <span className="ml-2 font-medium text-gray-900">v{version}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PluginIntroCard
