import { Switch } from "@headlessui/react"
import {
  CurrencyDollarIcon,
  EyeIcon,
  EyeSlashIcon,
  GlobeAltIcon,
  KeyIcon,
  PencilSquareIcon,
  UserIcon
} from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"

import { SITE_TITLE_RULES } from "~/constants/siteType"
import { isValidExchangeRate } from "~/services/accountOperations"
import { AuthTypeEnum, type CheckInConfig } from "~/types"

interface AccountFormProps {
  authType: AuthTypeEnum
  siteName: string
  username: string
  userId: string
  accessToken: string
  exchangeRate: string
  showAccessToken: boolean
  notes: string
  onSiteNameChange: (value: string) => void
  onUsernameChange: (value: string) => void
  onUserIdChange: (value: string) => void
  onAccessTokenChange: (value: string) => void
  onExchangeRateChange: (value: string) => void
  onToggleShowAccessToken: () => void
  onNotesChange: (value: string) => void
  siteType: string
  onSiteTypeChange: (value: string) => void
  checkIn: CheckInConfig
  onCheckInChange: (value: CheckInConfig) => void
}

export default function AccountForm({
  authType,
  siteName,
  username,
  userId,
  accessToken,
  exchangeRate,
  showAccessToken,
  notes,
  onSiteNameChange,
  onUsernameChange,
  onUserIdChange,
  onAccessTokenChange,
  onExchangeRateChange,
  onToggleShowAccessToken,
  onNotesChange,
  siteType,
  onSiteTypeChange,
  checkIn,
  onCheckInChange
}: AccountFormProps) {
  const { t } = useTranslation()
  const commonInputClasses =
    "block w-full pl-10 py-3 border border-gray-200 dark:border-dark-bg-tertiary rounded-lg text-sm placeholder-gray-400 dark:placeholder-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text-primary"

  return (
    <>
      {/* 网站名称 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
          {t("accountDialog.form.siteName")}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <GlobeAltIcon className="h-5 w-5 text-gray-400 dark:text-gray-50" />
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

      {/* 站点类型 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
          {t("accountDialog.form.siteType")}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <GlobeAltIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <select
            value={siteType}
            onChange={(e) => onSiteTypeChange(e.target.value)}
            className="block w-full pl-10 py-3 border border-gray-200 dark:border-dark-bg-tertiary rounded-lg text-sm placeholder-gray-400 dark:placeholder-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text-primary">
            {SITE_TITLE_RULES.map((rule) => (
              <option key={rule.name} value={rule.name}>
                {rule.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 用户名 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
          {t("accountDialog.form.username")}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            placeholder={t("accountDialog.form.username")}
            className={commonInputClasses}
            required
          />
        </div>
      </div>

      {/* 用户 ID */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
          {t("accountDialog.form.userId")}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-40 dark:text-gray-500 font-mono text-sm">
              #
            </span>
          </div>
          <input
            type="number"
            value={userId}
            onChange={(e) => onUserIdChange(e.target.value)}
            placeholder={t("accountDialog.form.userIdNumber")}
            className={commonInputClasses}
            required
          />
        </div>
      </div>

      {/* 访问令牌 */}
      {authType === AuthTypeEnum.AccessToken && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
            {t("accountDialog.form.accessToken")}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <KeyIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type={showAccessToken ? "text" : "password"}
              value={accessToken}
              onChange={(e) => onAccessTokenChange(e.target.value)}
              placeholder={t("accountDialog.form.accessToken")}
              className="block w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-dark-bg-tertiary rounded-lg text-sm placeholder-gray-400 dark:placeholder-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text-primary"
              required
            />
            <button
              type="button"
              onClick={onToggleShowAccessToken}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-30 transition-colors">
              {showAccessToken ? (
                <EyeSlashIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* 充值金额比例 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
          {t("accountDialog.form.exchangeRate")}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CurrencyDollarIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="number"
            step="0.01"
            min="0.1"
            max="100"
            value={exchangeRate}
            onChange={(e) => onExchangeRateChange(e.target.value)}
            placeholder={t("accountDialog.form.exchangeRatePlaceholder")}
            className={`block w-full px-10 py-3 border rounded-lg text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text-primary ${
              isValidExchangeRate(exchangeRate)
                ? "border-gray-200 dark:border-dark-bg-tertiary focus:ring-blue-500 focus:border-transparent"
                : "border-red-300 focus:ring-red-500 focus:border-red-500"
            }`}
            required
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-sm text-gray-500 dark:text-dark-text-secondary">
              CNY
            </span>
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-dark-text-secondary">
          {t("accountDialog.form.exchangeRateDesc")}
        </p>
        {!isValidExchangeRate(exchangeRate) && exchangeRate && (
          <p className="mt-1 text-xs text-red-600">
            {t("accountDialog.form.validRateError")}
          </p>
        )}
      </div>

      {/* 签到功能开关 */}
      <div className="w-full flex items-center justify-between">
        <label
          htmlFor="supports-check-in"
          className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
          {t("accountDialog.form.checkInStatus")}
        </label>
        <Switch
          checked={checkIn.enableDetection}
          onChange={(enableDetection) =>
            onCheckInChange({ ...checkIn, enableDetection })
          }
          id="supports-check-in"
          className={`${
            checkIn.enableDetection ? "bg-green-600" : "bg-gray-200"
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}>
          <span
            className={`${
              checkIn.enableDetection ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>

      {/* Custom Check-in URL */}
      <div className="space-y-2">
        <label
          htmlFor="custom-checkin-url"
          className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
          {t("accountDialog.form.customCheckInUrl")}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <GlobeAltIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="url"
            id="custom-checkin-url"
            value={checkIn.customCheckInUrl}
            onChange={(e) =>
              onCheckInChange({ ...checkIn, customCheckInUrl: e.target.value })
            }
            placeholder="https://example.com/api/checkin"
            className={commonInputClasses}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-dark-text-secondary">
          {t("accountDialog.form.customCheckInDesc")}
        </p>
      </div>

      {/* 备注 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
          {t("accountDialog.form.notes")}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <PencilSquareIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder={t("accountDialog.form.notesPlaceholder")}
            className={`${commonInputClasses} resize-none`}
            rows={2}
          />
        </div>
      </div>
    </>
  )
}
