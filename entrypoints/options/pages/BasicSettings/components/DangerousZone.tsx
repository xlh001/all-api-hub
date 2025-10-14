import { useState } from "react"

import { useUserPreferencesContext } from "~/contexts/UserPreferencesContext"

import { showResetToast } from "../utils/toastHelpers"

export default function DangerousZone() {
  const { resetToDefaults } = useUserPreferencesContext()
  const [isResetting, setIsResetting] = useState(false)

  const handleResetToDefaults = async () => {
    setIsResetting(true)
    const success = await resetToDefaults()
    showResetToast(success)
    setIsResetting(false)
  }

  return (
    <section>
      <h2 className="text-lg font-medium text-red-600 dark:text-red-400 mb-4">
        危险操作
      </h2>
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
              重置所有设置
            </h3>
            <p className="text-sm text-red-600 dark:text-red-300 mt-1">
              将所有配置重置为默认值，此操作不可撤销
            </p>
          </div>
          <button
            onClick={handleResetToDefaults}
            disabled={isResetting}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {isResetting ? "重置中..." : "重置设置"}
          </button>
        </div>
      </div>
    </section>
  )
}
