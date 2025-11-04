import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

import { MultiSelect } from "~/components/ui/MultiSelect"
import { Switch } from "~/components/ui/Switch"
import { useUserPreferencesContext } from "~/contexts/UserPreferencesContext"
import { fetchAccountAvailableModels } from "~/services/apiService/common"
import { ModelRedirectService } from "~/services/modelRedirect"
import { hasValidNewApiConfig } from "~/services/newApiService.ts"
import { AuthTypeEnum } from "~/types"
import { ALL_PRESET_STANDARD_MODELS } from "~/types/modelRedirect"

export default function ModelRedirectSettings() {
  const { t } = useTranslation("modelRedirect")
  const { preferences, updateModelRedirect } = useUserPreferencesContext()
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const modelRedirect = preferences?.modelRedirect

  const [modelList, setModelList] = useState(ALL_PRESET_STANDARD_MODELS)

  useEffect(() => {
    async function getModelList() {
      if (hasValidNewApiConfig(preferences)) {
        return await fetchAccountAvailableModels({
          baseUrl: preferences.newApiBaseUrl,
          userId: preferences.newApiUserId,
          token: preferences.newApiAdminToken,
          authType: AuthTypeEnum.AccessToken
        })
      }
    }

    ;(async () => {
      const modelList = await getModelList()
      setModelList(modelList ?? ALL_PRESET_STANDARD_MODELS)
    })()
  }, [])

  const handleUpdate = async (updates: Record<string, unknown>) => {
    try {
      setIsUpdating(true)
      const success = await updateModelRedirect(updates)
      if (!success) {
        toast.error(t("messages.updateFailed"))
        return
      }
      toast.success(t("messages.updateSuccess"))
    } catch (error) {
      console.error(
        "[ModelRedirectSettings] Failed to update preferences",
        error
      )
      toast.error(t("messages.updateFailed"))
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRegenerateMapping = async () => {
    try {
      setIsRegenerating(true)
      const result = await ModelRedirectService.applyModelRedirect()

      if (result.success) {
        toast.success(t("messages.regenerateSuccess"))
      } else {
        const errorMessage = result.errors?.join("; ") || "Unknown"
        toast.error(t("messages.regenerateFailed", { error: errorMessage }))
      }
    } catch (error) {
      console.error("Failed to regenerate mapping:", error)
      toast.error(t("messages.regenerateFailed", { error: String(error) }))
    } finally {
      setIsRegenerating(false)
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-dark-bg-secondary sm:p-6">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary">
          {t("title")}
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-dark-text-secondary">
          {t("description")}
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700 dark:text-dark-text-primary">
              {t("enable")}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-dark-text-secondary">
              {t("enableDesc")}
            </p>
          </div>
          <Switch
            checked={modelRedirect?.enabled ?? false}
            disabled={isUpdating}
            onChange={async (enabled) => {
              await handleUpdate({ enabled })
            }}
          />
        </div>

        {modelRedirect?.enabled && (
          <>
            <div>
              <MultiSelect
                label={t("standardModels")}
                options={modelList.map((model) => ({
                  value: model,
                  label: model
                }))}
                selected={modelRedirect?.standardModels ?? []}
                onChange={(standardModels) => handleUpdate({ standardModels })}
                placeholder={t("standardModelsPlaceholder")}
                disabled={isUpdating}
                allowCustom
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-dark-text-secondary">
                {t("standardModelsDesc")}
              </p>
            </div>

            <div className="pt-4">
              <button
                type="button"
                disabled={isRegenerating}
                onClick={handleRegenerateMapping}
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600">
                {isRegenerating ? t("regenerating") : t("regenerateButton")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
