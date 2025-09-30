import {
  CurrencyDollarIcon,
  EyeIcon,
  EyeSlashIcon,
  GlobeAltIcon,
  KeyIcon,
  UserIcon
} from "@heroicons/react/24/outline"
import { isValidExchangeRate } from "../../services/accountOperations"

interface AccountFormProps {
  siteName: string
  username: string
  userId: string
  accessToken: string
  exchangeRate: string
  showAccessToken: boolean
  onSiteNameChange: (value: string) => void
  onUsernameChange: (value: string) => void
  onUserIdChange: (value: string) => void
  onAccessTokenChange: (value: string) => void
  onExchangeRateChange: (value: string) => void
  onToggleShowAccessToken: () => void
}

export default function AccountForm({
  siteName,
  username,
  userId,
  accessToken,
  exchangeRate,
  showAccessToken,
  onSiteNameChange,
  onUsernameChange,
  onUserIdChange,
  onAccessTokenChange,
  onExchangeRateChange,
  onToggleShowAccessToken
}: AccountFormProps) {
  const commonInputClasses =
    "block w-full pl-10 py-3 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"

  return (
    <>
      {/* 网站名称 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          网站名称
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <GlobeAltIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={siteName}
            onChange={(e) => onSiteNameChange(e.target.value)}
            placeholder="example.com"
            className={commonInputClasses}
            required
          />
        </div>
      </div>

      {/* 用户名 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          用户名
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            placeholder="用户名"
            className={commonInputClasses}
            required
          />
        </div>
      </div>

      {/* 用户 ID */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          用户 ID
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 font-mono text-sm">#</span>
          </div>
          <input
            type="number"
            value={userId}
            onChange={(e) => onUserIdChange(e.target.value)}
            placeholder="用户 ID (数字)"
            className={commonInputClasses}
            required
          />
        </div>
      </div>

      {/* 访问令牌 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          访问令牌
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <KeyIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={showAccessToken ? "text" : "password"}
            value={accessToken}
            onChange={(e) => onAccessTokenChange(e.target.value)}
            placeholder="访问令牌"
            className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            required
          />
          <button
            type="button"
            onClick={onToggleShowAccessToken}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors">
            {showAccessToken ? (
              <EyeSlashIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* 充值金额比例 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          充值金额比例 (CNY/USD)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="number"
            step="0.1"
            min="0.1"
            max="100"
            value={exchangeRate}
            onChange={(e) => onExchangeRateChange(e.target.value)}
            placeholder="请输入充值比例"
            className={`block w-full pl-10 py-3 border rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
              isValidExchangeRate(exchangeRate)
                ? "border-gray-200 focus:ring-blue-500 focus:border-transparent"
                : "border-red-300 focus:ring-red-500 focus:border-red-500"
            }`}
            required
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-sm text-gray-500">CNY</span>
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          表示充值 1 美元需要多少人民币。系统会尝试自动获取，如未获取到请手动填写
        </p>
        {!isValidExchangeRate(exchangeRate) && exchangeRate && (
          <p className="mt-1 text-xs text-red-600">
            请输入有效的汇率 (0.1 - 100)
          </p>
        )}
      </div>
    </>
  )
}