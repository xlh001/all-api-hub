import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

import {
  BodySmall,
  Card,
  CardItem,
  CardList,
  Heading4,
  Input,
  Switch
} from "~/components/ui"
import {
  DEFAULT_PREFERENCES,
  userPreferences
} from "~/services/userPreferences"
import type { AutoCheckinPreferences } from "~/types/autoCheckin"

export default function AutoCheckinSettings() {
  const { t } = useTranslation(["autoCheckin", "settings"])
  const [preferences, setPreferences] = useState<AutoCheckinPreferences | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const loadPreferences = useCallback(async () => {
    try {
      setIsLoading(true)
      const prefs = await userPreferences.getPreferences()
      const config = prefs.autoCheckin ?? DEFAULT_PREFERENCES.autoCheckin!
      setPreferences(config)
    } catch (error) {
      console.error("Failed to load preferences:", error)
      toast.error(t("autoCheckin:messages.error.loadFailed", { error }))
    } finally {
      setIsLoading(false)
    }
  }, [t])

  useEffect(() => {
    void loadPreferences()
  }, [loadPreferences])

  const savePreferences = async (updates: Partial<AutoCheckinPreferences>) => {
    if (!preferences) return

    try {
      setIsSaving(true)
      const updated = { ...preferences, ...updates }
      await userPreferences.savePreferences({ autoCheckin: updated })

      // Notify background to update alarm
      await browser.runtime.sendMessage({
        action: "autoCheckin:updateSettings",
        settings: updates
      })

      setPreferences(updated)
      toast.success(t("autoCheckin:messages.success.settingsSaved"))
    } catch (error) {
      console.error("Failed to save preferences:", error)
      toast.error(t("settings:messages.saveSettingsFailed"))
    } finally {
      setIsSaving(false)
    }
  }

  const handleNavigateToExecution = () => {
    const url = browser.runtime.getURL("options.html#autoCheckin")
    window.location.href = url
  }

  const validateTimeWindow = (start: string, end: string): boolean => {
    const [startH, startM] = start.split(":").map(Number)
    const [endH, endM] = end.split(":").map(Number)

    if (isNaN(startH) || isNaN(startM) || isNaN(endH) || isNaN(endM)) {
      return false
    }

    // Start should not equal end
    if (startH === endH && startM === endM) {
      return false
    }

    return true
  }

  if (isLoading || !preferences) {
    return (
      <section>
        <Heading4 className="mb-2">{t("autoCheckin:settings.title")}</Heading4>
        <BodySmall className="mb-4">{t("autoCheckin:description")}</BodySmall>
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
      <Heading4 className="mb-2">{t("autoCheckin:settings.title")}</Heading4>
      <BodySmall className="mb-4">{t("autoCheckin:description")}</BodySmall>
      <Card padding="none">
        <CardList>
          {/* Enable Auto Check-in */}
          <CardItem
            title={t("autoCheckin:settings.enable")}
            description={t("autoCheckin:settings.enableDesc")}
            rightContent={
              <Switch
                checked={preferences.globalEnabled}
                onChange={(checked) =>
                  savePreferences({ globalEnabled: checked })
                }
                disabled={isSaving}
              />
            }
          />

          {/* Time Window Start */}
          <CardItem
            title={t("autoCheckin:settings.windowStart")}
            description={t("autoCheckin:settings.windowStartDesc")}
            rightContent={
              <Input
                type="time"
                value={preferences.windowStart}
                onChange={(e) => {
                  const newStart = e.target.value
                  if (validateTimeWindow(newStart, preferences.windowEnd)) {
                    savePreferences({ windowStart: newStart })
                  } else {
                    toast.error(
                      t("autoCheckin:messages.error.invalidTimeWindow")
                    )
                  }
                }}
                disabled={isSaving}
                className="w-32"
              />
            }
          />

          {/* Time Window End */}
          <CardItem
            title={t("autoCheckin:settings.windowEnd")}
            description={t("autoCheckin:settings.windowEndDesc")}
            rightContent={
              <Input
                type="time"
                value={preferences.windowEnd}
                onChange={(e) => {
                  const newEnd = e.target.value
                  if (validateTimeWindow(preferences.windowStart, newEnd)) {
                    savePreferences({ windowEnd: newEnd })
                  } else {
                    toast.error(
                      t("autoCheckin:messages.error.invalidTimeWindow")
                    )
                  }
                }}
                disabled={isSaving}
                className="w-32"
              />
            }
          />

          {/* View Execution Button */}
          <CardItem
            title={t("autoCheckin:settings.viewExecution")}
            description={t("autoCheckin:settings.viewExecutionDesc")}
            rightContent={
              <button
                onClick={handleNavigateToExecution}
                className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">
                <span>{t("autoCheckin:settings.viewExecutionButton")}</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </button>
            }
          />
        </CardList>
      </Card>
    </section>
  )
}
