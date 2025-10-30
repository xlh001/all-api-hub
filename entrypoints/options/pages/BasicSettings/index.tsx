import { Menu, Tab, Transition } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/24/outline"
import { Fragment, useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { useUserPreferencesContext } from "~/contexts/UserPreferencesContext"
import {
  navigateToAnchor,
  parseTabFromUrl,
  updateUrlWithTab
} from "~/utils/url"

import { useTabsOverflow } from "../../hooks/useTabsOverflow"
import type { Tab as TabType } from "../../hooks/useTabsOverflow"
import AccountManagementTab from "./components/AccountManagementTab"
import AdvancedTab from "./components/AdvancedTab"
import AppearanceLanguageTab from "./components/AppearanceLanguageTab"
import AutoRefreshTab from "./components/AutoRefreshTab"
import CheckinRedeemTab from "./components/CheckinRedeemTab"
import DataBackupTab from "./components/DataBackupTab"
import GeneralTab from "./components/GeneralTab"
import LoadingSkeleton from "./components/LoadingSkeleton"
import SettingsHeader from "./components/SettingsHeader"
import SortingPriorityTab from "./components/SortingPriorityTab"

type TabId =
  | "general"
  | "accountManagement"
  | "sortingPriority"
  | "checkinRedeem"
  | "autoRefresh"
  | "dataBackup"
  | "appearanceLanguage"
  | "advanced"

interface TabConfig {
  id: TabId
  component: React.ComponentType
}

const TAB_CONFIGS: TabConfig[] = [
  { id: "general", component: GeneralTab },
  { id: "accountManagement", component: AccountManagementTab },
  { id: "sortingPriority", component: SortingPriorityTab },
  { id: "checkinRedeem", component: CheckinRedeemTab },
  { id: "autoRefresh", component: AutoRefreshTab },
  { id: "dataBackup", component: DataBackupTab },
  { id: "appearanceLanguage", component: AppearanceLanguageTab },
  { id: "advanced", component: AdvancedTab }
]

// Map anchor IDs to their corresponding tabs
const ANCHOR_TO_TAB: Record<string, TabId> = {
  "general-display": "general",
  display: "general",
  "sorting-priority": "sortingPriority",
  sorting: "sortingPriority",
  "checkin-redeem": "checkinRedeem",
  checkin: "checkinRedeem",
  "auto-refresh": "autoRefresh",
  refresh: "autoRefresh",
  webdav: "dataBackup",
  "webdav-auto-sync": "dataBackup",
  "import-export-entry": "dataBackup",
  appearance: "appearanceLanguage",
  theme: "appearanceLanguage",
  "new-api": "advanced",
  "new-api-model-sync": "advanced",
  "dangerous-zone": "advanced"
}

export default function BasicSettings() {
  const { t } = useTranslation("settings")
  const { isLoading } = useUserPreferencesContext()

  // Define tabs with i18n labels
  const tabs: TabType[] = useMemo(
    () =>
      TAB_CONFIGS.map((config) => ({
        id: config.id,
        label: t(`tabs.${config.id}`)
      })),
    [t]
  )

  // Parse initial tab from URL
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const selectedTab = TAB_CONFIGS[selectedTabIndex]

  // Tab overflow for mobile
  const {
    visibleTabs,
    overflowTabs,
    containerRef,
    measurementRef,
    hasOverflow
  } = useTabsOverflow(tabs, selectedTab.id, {
    minVisibleTabs: 2,
    moreButtonWidth: 100
  })

  const applyUrlState = useCallback(() => {
    const { tab, anchor, isHeadingAnchor } = parseTabFromUrl({
      ignoreAnchors: ["basic"],
      defaultHashPage: "basic"
    })

    if (tab) {
      const index = TAB_CONFIGS.findIndex((cfg) => cfg.id === tab)
      if (index >= 0) {
        setSelectedTabIndex(index)
      }
      return
    }

    if (isHeadingAnchor && anchor) {
      const targetTab = ANCHOR_TO_TAB[anchor]
      if (targetTab) {
        const index = TAB_CONFIGS.findIndex((cfg) => cfg.id === targetTab)
        if (index >= 0) {
          setSelectedTabIndex(index)
          window.setTimeout(() => {
            navigateToAnchor(anchor)
          }, 150)
        }
      }
    }
  }, [])

  // Initialize tab state and listen to history changes
  useEffect(() => {
    applyUrlState()
    window.addEventListener("popstate", applyUrlState)
    window.addEventListener("hashchange", applyUrlState)
    return () => {
      window.removeEventListener("popstate", applyUrlState)
      window.removeEventListener("hashchange", applyUrlState)
    }
  }, [applyUrlState])

  const getTabIndexFromId = useCallback(
    (tabId: string) => TAB_CONFIGS.findIndex((cfg) => cfg.id === tabId),
    []
  )

  // Update URL when tab changes
  const handleTabChange = useCallback((index: number) => {
    if (index < 0 || index >= TAB_CONFIGS.length) return
    setSelectedTabIndex(index)
    const tab = TAB_CONFIGS[index]
    updateUrlWithTab(tab.id, { hashPage: "basic" })
  }, [])

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="p-4 sm:p-6">
      <SettingsHeader />

      <Tab.Group selectedIndex={selectedTabIndex} onChange={handleTabChange}>
        {/* Tab Navigation */}
        <div
          ref={containerRef}
          className="mb-6 border-b border-gray-200 dark:border-dark-bg-tertiary">
          <Tab.List className="flex items-center space-x-2 overflow-x-hidden">
            {/* Desktop: All tabs visible */}
            <div className="hidden md:flex md:space-x-2">
              {tabs.map((tab) => (
                <Tab key={tab.id} as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors focus:outline-none ${
                        selected
                          ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400"
                          : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                      }`}>
                      {tab.label}
                    </button>
                  )}
                </Tab>
              ))}
            </div>

            {/* Mobile: Visible tabs + overflow menu */}
            <div className="flex flex-1 items-center space-x-2 md:hidden">
              {visibleTabs.map((tab) => (
                <Tab key={tab.id} as={Fragment}>
                  {({ selected }) => (
                    <button
                      data-tab-id={tab.id}
                      className={`flex-shrink-0 whitespace-nowrap border-b-2 px-3 py-2.5 text-xs font-medium transition-colors focus:outline-none sm:text-sm ${
                        selected
                          ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400"
                          : "hover-border-gray-300 border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                      }`}>
                      {tab.label}
                    </button>
                  )}
                </Tab>
              ))}

              {/* More Menu for overflow tabs */}
              {hasOverflow && (
                <Menu as="div" className="relative">
                  {({ open }) => (
                    <>
                      <Menu.Button
                        className={`flex items-center gap-1 whitespace-nowrap border-b-2 px-3 py-2.5 text-xs font-medium transition-colors focus:outline-none sm:text-sm ${
                          overflowTabs.some((t) => t.id === selectedTab.id)
                            ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400"
                            : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                        }`}>
                        {t("tabs.more")}
                        <ChevronDownIcon
                          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
                        />
                      </Menu.Button>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95">
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-dark-bg-secondary dark:ring-gray-700">
                          <div className="py-1">
                            {overflowTabs.map((tab) => {
                              const tabIndex = getTabIndexFromId(tab.id)
                              return (
                                <Menu.Item key={tab.id}>
                                  {({ active }) => (
                                    <button
                                      onClick={() => handleTabChange(tabIndex)}
                                      className={`block w-full px-4 py-2 text-left text-sm ${
                                        selectedTab.id === tab.id
                                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                          : active
                                            ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-200"
                                            : "text-gray-700 dark:text-gray-300"
                                      }`}>
                                      {tab.label}
                                    </button>
                                  )}
                                </Menu.Item>
                              )
                            })}
                          </div>
                        </Menu.Items>
                      </Transition>
                    </>
                  )}
                </Menu>
              )}
            </div>
          </Tab.List>

          {/* Hidden measurement container for tab width calculations */}
          <div
            ref={measurementRef}
            className="pointer-events-none fixed left-[-9999px] top-[-9999px] flex space-x-2"
            aria-hidden="true">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                data-tab-id={tab.id}
                className="whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-xs font-medium sm:text-sm">
                {tab.label}
              </div>
            ))}
          </div>
        </div>

        {/* Tab Panels */}
        <Tab.Panels>
          {TAB_CONFIGS.map((config) => {
            const Component = config.component
            return (
              <Tab.Panel key={config.id} unmount={false}>
                <Component />
              </Tab.Panel>
            )
          })}
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}
