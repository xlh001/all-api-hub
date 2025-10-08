import { Switch } from "@headlessui/react"

interface RefreshSettingsProps {
  autoRefresh: boolean
  refreshOnOpen: boolean
  intervalInput: string
  minIntervalInput: string
  handleAutoRefreshChange: (enabled: boolean) => void
  handleRefreshOnOpenChange: (enabled: boolean) => void
  handleRefreshIntervalChange: (value: string) => void
  handleRefreshIntervalBlur: () => void
  handleMinRefreshIntervalChange: (value: string) => void
  handleMinRefreshIntervalBlur: () => void
}

export default function RefreshSettings({
  autoRefresh,
  refreshOnOpen,
  intervalInput,
  minIntervalInput,
  handleAutoRefreshChange,
  handleRefreshOnOpenChange,
  handleRefreshIntervalChange,
  handleRefreshIntervalBlur,
  handleMinRefreshIntervalChange,
  handleMinRefreshIntervalBlur
}: RefreshSettingsProps) {
  return (
    <section>
      <h2 className="text-lg font-medium text-gray-900 mb-4">刷新设置</h2>
      <div className="space-y-6">
        {/* 自动刷新 */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-medium text-gray-900">自动刷新</h3>
            <p className="text-sm text-gray-500">定期自动刷新账号数据</p>
          </div>
          <Switch
            checked={autoRefresh}
            onChange={handleAutoRefreshChange}
            className={`${
              autoRefresh ? "bg-blue-600" : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}>
            <span
              className={`${
                autoRefresh ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>

        {/* 刷新间隔 */}
        {autoRefresh && (
          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-medium text-gray-900">刷新间隔</h3>
              <p className="text-sm text-gray-500">
                设置自动刷新的时间间隔（默认360秒，建议不要设置过小以避免频繁请求）
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="10"
                value={intervalInput}
                onChange={(e) => handleRefreshIntervalChange(e.target.value)}
                onBlur={handleRefreshIntervalBlur}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.currentTarget.blur() // 触发onBlur事件
                  }
                }}
                placeholder="360"
                className="w-20 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-sm text-gray-500">秒</span>
            </div>
          </div>
        )}

        {/* 打开插件时自动刷新 */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              打开插件时自动刷新
            </h3>
            <p className="text-sm text-gray-500">
              当打开插件弹出层时自动刷新账号数据
            </p>
          </div>
          <Switch
            checked={refreshOnOpen}
            onChange={handleRefreshOnOpenChange}
            className={`${
              refreshOnOpen ? "bg-blue-600" : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}>
            <span
              className={`${
                refreshOnOpen ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>

        {/* 最小刷新间隔 */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              最小刷新间隔
            </h3>
            <p className="text-sm text-gray-500">
              自动刷新时的最小时间间隔，避免频繁请求（手动刷新不受限制）
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="0"
              max="300"
              value={minIntervalInput}
              onChange={(e) => handleMinRefreshIntervalChange(e.target.value)}
              onBlur={handleMinRefreshIntervalBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.blur()
                }
              }}
              placeholder="60"
              className="w-20 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="text-sm text-gray-500">秒</span>
          </div>
        </div>
      </div>
    </section>
  )
}
