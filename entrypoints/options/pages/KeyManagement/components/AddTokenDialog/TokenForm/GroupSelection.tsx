import { useTranslation } from "react-i18next"

import { FormField, Select } from "~/components/ui"
import type { UserGroupInfo } from "~/services/apiService/common/type"

import type { FormData } from "../hooks/useTokenForm"

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
  const { t } = useTranslation("keyManagement")

  return (
    <FormField label={t("dialog.groupLabel")} htmlFor="groupSelect">
      <Select
        id="groupSelect"
        value={group}
        onChange={handleInputChange("group")}>
        {Object.entries(groups).map(([key, group]) => (
          <option key={key} value={key}>
            {group.desc} ({t("dialog.groupRate")}: {group.ratio})
          </option>
        ))}
      </Select>
    </FormField>
  )
}
