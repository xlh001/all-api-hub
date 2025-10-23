import {
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  ClipboardDocumentListIcon,
  CpuChipIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

import {
  Button,
  Card,
  FormField,
  Input,
  Label,
  Select,
  Switch
} from "~/components/ui"

interface ControlPanelProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedGroup: string
  setSelectedGroup: (group: string) => void
  availableGroups: string[]
  pricingData: any
  loadPricingData: () => void
  isLoading: boolean
  showRealPrice: boolean
  setShowRealPrice: (show: boolean) => void
  showRatioColumn: boolean
  setShowRatioColumn: (show: boolean) => void
  showEndpointTypes: boolean
  setShowEndpointTypes: (show: boolean) => void
  totalModels: number
  filteredModels: any[]
}

export function ControlPanel({
  searchTerm,
  setSearchTerm,
  selectedGroup,
  setSelectedGroup,
  availableGroups,
  pricingData,
  loadPricingData,
  isLoading,
  showRealPrice,
  setShowRealPrice,
  showRatioColumn,
  setShowRatioColumn,
  showEndpointTypes,
  setShowEndpointTypes,
  totalModels,
  filteredModels
}: ControlPanelProps) {
  const { t } = useTranslation("modelList")
  const handleCopyModelNames = () => {
    if (filteredModels.length === 0) {
      toast.error(t("noMatchingModels"))
      return
    }
    const modelNames = filteredModels
      .map((item) => item.model.model_name)
      .join(",")
    navigator.clipboard.writeText(modelNames)
    toast.success(t("messages.modelNameCopied"))
  }

  return (
    <Card className="mb-6">
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <FormField label={t("searchModels")} className="flex-1">
          <Input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<MagnifyingGlassIcon className="w-4 h-4" />}
          />
        </FormField>

        <FormField label={t("userGroup")} className="w-full lg:w-64">
          <Select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}>
            <option value="all">{t("allGroups")}</option>
            {availableGroups.map((group) => (
              <option key={group} value={group}>
                {group} ({pricingData?.group_ratio?.[group] || 1}x)
              </option>
            ))}
          </Select>
        </FormField>

        <div className="w-full lg:w-auto lg:flex lg:items-end">
          <Button
            onClick={loadPricingData}
            disabled={isLoading}
            loading={isLoading}
            className="w-full lg:w-auto"
            leftIcon={!isLoading && <ArrowPathIcon className="w-4 h-4" />}>
            {t("refreshData")}
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-4 border-t border-gray-100 dark:border-dark-bg-tertiary">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <AdjustmentsHorizontalIcon className="w-4 h-4 text-gray-400 dark:text-dark-text-tertiary" />
            <span className="text-gray-700 dark:text-dark-text-secondary font-medium">
              {t("displayOptions")}
            </span>
          </div>

          <label className="flex items-center space-x-2 cursor-pointer">
            <Switch
              checked={showRealPrice}
              onChange={setShowRealPrice}
              size="sm"
            />
            <Label className="cursor-pointer">{t("realAmount")}</Label>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <Switch
              checked={showRatioColumn}
              onChange={setShowRatioColumn}
              size="sm"
            />
            <Label className="cursor-pointer">{t("showRatio")}</Label>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <Switch
              checked={showEndpointTypes}
              onChange={setShowEndpointTypes}
              size="sm"
            />
            <Label className="cursor-pointer">{t("endpointTypes")}</Label>
          </label>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyModelNames}
            leftIcon={<ClipboardDocumentListIcon className="w-4 h-4" />}>
            {t("copyAllNames")}
          </Button>
        </div>

        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-dark-text-secondary">
            <CpuChipIcon className="w-4 h-4" />
            <span>{t("totalModels", { count: totalModels })}</span>
          </div>
          <div className="h-4 w-px bg-gray-300 dark:bg-dark-bg-tertiary"></div>
          <div className="text-blue-600 dark:text-blue-400">
            <span>{t("showing", { count: filteredModels.length })}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
