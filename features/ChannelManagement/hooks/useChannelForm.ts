import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import toast from "react-hot-toast"

import {
  DEFAULT_CHANNEL_FIELDS,
  getChannelTypeConfig
} from "~/config/channelDefaults"
import { fetchUserGroups } from "~/services/apiService"
import {
  buildChannelPayload,
  createChannel,
  checkValidNewApiConfig,
  getNewApiConfig,
  getCommonModelSuggestions
} from "~/services/newApiService"
import type {
  ChannelType,
  ChannelFormData,
  NewApiChannel
} from "~/types/newapi"
import type { MultiSelectOption } from "~/components/ui/MultiSelect"
import { mergeUniqueOptions } from "~/utils/selectOptions"

export interface UseChannelFormProps {
  mode: "add" | "edit"
  channel?: NewApiChannel | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: (channel: any) => void
  initialValues?: Partial<ChannelFormData>
  initialModels?: string[]
  initialGroups?: string[]
}

export function useChannelForm({
  mode,
  channel,
  isOpen,
  onClose,
  onSuccess,
  initialValues,
  initialModels,
  initialGroups
}: UseChannelFormProps) {
  const { t } = useTranslation(["channelDialog", "messages"])

  const buildInitialFormData = useCallback((): ChannelFormData => ({
    name: initialValues?.name ?? "",
    type: initialValues?.type ?? DEFAULT_CHANNEL_FIELDS.type,
    key: initialValues?.key ?? "",
    base_url: initialValues?.base_url ?? "",
    models: initialValues?.models ? [...initialValues.models] : [],
    groups:
      initialValues?.groups && initialValues.groups.length > 0
        ? [...initialValues.groups]
        : [...DEFAULT_CHANNEL_FIELDS.groups],
    priority: initialValues?.priority ?? DEFAULT_CHANNEL_FIELDS.priority,
    weight: initialValues?.weight ?? DEFAULT_CHANNEL_FIELDS.weight,
    status: initialValues?.status ?? DEFAULT_CHANNEL_FIELDS.status
  }), [initialValues])

  // Form state
  const [formData, setFormData] = useState<ChannelFormData>(() =>
    buildInitialFormData()
  )

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialValues, initialModels, initialGroups])

  // Load form data when dialog opens
  useEffect(() => {
    if (!isOpen) {
      return
    }

    if (mode === "edit" && channel) {
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
    } else {
      setFormData(buildInitialFormData())
    }
  }, [isOpen, mode, channel, buildInitialFormData])

  const resetForm = useCallback(() => {
    setFormData(buildInitialFormData())
  }, [buildInitialFormData])

  const loadGroups = async () => {
    setIsLoadingGroups(true)
    try {
      const hasConfig = await checkValidNewApiConfig()
      const preselectedGroups = (initialValues?.groups ?? initialGroups ?? []).map(
        (value) => ({ label: value, value })
      )

      if (!hasConfig) {
        console.warn("[ChannelForm] No valid New API configuration")
        const fallback = [{ label: "default", value: "default" }]
        setAvailableGroups(mergeUniqueOptions(fallback, preselectedGroups))
        return
      }

      const config = await getNewApiConfig()
      if (!config) {
        setAvailableGroups(mergeUniqueOptions([{ label: "default", value: "default" }], preselectedGroups))
        return
      }

      const groupsData = await fetchUserGroups({
        baseUrl: config.baseUrl,
        userId: config.userId,
        token: config.token
      })

      let groupOptions = Object.keys(groupsData).map((key) => ({
        label: key,
        value: key
      }))

      if (!groupOptions.some((option) => option.value === "default")) {
        groupOptions.push({ label: "default", value: "default" })
      }

      groupOptions = mergeUniqueOptions(groupOptions, preselectedGroups)
      setAvailableGroups(groupOptions)
    } catch (error) {
      console.error("[ChannelForm] Failed to load groups:", error)
      const fallback = [{ label: "default", value: "default" }]
      const preselectedGroups = (initialValues?.groups ?? initialGroups ?? []).map(
        (value) => ({ label: value, value })
      )
      setAvailableGroups(mergeUniqueOptions(fallback, preselectedGroups))
    } finally {
      setIsLoadingGroups(false)
    }
  }

  const loadModels = async () => {
    setIsLoadingModels(true)
    try {
      const suggestions = getCommonModelSuggestions()
      const options = suggestions.map((m) => ({ label: m, value: m }))

      const preselectedModels = (initialValues?.models ?? initialModels ?? []).map(
        (value) => ({
          label: value,
          value
        })
      )

      setAvailableModels(mergeUniqueOptions(options, preselectedModels))
    } catch (error) {
      console.error("[ChannelForm] Failed to load models:", error)
      const fallback = getCommonModelSuggestions().map((m) => ({
        label: m,
        value: m
      }))
      const preselectedModels = (initialValues?.models ?? initialModels ?? []).map(
        (value) => ({
          label: value,
          value
        })
      )
      setAvailableModels(mergeUniqueOptions(fallback, preselectedModels))
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
      const payload = buildChannelPayload(formData)

      // Create channel
      const response = await createChannel(
        apiConfig.baseUrl,
        apiConfig.token,
        apiConfig.userId,
        payload
      )

      if (response.success) {
        const successMessage =
          mode === "add"
            ? t("messages:newapi.importSuccess", {
                channelName: formData.name,
                defaultValue: t("channelDialog:messages.createSuccess")
              })
            : t("channelDialog:messages.updateSuccess")

        toast.success(successMessage)
        onSuccess?.(response)
        onClose()
        resetForm()
      } else {
        throw new Error(response.message || "Failed to save channel")
      }
    } catch (error: any) {
      console.error("[ChannelForm] Save failed:", error)
      toast.error(
        t("channelDialog:messages.saveFailed", {
          error: error.message,
          defaultValue: `Failed to save channel: ${error.message}`
        })
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
