import { useCallback, useEffect, useMemo, useRef, useState } from "react"

export interface Tab {
  id: string
  label: string
}

export interface UseTabsOverflowResult {
  visibleTabs: Tab[]
  overflowTabs: Tab[]
  containerRef: React.RefObject<HTMLDivElement | null>
  measurementRef: React.RefObject<HTMLDivElement | null>
  hasOverflow: boolean
}

/**
 * Hook to handle tab overflow on mobile/narrow screens
 * Measures tab widths via an off-screen measurement container
 * and determines which tabs should be visible vs in overflow menu
 */
export function useTabsOverflow(
  tabs: Tab[],
  selectedTabId: string,
  options: {
    minVisibleTabs?: number
    containerPadding?: number
    tabGap?: number
    moreButtonWidth?: number
  } = {}
): UseTabsOverflowResult {
  const {
    minVisibleTabs = 1,
    containerPadding = 24,
    tabGap = 8,
    moreButtonWidth = 80
  } = options

  const containerRef = useRef<HTMLDivElement | null>(null)
  const measurementRef = useRef<HTMLDivElement | null>(null)

  const [visibleTabs, setVisibleTabs] = useState<Tab[]>(tabs)
  const [overflowTabs, setOverflowTabs] = useState<Tab[]>([])
  const [hasOverflow, setHasOverflow] = useState(false)

  const tabWidths = useMemo(() => new Map<string, number>(), [])

  const measureTabs = useCallback(() => {
    const container = measurementRef.current
    if (!container) return

    const elements = Array.from(
      container.querySelectorAll<HTMLElement>("[data-tab-id]")
    )

    elements.forEach((element) => {
      const id = element.getAttribute("data-tab-id")
      if (!id) return
      const rect = element.getBoundingClientRect()
      tabWidths.set(id, rect.width + tabGap)
    })
  }, [tabGap, tabWidths])

  useEffect(() => {
    measureTabs()

    const calculateOverflow = () => {
      const container = containerRef.current
      if (!container) return

      // Ensure measurements are up to date
      measureTabs()

      const containerWidth = container.offsetWidth - containerPadding

      // Default to all tabs visible if measurements missing
      if (tabWidths.size === 0) {
        setVisibleTabs(tabs)
        setOverflowTabs([])
        setHasOverflow(false)
        return
      }

      const orderedTabs = tabs.map((tab) => ({
        ...tab,
        width: tabWidths.get(tab.id) ?? 0
      }))

      const selectedIndex = orderedTabs.findIndex(
        (tab) => tab.id === selectedTabId
      )

      const visible: Tab[] = []
      const overflow: Tab[] = []
      let currentWidth = 0

      const addTab = (tab: Tab & { width: number }) => {
        visible.push({ id: tab.id, label: tab.label })
        currentWidth += tab.width
      }

      // Add selected tab first to ensure it is visible
      if (selectedIndex >= 0) {
        const selected = orderedTabs[selectedIndex]
        addTab(selected)
      }

      orderedTabs.forEach((tab, index) => {
        if (index === selectedIndex) return

        const remainingTabs =
          orderedTabs.length - (visible.length + overflow.length) - 1
        const needsMoreButton = overflow.length > 0 || remainingTabs > 0
        const availableWidth =
          containerWidth - (needsMoreButton ? moreButtonWidth : 0)

        if (currentWidth + tab.width <= availableWidth) {
          addTab(tab)
        } else {
          overflow.push({ id: tab.id, label: tab.label })
        }
      })

      // Ensure minimum number of visible tabs
      let overflowIndex = 0
      while (
        visible.length < minVisibleTabs &&
        overflowIndex < overflow.length
      ) {
        const tab = overflow[overflowIndex]
        const width = tabWidths.get(tab.id) ?? 0
        if (currentWidth + width <= containerWidth) {
          visible.push(tab)
          currentWidth += width
          overflow.splice(overflowIndex, 1)
        } else {
          overflowIndex++
        }
      }

      // Maintain original order for both arrays
      const sortByOriginalOrder = (items: Tab[]) =>
        items.sort(
          (a, b) =>
            tabs.findIndex((tab) => tab.id === a.id) -
            tabs.findIndex((tab) => tab.id === b.id)
        )

      setVisibleTabs(sortByOriginalOrder(visible))
      setOverflowTabs(sortByOriginalOrder(overflow))
      setHasOverflow(overflow.length > 0)
    }

    calculateOverflow()

    const handleResize = () => {
      calculateOverflow()
    }

    window.addEventListener("resize", handleResize)

    let resizeObserver: ResizeObserver | null = null
    if (typeof ResizeObserver !== "undefined" && containerRef.current) {
      resizeObserver = new ResizeObserver(handleResize)
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      window.removeEventListener("resize", handleResize)
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [
    tabs,
    selectedTabId,
    containerPadding,
    moreButtonWidth,
    minVisibleTabs,
    measureTabs,
    tabWidths
  ])

  return {
    visibleTabs,
    overflowTabs,
    containerRef,
    measurementRef,
    hasOverflow
  }
}
