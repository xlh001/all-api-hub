import type { DragEndEvent } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { UI_CONSTANTS } from "~/constants/ui"
import { useUserPreferencesContext } from "~/contexts/UserPreferencesContext"
import { SortingCriteriaType, type SortingFieldConfig } from "~/types/sorting"

import { showUpdateToast } from "../../utils/toastHelpers"
import { SortingPriorityDragList } from "./SortingPriorityDragList"

// Maps sorting criteria IDs to their UI display text (label and description).
// This keeps UI concerns separate from the data-only sorting configuration.
const getSortingCriteriaUiText = (
  t: (key: string) => string
): Record<SortingCriteriaType, { label: string; description?: string }> => ({
  [SortingCriteriaType.CURRENT_SITE]: {
    label: t("basicSettings.currentSitePriority"),
    description: t("basicSettings.currentSiteDesc")
  },
  [SortingCriteriaType.HEALTH_STATUS]: {
    label: t("basicSettings.healthStatus"),
    description: t("basicSettings.healthDesc")
  },
  [SortingCriteriaType.CHECK_IN_REQUIREMENT]: {
    label: t("basicSettings.checkInRequirement"),
    description: t("basicSettings.checkInDesc")
  },
  [SortingCriteriaType.USER_SORT_FIELD]: {
    label: t("basicSettings.userCustomSort"),
    description: t("basicSettings.customSortDesc")
  },
  [SortingCriteriaType.CUSTOM_CHECK_IN_URL]: {
    label: t("basicSettings.customCheckInUrl"),
    description: t("basicSettings.customCheckInDesc")
  }
})

function SortingPrioritySettingsContent() {
  const { t } = useTranslation()
  const {
    sortingPriorityConfig: initialConfig,
    updateSortingPriorityConfig,
    isLoading
  } = useUserPreferencesContext()
  const [items, setItems] = useState<SortingFieldConfig[]>([])

  useEffect(() => {
    if (initialConfig?.criteria) {
      // Sort items based on priority for consistent display
      setItems(
        [...initialConfig.criteria].sort((a, b) => a.priority - b.priority)
      )
    }
  }, [initialConfig])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setItems((currentItems) => {
        const oldIndex = currentItems.findIndex((item) => item.id === active.id)
        const newIndex = currentItems.findIndex((item) => item.id === over.id)
        const reorderedItems = arrayMove(currentItems, oldIndex, newIndex)
        // Update the priority based on the new array index
        return reorderedItems.map((item, index) => ({
          ...item,
          priority: index
        }))
      })
    }
  }

  const handleSave = async () => {
    if (initialConfig) {
      // Create the new config with updated criteria and lastModified timestamp
      const newConfig = {
        ...initialConfig,
        criteria: items,
        lastModified: Date.now()
      }
      const success = await updateSortingPriorityConfig(newConfig)
      showUpdateToast(success, t("basicSettings.sortingPrioritySettings"))
    }
  }

  if (isLoading) {
    return <div>{t("basicSettings.loading")}</div>
  }

  // Augment the data-only items with UI text for rendering
  const sortingCriteriaUiText = getSortingCriteriaUiText(t)
  const augmentedItems = items.map((item) => ({
    ...item,
    ...(sortingCriteriaUiText[item.id] || {
      label: item.id,
      description: t("basicSettings.unknownSortRule")
    })
  }))

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary">
        {t("basicSettings.sortingPrioritySettings")}
      </h2>
      <SortingPriorityDragList
        items={augmentedItems}
        onDragEnd={handleDragEnd}
      />
      <button onClick={handleSave} className={UI_CONSTANTS.STYLES.BUTTON.SAVE}>
        {t("basicSettings.save")}
      </button>
    </div>
  )
}

export default function SortingPrioritySettings() {
  return <SortingPrioritySettingsContent />
}
