import type { DragEndEvent } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { BodySmall, Button, Card, CardFooter, Heading4 } from "~/components/ui"
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
    label: t("settings:sorting.currentSitePriority"),
    description: t("settings:sorting.currentSiteDesc")
  },
  [SortingCriteriaType.HEALTH_STATUS]: {
    label: t("settings:sorting.healthStatus"),
    description: t("settings:sorting.healthDesc")
  },
  [SortingCriteriaType.CHECK_IN_REQUIREMENT]: {
    label: t("settings:sorting.checkInRequirement"),
    description: t("settings:sorting.checkInDesc")
  },
  [SortingCriteriaType.USER_SORT_FIELD]: {
    label: t("settings:sorting.userCustomSort"),
    description: t("settings:sorting.customSortDesc")
  },
  [SortingCriteriaType.CUSTOM_CHECK_IN_URL]: {
    label: t("settings:sorting.customCheckInUrl"),
    description: t("settings:sorting.customCheckInDesc")
  }
})

function SortingPrioritySettingsContent() {
  const { t } = useTranslation("settings")
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
      showUpdateToast(success, t("sorting.title"))
    }
  }

  if (isLoading) {
    return <div>{t("common:status.loading")}</div>
  }

  // Augment the data-only items with UI text for rendering
  const sortingCriteriaUiText = getSortingCriteriaUiText(t)
  const augmentedItems = items.map((item) => ({
    ...item,
    ...(sortingCriteriaUiText[item.id] || {
      label: item.id,
      description: t("sorting.unknownSortRule")
    })
  }))

  return (
    <section className="space-y-3">
      <Heading4>{t("sorting.title")}</Heading4>
      <BodySmall>{t("sorting.description", { defaultValue: "" })}</BodySmall>
      <Card>
        <SortingPriorityDragList
          items={augmentedItems}
          onDragEnd={handleDragEnd}
        />
        <CardFooter>
          <div className="flex justify-end">
            <Button onClick={handleSave} size="sm">
              {t("common:actions.save")}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </section>
  )
}

export default function SortingPrioritySettings() {
  return <SortingPrioritySettingsContent />
}
