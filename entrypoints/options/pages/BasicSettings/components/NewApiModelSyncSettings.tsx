import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline"
import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

import {
  BodySmall,
  Button,
  Card,
  CardItem,
  CardList,
  Heading4,
  Input,
  Switch
} from "~/components/ui"
import { newApiModelSyncStorage } from "~/services/newApiModelSync"
import type { NewApiModelSyncPreferences } from "~/types/newApiModelSync"

export default function NewApiModelSyncSettings() {
  const { t } = useTranslation(["newApiModelSync", "settings"])
  const [preferences, setPreferences] =
    useState<NewApiModelSyncPreferences | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const loadPreferences = useCallback(async () => {
    try {
      setIsLoading(true)
      const prefs = await newApiModelSyncStorage.getPreferences()
      setPreferences(prefs)
    } catch (error) {
      console.error("Failed to load preferences:", error)
      toast.error(t("newApiModelSync:messages.error.loadFailed", { error }))
    } finally {
      setIsLoading(false)
    }
  }, [t])

  useEffect(() => {
    void loadPreferences()
  }, [loadPreferences])

  const savePreferences = async (
    updates: Partial<NewApiModelSyncPreferences>
  ) => {
    if (!preferences) return

    try {
      setIsSaving(true)
      const updated = { ...preferences, ...updates }
      await newApiModelSyncStorage.savePreferences(updated)

      // Notify background to update alarm
      await browser.runtime.sendMessage({
        action: "newApiModelSync:updateSettings",
        settings: updates
      })

      setPreferences(updated)
      toast.success(t("newApiModelSync:messages.success.settingsSaved"))
    } catch (error) {
      console.error("Failed to save preferences:", error)
      toast.error(t("settings:general.saveFailed"))
    } finally {
      setIsSaving(false)
    }
  }

  const handleNavigateToExecution = () => {
    // Navigate to the NewApiModelSync page
    const url = browser.runtime.getURL("options.html#/newApiModelSync")
    window.location.href = url
  }

  if (isLoading || !preferences) {
    return (
      <section>
        <Heading4 className="mb-2">
          {t("newApiModelSync:settings.title")}
        </Heading4>
        <BodySmall className="mb-4">
          {t("newApiModelSync:description")}
        </BodySmall>
        <Card padding="none">
          <div className="animate-pulse space-y-4 p-6">
            <div className="h-6 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-10 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </Card>
      </section>
    )
  }

  return (
    <section>
      <Heading4 className="mb-2">
        {t("newApiModelSync:settings.title")}
      </Heading4>
      <BodySmall className="mb-4">{t("newApiModelSync:description")}</BodySmall>
      <Card padding="none">
        <CardList>
          {/* Enable Auto-Sync */}
          <CardItem
            title={t("newApiModelSync:settings.enable")}
            description={t("newApiModelSync:settings.enableDesc")}
            rightContent={
              <Switch
                checked={preferences.enableSync}
                onChange={(checked) => savePreferences({ enableSync: checked })}
                disabled={isSaving}
              />
            }
          />

          {/* Sync Interval */}
          <CardItem
            title={t("newApiModelSync:settings.interval")}
            description={t("newApiModelSync:settings.intervalDesc")}
            rightContent={
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  max="720"
                  value={String(preferences.intervalMs / (1000 * 60 * 60))}
                  onChange={(e) => {
                    const hours = parseFloat(e.target.value)
                    if (hours > 0) {
                      savePreferences({
                        intervalMs: hours * 60 * 60 * 1000
                      })
                    }
                  }}
                  disabled={isSaving}
                  className="w-24"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t("newApiModelSync:settings.intervalUnit")}
                </span>
              </div>
            }
          />

          {/* Concurrency */}
          <CardItem
            title={t("newApiModelSync:settings.concurrency")}
            description={t("newApiModelSync:settings.concurrencyDesc")}
            rightContent={
              <Input
                type="number"
                min="1"
                max="20"
                value={String(preferences.concurrency)}
                onChange={(e) => {
                  const concurrency = parseInt(e.target.value)
                  if (concurrency > 0 && concurrency <= 20) {
                    savePreferences({ concurrency })
                  }
                }}
                disabled={isSaving}
                className="w-24"
              />
            }
          />

          {/* Max Retries */}
          <CardItem
            title={t("newApiModelSync:settings.maxRetries")}
            description={t("newApiModelSync:settings.maxRetriesDesc")}
            rightContent={
              <Input
                type="number"
                min="0"
                max="5"
                value={String(preferences.maxRetries)}
                onChange={(e) => {
                  const maxRetries = parseInt(e.target.value)
                  if (maxRetries >= 0 && maxRetries <= 5) {
                    savePreferences({ maxRetries })
                  }
                }}
                disabled={isSaving}
                className="w-24"
              />
            }
          />

          {/* View Execution Button */}
          <CardItem
            title={t("newApiModelSync:settings.viewExecution")}
            description={t("newApiModelSync:settings.viewExecutionDesc")}
            rightContent={
              <Button
                onClick={handleNavigateToExecution}
                variant="default"
                size="sm"
                className="flex items-center gap-2">
                <span>{t("newApiModelSync:settings.viewExecutionButton")}</span>
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </Button>
            }
          />
        </CardList>
      </Card>
    </section>
  )
}
