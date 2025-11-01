import React from "react"
import { useTranslation } from "react-i18next"

import { Button, Input, Label, Modal, MultiSelect, Select } from "~/components/ui"
import {
  getChannelTypeOptions,
  getChannelTypeName,
  getChannelTypeConfig,
  CHANNEL_STATUS
} from "~/config/channelDefaults"
import { useChannelForm } from "~/features/ChannelManagement/hooks/useChannelForm"
import type { NewApiChannel } from "~/types/newapi"

export interface ChannelDialogProps {
  isOpen: boolean
  onClose: () => void
  mode?: "add" | "edit"
  channel?: NewApiChannel | null
  onSuccess?: (channel: any) => void
}

export function ChannelDialog({
  isOpen,
  onClose,
  mode = "add",
  channel = null,
  onSuccess
}: ChannelDialogProps) {
  const { t } = useTranslation(["channelDialog", "common"])

  const {
    formData,
    updateField,
    handleTypeChange,
    handleSubmit,
    isFormValid,
    isSaving,
    isLoadingGroups,
    isLoadingModels,
    availableGroups,
    availableModels
  } = useChannelForm({
    mode,
    channel,
    isOpen,
    onClose,
    onSuccess
  })

  const channelTypeOptions = getChannelTypeOptions()
  const currentTypeConfig = getChannelTypeConfig(formData.type)

  const header = (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary">
        {mode === "add"
          ? t("channelDialog:title.add", "Add Channel")
          : t("channelDialog:title.edit", "Edit Channel")}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-dark-text-secondary">
        {mode === "add"
          ? t(
              "channelDialog:description.add",
              "Create a new channel for your API aggregator"
            )
          : t("channelDialog:description.edit", "Update channel settings")}
      </p>
    </div>
  )

  const footer = (
    <div className="flex justify-end gap-3">
      <Button
        variant="outline"
        onClick={onClose}
        disabled={isSaving}
        type="button">
        {t("common:cancel", "Cancel")}
      </Button>
      <Button
        variant="primary"
        onClick={handleSubmit}
        disabled={!isFormValid || isSaving}
        loading={isSaving}
        type="submit">
        {mode === "add"
          ? t("channelDialog:actions.create", "Create Channel")
          : t("channelDialog:actions.update", "Update Channel")}
      </Button>
    </div>
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={header}
      footer={footer}
      size="lg"
      closeOnBackdropClick={!isSaving}
      closeOnEsc={!isSaving}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Channel Name */}
        <div>
          <Label htmlFor="channel-name" required>
            {t("channelDialog:fields.name.label", "Channel Name")}
          </Label>
          <Input
            id="channel-name"
            type="text"
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder={t(
              "channelDialog:fields.name.placeholder",
              "Enter channel name"
            )}
            disabled={isSaving}
            required
          />
        </div>

        {/* Channel Type */}
        <div>
          <Label htmlFor="channel-type" required>
            {t("channelDialog:fields.type.label", "Channel Type")}
          </Label>
          <Select
            id="channel-type"
            value={formData.type}
            onChange={(e) => handleTypeChange(Number(e.target.value))}
            disabled={isSaving || mode === "edit"}
            required>
            {channelTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <p className="mt-1 text-xs text-gray-500 dark:text-dark-text-secondary">
            {t("channelDialog:fields.type.hint", "Select the API provider type")}
          </p>
        </div>

        {/* API Key */}
        <div>
          <Label htmlFor="channel-key" required>
            {t("channelDialog:fields.key.label", "API Key")}
          </Label>
          <Input
            id="channel-key"
            type="password"
            value={formData.key}
            onChange={(e) => updateField("key", e.target.value)}
            placeholder={
              currentTypeConfig.keyPlaceholder ||
              t("channelDialog:fields.key.placeholder", "Enter API key")
            }
            disabled={isSaving}
            required
          />
        </div>

        {/* Base URL */}
        {(currentTypeConfig.requiresBaseUrl || formData.base_url) && (
          <div>
            <Label
              htmlFor="channel-base-url"
              required={currentTypeConfig.requiresBaseUrl}>
              {t("channelDialog:fields.baseUrl.label", "Base URL")}
            </Label>
            <Input
              id="channel-base-url"
              type="url"
              value={formData.base_url}
              onChange={(e) => updateField("base_url", e.target.value)}
              placeholder={
                currentTypeConfig.baseUrlPlaceholder ||
                t(
                  "channelDialog:fields.baseUrl.placeholder",
                  "https://api.example.com"
                )
              }
              disabled={isSaving}
              required={currentTypeConfig.requiresBaseUrl}
            />
          </div>
        )}

        {/* Models */}
        <div>
          <MultiSelect
            label={t("channelDialog:fields.models.label", "Models")}
            options={availableModels}
            selected={formData.models}
            onChange={(models) => updateField("models", models)}
            placeholder={
              isLoadingModels
                ? t("channelDialog:fields.models.loading", "Loading models...")
                : t(
                    "channelDialog:fields.models.placeholder",
                    "Select or type model names"
                  )
            }
            disabled={isSaving || isLoadingModels}
            allowCustom
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-dark-text-secondary">
            {t(
              "channelDialog:fields.models.hint",
              "Select from suggestions or type custom model names and press Enter"
            )}
          </p>
        </div>

        {/* Groups */}
        <div>
          <MultiSelect
            label={t("channelDialog:fields.groups.label", "Groups")}
            options={availableGroups}
            selected={formData.groups}
            onChange={(groups) => updateField("groups", groups)}
            placeholder={
              isLoadingGroups
                ? t("channelDialog:fields.groups.loading", "Loading groups...")
                : t(
                    "channelDialog:fields.groups.placeholder",
                    "Select groups"
                  )
            }
            disabled={isSaving || isLoadingGroups}
            allowCustom
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-dark-text-secondary">
            {t(
              "channelDialog:fields.groups.hint",
              "Groups from your New API configuration"
            )}
          </p>
        </div>

        {/* Advanced Settings */}
        <details className="rounded-lg border border-gray-200 dark:border-dark-bg-tertiary p-3">
          <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-dark-text-primary">
            {t("channelDialog:sections.advanced", "Advanced Settings")}
          </summary>
          <div className="mt-3 space-y-4">
            {/* Priority */}
            <div>
              <Label htmlFor="channel-priority">
                {t("channelDialog:fields.priority.label", "Priority")}
              </Label>
              <Input
                id="channel-priority"
                type="number"
                value={formData.priority}
                onChange={(e) =>
                  updateField("priority", parseInt(e.target.value) || 0)
                }
                placeholder="0"
                disabled={isSaving}
                min="0"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-dark-text-secondary">
                {t(
                  "channelDialog:fields.priority.hint",
                  "Higher priority channels are used first"
                )}
              </p>
            </div>

            {/* Weight */}
            <div>
              <Label htmlFor="channel-weight">
                {t("channelDialog:fields.weight.label", "Weight")}
              </Label>
              <Input
                id="channel-weight"
                type="number"
                value={formData.weight}
                onChange={(e) =>
                  updateField("weight", parseInt(e.target.value) || 0)
                }
                placeholder="0"
                disabled={isSaving}
                min="0"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-dark-text-secondary">
                {t(
                  "channelDialog:fields.weight.hint",
                  "Weight for load balancing (0 = equal distribution)"
                )}
              </p>
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="channel-status">
                {t("channelDialog:fields.status.label", "Status")}
              </Label>
              <Select
                id="channel-status"
                value={formData.status}
                onChange={(e) =>
                  updateField("status", parseInt(e.target.value))
                }
                disabled={isSaving}>
                <option value={CHANNEL_STATUS.ENABLED}>
                  {t("channelDialog:fields.status.enabled", "Enabled")}
                </option>
                <option value={CHANNEL_STATUS.DISABLED}>
                  {t("channelDialog:fields.status.disabled", "Disabled")}
                </option>
              </Select>
            </div>
          </div>
        </details>
      </form>
    </Modal>
  )
}

export default ChannelDialog
