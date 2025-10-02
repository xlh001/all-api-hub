import { EyeIcon, GlobeAltIcon } from "@heroicons/react/24/outline"
import { DATA_TYPE_BALANCE, DATA_TYPE_CONSUMPTION } from "~/constants/ui"
import type { BalanceType, CurrencyType } from "~/types"

interface DisplaySettingsProps {
  currencyType: CurrencyType
  activeTab: BalanceType
  handleCurrencyChange: (currency: CurrencyType) => void
  handleDefaultTabChange: (tab: BalanceType) => void
}

export default function DisplaySettings({
  currencyType,
  activeTab,
  handleCurrencyChange,
  handleDefaultTabChange
}: DisplaySettingsProps) {
  return (
    <section>
      <h2 className="text-lg font-medium text-gray-900 mb-4">显示设置</h2>
      <div className="space-y-6">
        {/* 默认货币单位 */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <GlobeAltIcon className="w-5 h-5 text-gray-400" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                货币单位
              </h3>
              <p className="text-sm text-gray-500">
                设置余额和消费显示的默认货币单位
              </p>
            </div>
          </div>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => handleCurrencyChange("USD")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                currencyType === "USD"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}>
              美元 ($)
            </button>
            <button
              onClick={() => handleCurrencyChange("CNY")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                currencyType === "CNY"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}>
              人民币 (¥)
            </button>
          </div>
        </div>

        {/* 默认标签页 */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <EyeIcon className="w-5 h-5 text-gray-400" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                默认标签页
              </h3>
              <p className="text-sm text-gray-500">
                设置插件启动时显示的默认标签页
              </p>
            </div>
          </div>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => handleDefaultTabChange(DATA_TYPE_CONSUMPTION)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === DATA_TYPE_CONSUMPTION
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}>
              今日消耗
            </button>
            <button
              onClick={() => handleDefaultTabChange(DATA_TYPE_BALANCE)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === DATA_TYPE_BALANCE
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}>
              总余额
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}