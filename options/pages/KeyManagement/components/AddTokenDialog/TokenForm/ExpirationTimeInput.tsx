import type { FormData } from "~/options/pages/KeyManagement/components/AddTokenDialog/hooks/useTokenForm"

interface ExpirationTimeInputProps {
  expiredTime: string
  handleInputChange: (
    field: keyof FormData
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
}

export function ExpirationTimeInput({
  expiredTime,
  handleInputChange,
  error
}: ExpirationTimeInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        过期时间
      </label>
      <input
        type="datetime-local"
        value={expiredTime}
        onChange={handleInputChange("expiredTime")}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-300" : "border-gray-300"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      <p className="mt-1 text-xs text-gray-500">留空表示永不过期</p>
    </div>
  )
}
