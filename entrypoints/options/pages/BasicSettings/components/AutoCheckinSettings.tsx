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
import type {
  AutoCheckinPreferences,
  AutoCheckinStatus
} from "~/types/autoCheckin"

export default function AutoCheckinSettings() {
  const { t } = useTranslation(["autoCheckin", "settings"])
  const [preferences, setPreferences] = useState<AutoCheckinPreferences | null>(
    null
  )
  const [status, setStatus] = useState<AutoCheckinStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const loadPreferences = useCallback(async () => {
    try {
      setIsLoading(true)
      const prefs = await userPreferences.getPreferences()
      const config = prefs.autoCheckin ?? DEFAULT_PREFERENCES.autoCheckin!
      setPreferences(config)

      // Load status
      const response = await browser.runtime.sendMessage({
        action: "autoCheckin:getStatus"
      })
      if (response.success && response.data) {
        setStatus(response.data)
      }
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

      // Reload status to get updated nextScheduledAt
      await loadPreferences()
    } catch (error) {
      console.error("Failed to save preferences:", error)
      toast.error(t("settings:messages.saveSettingsFailed"))
    } finally {
      setIsSaving(false)
    }
  }

  const handleRunNow = async () => {
    try {
      setIsSaving(true)
      toast.loading(t("autoCheckin:messages.loading.running"))
      await browser.runtime.sendMessage({
        action: "autoCheckin:runNow"
      })
      toast.dismiss()
      toast.success(t("autoCheckin:messages.success.runCompleted"))
      await loadPreferences()
    } catch (error) {
      toast.dismiss()
      console.error("Failed to run check-in:", error)
      toast.error(t("autoCheckin:messages.error.runFailed", { error }))
    } finally {
      setIsSaving(false)
    }
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

  const formatDateTime = (isoString?: string): string => {
    if (!isoString) return t("autoCheckin:status.notScheduled")
    try {
      const date = new Date(isoString)
      return date.toLocaleString()
    } catch {
      return t("autoCheckin:status.notScheduled")
    }
  }

  const getResultBadgeColor = (
    result?: "success" | "partial" | "failed"
  ): string => {
    switch (result) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "partial":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    }
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

          {/* Status Display */}
          {status && (
            <>
              <CardItem
                title={t("autoCheckin:status.lastRun")}
                description={formatDateTime(status.lastRunAt)}
                rightContent={
                  status.lastRunResult && (
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium ${getResultBadgeColor(status.lastRunResult)}`}>
                      {t(`autoCheckin:status.result.${status.lastRunResult}`)}
                    </span>
                  )
                }
              />
              <CardItem
                title={t("autoCheckin:status.nextScheduled")}
                description={formatDateTime(status.nextScheduledAt)}
              />
            </>
          )}

          {/* Run Now Button */}
          <CardItem
            title={t("autoCheckin:settings.runNow")}
            description={t("autoCheckin:settings.runNowDesc")}
            rightContent={
              <button
                onClick={handleRunNow}
                disabled={isSaving || !preferences.globalEnabled}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-600">
                {t("autoCheckin:settings.runNowButton")}
              </button>
            }
          />
        </CardList>
      </Card>
    </section>
  )
}
