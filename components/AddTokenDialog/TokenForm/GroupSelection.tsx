import type { FormData } from "~/components/AddTokenDialog/hooks/useTokenForm"
import type { UserGroupInfo } from "~/services/apiService/common/type"

interface GroupSelectionProps {
  group: string
  handleInputChange: (
    field: keyof FormData
  ) => (e: React.ChangeEvent<HTMLSelectElement>) => void
  groups: Record<string, UserGroupInfo>
}

export function GroupSelection({
  group,
  handleInputChange,
  groups
}: GroupSelectionProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        分组
      </label>
      <select
        value={group}
        onChange={handleInputChange("group")}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        {Object.entries(groups).map(([key, group]) => (
          <option key={key} value={key}>
            {group.desc} (倍率: {group.ratio})
          </option>
        ))}
      </select>
    </div>
  )
}
