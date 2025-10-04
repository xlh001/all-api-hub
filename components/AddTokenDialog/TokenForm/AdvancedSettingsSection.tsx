import type { FormData } from "~/hooks/useTokenForm"
import type { UserGroupInfo } from "~/services/apiService/common/type"
import { isNotEmptyArray } from "~/utils"

import { FormSection } from "./FormSection"
import { GroupSelection } from "./GroupSelection"
import { IpLimitsInput } from "./IpLimitsInput"
import { ModelLimits } from "./ModelLimits"

interface AdvancedSettingsSectionProps {
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
  errors: Record<string, string>
  groups: Record<string, UserGroupInfo>
  availableModels: string[]
  handleInputChange: (
    field: keyof FormData
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  handleModelSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export function AdvancedSettingsSection({
  formData,
  setFormData,
  errors,
  groups,
  availableModels,
  handleInputChange,
  handleModelSelectChange
}: AdvancedSettingsSectionProps) {
  return (
    <FormSection title="高级设置">
      <GroupSelection
        group={formData.group}
        handleInputChange={handleInputChange}
        groups={groups}
      />
      {isNotEmptyArray(availableModels) && (
        <ModelLimits
          modelLimitsEnabled={formData.modelLimitsEnabled}
          modelLimits={formData.modelLimits}
          availableModels={availableModels}
          setFormData={setFormData}
          handleModelSelectChange={handleModelSelectChange}
        />
      )}
      <IpLimitsInput
        allowIps={formData.allowIps}
        handleInputChange={handleInputChange}
        error={errors.allowIps}
      />
    </FormSection>
  )
}
