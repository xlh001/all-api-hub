import { useTranslation } from "react-i18next"

import type { FormData } from "../hooks/useTokenForm"

interface IpLimitsInputProps {
  allowIps: string
  handleInputChange: (
    field: keyof FormData
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
}

export function IpLimitsInput({
  allowIps,
  handleInputChange,
  error
}: IpLimitsInputProps) {
  const { t } = useTranslation()

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">
        {t("keyManagement.ipLimits")}
      </label>
      <input
        type="text"
        value={allowIps}
        onChange={handleInputChange("allowIps")}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text-primary ${
          error
            ? "border-red-300"
            : "border-gray-300 dark:border-dark-bg-tertiary"
        }`}
        placeholder={t("keyManagement.ipPlaceholder")}
      />
      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
      <p className="mt-1 text-xs text-gray-500 dark:text-dark-text-tertiary">
        {t("keyManagement.ipExample")}
      </p>
    </div>
  )
}
