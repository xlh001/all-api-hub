import { Switch } from "@headlessui/react"

import { UI_CONSTANTS } from "~/constants/ui"
import type { FormData } from "~/hooks/useTokenForm"
import type { GroupInfo } from "~/services/apiService"

interface Account {
  id: string
  name: string
}

interface TokenFormProps {
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
  errors: Record<string, string>
  isEditMode: boolean
  availableAccounts: Account[]
  groups: Record<string, GroupInfo>
  availableModels: string[]
}

export function TokenForm({
  formData,
  setFormData,
  errors,
  isEditMode,
  availableAccounts,
  groups,
  availableModels
}: TokenFormProps) {
  const handleInputChange =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    }

  const handleSwitchChange = (field: keyof FormData) => (checked: boolean) => {
    setFormData((prev) => ({ ...prev, [field]: checked }))
  }

  const handleModelSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    )
    setFormData((prev) => ({ ...prev, modelLimits: values }))
  }

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">基本信息</h3>

        {/* Account Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            选择账号 <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.accountId}
            onChange={handleInputChange("accountId")}
            disabled={isEditMode}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.accountId ? "border-red-300" : "border-gray-300"
            } ${isEditMode ? "bg-gray-100 cursor-not-allowed" : ""}`}>
            <option value="">请选择账号</option>
            {availableAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
          {errors.accountId && (
            <p className="mt-1 text-xs text-red-600">{errors.accountId}</p>
          )}
          {isEditMode && (
            <p className="mt-1 text-xs text-gray-500">编辑模式下无法更改账号</p>
          )}
        </div>

        {/* Token Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            密钥名称 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={handleInputChange("name")}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="请输入密钥名称"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Quota Settings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              额度设置
            </label>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">无限额度</span>
              <Switch
                checked={formData.unlimitedQuota}
                onChange={handleSwitchChange("unlimitedQuota")}
                className={`${
                  formData.unlimitedQuota ? "bg-blue-600" : "bg-gray-200"
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}>
                <span
                  className={`${
                    formData.unlimitedQuota ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>
          </div>

          {!formData.unlimitedQuota && (
            <div>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.quota}
                onChange={handleInputChange("quota")}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.quota ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="请输入额度金额（美元）"
              />
              {errors.quota && (
                <p className="mt-1 text-xs text-red-600">{errors.quota}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                1美元 ={" "}
                {UI_CONSTANTS.EXCHANGE_RATE.CONVERSION_FACTOR.toLocaleString()}{" "}
                配额点数
              </p>
            </div>
          )}
        </div>

        {/* Expiration Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            过期时间
          </label>
          <input
            type="datetime-local"
            value={formData.expiredTime}
            onChange={handleInputChange("expiredTime")}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.expiredTime ? "border-red-300" : "border-gray-300"
            }`}
          />
          {errors.expiredTime && (
            <p className="mt-1 text-xs text-red-600">{errors.expiredTime}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">留空表示永不过期</p>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">高级设置</h3>

        {/* Group Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            分组
          </label>
          <select
            value={formData.group}
            onChange={handleInputChange("group")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            {Object.entries(groups).map(([key, group]) => (
              <option key={key} value={key}>
                {group.desc} (倍率: {group.ratio})
              </option>
            ))}
          </select>
        </div>

        {/* Model Limits */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              模型限制
            </label>
            <Switch
              checked={formData.modelLimitsEnabled}
              onChange={(enabled) => {
                setFormData((prev) => ({
                  ...prev,
                  modelLimitsEnabled: enabled,
                  modelLimits: enabled ? prev.modelLimits : []
                }))
              }}
              className={`${
                formData.modelLimitsEnabled ? "bg-blue-600" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}>
              <span
                className={`${
                  formData.modelLimitsEnabled
                    ? "translate-x-6"
                    : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>

          {formData.modelLimitsEnabled && (
            <div>
              <select
                multiple
                value={formData.modelLimits}
                onChange={handleModelSelectChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32">
                {availableModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                按住 Ctrl/Cmd 键可多选模型，已选择 {formData.modelLimits.length}{" "}
                个模型
              </p>
            </div>
          )}
        </div>

        {/* IP Limits */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            IP限制
          </label>
          <input
            type="text"
            value={formData.allowIps}
            onChange={handleInputChange("allowIps")}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.allowIps ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="留空表示不限制，多个IP用逗号分隔"
          />
          {errors.allowIps && (
            <p className="mt-1 text-xs text-red-600">{errors.allowIps}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            例如: 192.168.1.1,10.0.0.1 或使用 * 表示不限制
          </p>
        </div>
      </div>
    </div>
  )
}
