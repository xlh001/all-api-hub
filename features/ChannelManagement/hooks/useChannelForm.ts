import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import toast from "react-hot-toast"

import {
  DEFAULT_CHANNEL_FIELDS,
  getChannelTypeConfig
} from "~/config/channelDefaults"
import { createChannel } from "~/services/newApiService"
import {
  getNewApiConfig,
  getNewApiGroups,
  getNewApiModels,
  getCommonModelSuggestions,
  hasValidNewApiConfig
} from "~/services/newapi/siteMeta"
import type {
  ChannelType,
  ChannelFormData,
  ChannelCreationPayload,
  NewApiChannel,
  ChannelGroup,
  ChannelModel
} from "~/types/newapi"
import type { MultiSelectOption } from "~/components/ui/MultiSelect"

export interface UseChannelFormProps {
  mode: "add" | "edit"
  channel?: NewApiChannel | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: (channel: any) => void
}

export function useChannelForm({
  mode,
  channel,
  isOpen,
  onClose,
  onSuccess
}: UseChannelFormProps) {
  const { t } = useTranslation("channelDialog")

  // Form state
  const [formData, setFormData] = useState<ChannelFormData>({
    name: "",
    type: DEFAULT_CHANNEL_FIELDS.type,
    key: "",
    base_url: "",
    models: [],
    groups: DEFAULT_CHANNEL_FIELDS.groups,
    priority: DEFAULT_CHANNEL_FIELDS.priority,
    weight: DEFAULT_CHANNEL_FIELDS.weight,
    status: DEFAULT_CHANNEL_FIELDS.status
  })

  // UI state
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingGroups, setIsLoadingGroups] = useState(false)
  const [isLoadingModels, setIsLoadingModels] = useState(false)
  const [availableGroups, setAvailableGroups] = useState<MultiSelectOption[]>([])
  const [availableModels, setAvailableModels] = useState<MultiSelectOption[]>([])

  // Load groups and model suggestions on mount
  useEffect(() => {
    if (isOpen) {
      loadGroups()
      loadModels()
    }
  }, [isOpen])

  // Load form data when editing
  useEffect(() => {
    if (isOpen && mode === "edit" && channel) {
      setFormData({
        name: channel.name,
        type: channel.type,
        key: channel.key,
        base_url: channel.base_url || "",
        models: channel.models ? channel.models.split(",") : [],
        groups:
          typeof channel.groups === "string"
            ? channel.groups.split(",")
            : channel.groups || DEFAULT_CHANNEL_FIELDS.groups,
        priority: channel.priority ?? DEFAULT_CHANNEL_FIELDS.priority,
        weight: channel.weight ?? DEFAULT_CHANNEL_FIELDS.weight,
        status: channel.status ?? DEFAULT_CHANNEL_FIELDS.status
      })
    } else if (isOpen && mode === "add") {
      resetForm()
    }
  }, [isOpen, mode, channel])

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      type: DEFAULT_CHANNEL_FIELDS.type,
      key: "",
      base_url: "",
      models: [],
      groups: DEFAULT_CHANNEL_FIELDS.groups,
      priority: DEFAULT_CHANNEL_FIELDS.priority,
      weight: DEFAULT_CHANNEL_FIELDS.weight,
      status: DEFAULT_CHANNEL_FIELDS.status
    })
  }, [])

  const loadGroups = async () => {
    setIsLoadingGroups(true)
    try {
      const hasConfig = await hasValidNewApiConfig()
      if (!hasConfig) {
        console.warn("[ChannelForm] No valid New API configuration")
        setAvailableGroups([{ label: "default", value: "default" }])
        return
      }

      const groups = await getNewApiGroups()
      const groupOptions = groups.map((g: ChannelGroup) => ({
        label: g.name,
        value: g.id
      }))

      if (groupOptions.length === 0) {
        groupOptions.push({ label: "default", value: "default" })
      }

      setAvailableGroups(groupOptions)
    } catch (error) {
      console.error("[ChannelForm] Failed to load groups:", error)
      setAvailableGroups([{ label: "default", value: "default" }])
    } finally {
      setIsLoadingGroups(false)
    }
  }

  const loadModels = async () => {
    setIsLoadingModels(true)
    try {
      const hasConfig = await hasValidNewApiConfig()
      let options: MultiSelectOption[] = []

      if (hasConfig) {
        const models = await getNewApiModels()
        options = models.map((model: ChannelModel) => ({
          label: model.name,
          value: model.id
        }))
      }

      if (options.length === 0) {
        const suggestions = getCommonModelSuggestions()
        options = suggestions.map((m) => ({ label: m, value: m }))
      }

      setAvailableModels(options)
    } catch (error) {
      console.error("[ChannelForm] Failed to load models:", error)
      const fallback = getCommonModelSuggestions().map((m) => ({
        label: m,
        value: m
      }))
      setAvailableModels(fallback)
    } finally {
      setIsLoadingModels(false)
    }
  }

  const updateField = <K extends keyof ChannelFormData>(
    field: K,
    value: ChannelFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTypeChange = (newType: ChannelType) => {
    const config = getChannelTypeConfig(newType)
    setFormData((prev) => ({
      ...prev,
      type: newType,
      priority: config.defaultPriority ?? prev.priority,
      weight: config.defaultWeight ?? prev.weight
    }))
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()

    // Validation
    if (!formData.name.trim()) {
      toast.error(t?.("validation.nameRequired") || "Channel name is required")
      return
    }

    if (!formData.key.trim()) {
      toast.error(t?.("validation.keyRequired") || "API key is required")
      return
    }

    const config = getChannelTypeConfig(formData.type)
    if (config.requiresBaseUrl && !formData.base_url?.trim()) {
      toast.error(
        t?.("validation.baseUrlRequired") || "Base URL is required for this channel type"
      )
      return
    }

    setIsSaving(true)

    try {
      const apiConfig = await getNewApiConfig()
      if (!apiConfig) {
        throw new Error("New API configuration not found")
      }

      // Build payload
      const payload: ChannelCreationPayload = {
        mode: DEFAULT_CHANNEL_FIELDS.mode,
        channel: {
          name: formData.name.trim(),
          type: formData.type,
          key: formData.key.trim(),
          base_url: formData.base_url?.trim() || undefined,
          models: formData.models.join(","),
          groups: formData.groups.length > 0 ? formData.groups : DEFAULT_CHANNEL_FIELDS.groups,
          priority: formData.priority,
          weight: formData.weight,
          status: formData.status
        }
      }

      // Create channel
      const response = await createChannel(
        apiConfig.baseUrl,
        apiConfig.token,
        apiConfig.userId,
        payload
      )

      if (response.success) {
        toast.success(
          t?.(mode === "add" ? "messages.createSuccess" : "messages.updateSuccess") ||
            "Channel saved successfully"
        )
        onSuccess?.(response)
        onClose()
        resetForm()
      } else {
        throw new Error(response.message || "Failed to save channel")
      }
    } catch (error: any) {
      console.error("[ChannelForm] Save failed:", error)
      toast.error(
        t?.("messages.saveFailed", { error: error.message }) ||
          `Failed to save channel: ${error.message}`
      )
    } finally {
      setIsSaving(false)
    }
  }

  const isFormValid = Boolean(
    formData.name.trim() &&
      formData.key.trim() &&
      (!getChannelTypeConfig(formData.type).requiresBaseUrl ||
        formData.base_url?.trim())
  )

  return {
    formData,
    updateField,
    handleTypeChange,
    handleSubmit,
    isFormValid,
    isSaving,
    isLoadingGroups,
    isLoadingModels,
    availableGroups,
    availableModels,
    resetForm
  }
}
