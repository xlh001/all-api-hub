import type { FormData } from "~/hooks/useTokenForm"

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
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        IP限制
      </label>
      <input
        type="text"
        value={allowIps}
        onChange={handleInputChange("allowIps")}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-300" : "border-gray-300"
        }`}
        placeholder="留空表示不限制，多个IP用逗号分隔"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      <p className="mt-1 text-xs text-gray-500">
        例如: 192.168.1.1,10.0.0.1 或使用 * 表示不限制
      </p>
    </div>
  )
}