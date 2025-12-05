import { useTranslation } from "react-i18next"

import { FormField, SearchableSelect } from "~/components/ui"
import type { UserGroupInfo } from "~/services/apiService/common/type"

interface GroupSelectionProps {
  group: string
  handleSelectChange: (value: string) => void
  groups: Record<string, UserGroupInfo>
}

export function GroupSelection({
  group,
  handleSelectChange,
  groups,
}: GroupSelectionProps) {
  const { t } = useTranslation("keyManagement")

  return (
    <FormField label={t("dialog.groupLabel")} htmlFor="groupSelect">
      <SearchableSelect
        options={Object.entries(groups).map(([key, groupInfo]) => ({
          value: key,
          label: `${groupInfo.desc} (${t("dialog.groupRate")}: ${groupInfo.ratio})`,
        }))}
        value={group ?? ""}
        onChange={handleSelectChange}
        placeholder={t("dialog.groupPlaceholder") ?? t("dialog.groupLabel")}
      />
    </FormField>
  )
}
