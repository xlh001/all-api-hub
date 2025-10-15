import { Tab } from "@headlessui/react"
import { CpuChipIcon } from "@heroicons/react/24/outline"
import { useEffect, useRef, type ReactNode } from "react"
import { useTranslation } from "react-i18next"

import { getProviderConfig, type ProviderType } from "~/utils/modelProviders"

interface ProviderTabsProps {
  providers: ProviderType[]
  selectedProvider: ProviderType | "all"
  setSelectedProvider: (provider: ProviderType | "all") => void
  baseFilteredModelsCount: number
  getProviderFilteredCount: (provider: ProviderType) => number
  children: ReactNode
}

export function ProviderTabs({
  providers,
  selectedProvider,
  setSelectedProvider,
  baseFilteredModelsCount,
  getProviderFilteredCount,
  children
}: ProviderTabsProps) {
  const { t } = useTranslation()
  const tabListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tabList = tabListRef.current
    if (!tabList) return

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return
      e.preventDefault()
      tabList.scrollTo({
        left: tabList.scrollLeft + e.deltaY,
        behavior: "auto"
      })
    }

    tabList.addEventListener("wheel", onWheel)
    return () => tabList.removeEventListener("wheel", onWheel)
  }, [])

  const scrollToSelectedTab = (selectedIndex: number) => {
    if (!tabListRef.current) return

    const tabList = tabListRef.current
    const tabs = tabList.children

    if (selectedIndex >= 0 && selectedIndex < tabs.length) {
      const selectedTab = tabs[selectedIndex] as HTMLElement
      const tabListRect = tabList.getBoundingClientRect()
      const selectedTabRect = selectedTab.getBoundingClientRect()

      const tabLeft =
        selectedTabRect.left - tabListRect.left + tabList.scrollLeft
      const idealScrollLeft =
        tabLeft - tabList.clientWidth / 2 + selectedTabRect.width / 2

      tabList.scrollTo({
        left: Math.max(0, idealScrollLeft),
        behavior: "smooth"
      })
    }
  }

  useEffect(() => {
    const selectedIndex =
      selectedProvider === "all"
        ? 0
        : Math.max(0, providers.indexOf(selectedProvider as ProviderType) + 1)
    setTimeout(() => scrollToSelectedTab(selectedIndex), 100)
  }, [selectedProvider, providers])

  const selectedIndex =
    selectedProvider === "all"
      ? 0
      : Math.max(0, providers.indexOf(selectedProvider as ProviderType) + 1)

  return (
    <Tab.Group
      selectedIndex={selectedIndex}
      onChange={(index) => {
        const newProvider = index === 0 ? "all" : providers[index - 1]
        setSelectedProvider(newProvider)
        setTimeout(() => scrollToSelectedTab(index), 50)
      }}>
      <Tab.List
        ref={tabListRef}
        className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-dark-bg-tertiary p-1 mb-6 overflow-x-auto touch-pan-x scrollbar-hide">
        <Tab
          className={({ selected }) =>
            `flex-shrink-0 rounded-lg py-2.5 px-4 text-sm font-medium leading-5 transition-all ${
              selected
                ? "bg-white dark:bg-dark-bg-secondary text-blue-700 dark:text-blue-400 shadow"
                : "text-gray-700 dark:text-dark-text-secondary hover:bg-white/60 dark:hover:bg-dark-bg-secondary/60 hover:text-gray-900 dark:hover:text-dark-text-primary"
            }`
          }>
          <div className="flex items-center justify-center space-x-2">
            <CpuChipIcon className="w-4 h-4 text-gray-600 dark:text-dark-text-secondary" />
            <span>
              {t("modelList.allProviders", { count: baseFilteredModelsCount })}
            </span>
          </div>
        </Tab>
        {providers.map((provider) => {
          const providerConfig = getProviderConfig(
            provider.toLowerCase().replace(/\s/g, "-")
          )
          const IconComponent = providerConfig.icon
          return (
            <Tab
              key={provider}
              className={({ selected }) =>
                `flex-shrink-0 rounded-lg py-2.5 px-4 text-sm font-medium leading-5 transition-all ${
                  selected
                    ? "bg-white dark:bg-dark-bg-secondary text-blue-700 dark:text-blue-400 shadow"
                    : "text-gray-700 dark:text-dark-text-secondary hover:bg-white/60 dark:hover:bg-dark-bg-secondary/60 hover:text-gray-900 dark:hover:text-dark-text-primary"
                }`
              }>
              <div className="flex items-center justify-center space-x-2">
                <IconComponent className="w-4 h-4" />
                <span>
                  {provider} ({getProviderFilteredCount(provider)})
                </span>
              </div>
            </Tab>
          )
        })}
      </Tab.List>
      {children}
    </Tab.Group>
  )
}
