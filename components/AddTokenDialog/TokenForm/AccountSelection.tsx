import type { FormData } from "~/hooks/useTokenForm"

export interface Account {
  id: string
  name: string
}

interface AccountSelectionProps {
  accountId: string
  handleInputChange: (
    field: keyof FormData
  ) => (e: React.ChangeEvent<HTMLSelectElement>) => void
  isEditMode: boolean
  availableAccounts: Account[]
  error?: string
}

export function AccountSelection({
  accountId,
  handleInputChange,
  isEditMode,
  availableAccounts,
  error
}: AccountSelectionProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        选择账号 <span className="text-red-500">*</span>
      </label>
      <select
        value={accountId}
        onChange={handleInputChange("accountId")}
        disabled={isEditMode}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-300" : "border-gray-300"
        } ${isEditMode ? "bg-gray-100 cursor-not-allowed" : ""}`}>
        <option value="">请选择账号</option>
        {availableAccounts.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {isEditMode && (
        <p className="mt-1 text-xs text-gray-500">编辑模式下无法更改账号</p>
      )}
    </div>
  )
}