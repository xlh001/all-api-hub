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
import AutoRefreshTab from "./components/AutoRefreshTab"
import CheckinRedeemTab from "./components/CheckinRedeemTab"
import DataBackupTab from "./components/DataBackupTab"
import GeneralTab from "./components/GeneralTab"
import LoadingSkeleton from "./components/LoadingSkeleton"
import NewApiTab from "./components/NewApiTab"
import SettingsHeader from "./components/SettingsHeader"

type TabId =
  | "general"
  | "accountManagement"
  | "autoRefresh"
  | "checkinRedeem"
  | "dataBackup"
  | "newApi"

interface TabConfig {
  id: TabId
  component: React.ComponentType
}

const TAB_CONFIGS: TabConfig[] = [
  { id: "general", component: GeneralTab },
  { id: "accountManagement", component: AccountManagementTab },
  { id: "autoRefresh", component: AutoRefreshTab },
  { id: "checkinRedeem", component: CheckinRedeemTab },
  { id: "dataBackup", component: DataBackupTab },
  { id: "newApi", component: NewApiTab }
]

// Map anchor IDs to their corresponding tabs
const ANCHOR_TO_TAB: Record<string, TabId> = {
  "general-display": "general",
  display: "general",
  appearance: "general",
  theme: "general",
  "sorting-priority": "accountManagement",
  sorting: "accountManagement",
  "account-management": "accountManagement",
  "auto-refresh": "autoRefresh",
  refresh: "autoRefresh",
  "checkin-redeem": "checkinRedeem",
  checkin: "checkinRedeem",
  webdav: "dataBackup",
  "webdav-auto-sync": "dataBackup",
  "import-export-entry": "dataBackup",
  "new-api": "newApi",
  "new-api-model-sync": "newApi",
  "dangerous-zone": "newApi"
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
  } = useTabsOverflow(tabs, selectedTab?.id ?? "general", {
    minVisibleTabs: 1,
    moreButtonWidth: 90
  })

  const visibleTabIds = useMemo(
    () => new Set(visibleTabs.map((tab) => tab.id)),
    [visibleTabs]
  )

  const overflowTabIds = useMemo(
    () => new Set(overflowTabs.map((tab) => tab.id)),
    [overflowTabs]
  )

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
          <Tab.List className="-mb-px flex items-center space-x-2 overflow-hidden">
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
            <div className="flex w-full items-center md:hidden">
              <div className="flex flex-1 items-center space-x-1 overflow-hidden">
                {tabs.map((tab, index) => {
                  if (!visibleTabIds.has(tab.id)) return null
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(index)}
                      data-tab-id={tab.id}
                      className={`flex-shrink-0 whitespace-nowrap border-b-2 px-2 py-2 text-xs font-medium transition-colors focus:outline-none sm:px-3 sm:py-2.5 sm:text-sm ${
                        selectedTabIndex === index
                          ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400"
                          : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                      }`}>
                      {tab.label}
                    </button>
                  )
                })}
              </div>

              {/* More Menu for overflow tabs */}
              {hasOverflow && overflowTabs.length > 0 && (
                <Menu as="div" className="relative ml-1 flex-shrink-0">
                  {({ open }) => (
                    <>
                      <Menu.Button
                        className={`flex items-center gap-1 whitespace-nowrap border-b-2 px-2 py-2 text-xs font-medium transition-colors focus:outline-none sm:px-3 sm:py-2.5 sm:text-sm ${
                          overflowTabIds.has(selectedTab?.id ?? "")
                            ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400"
                            : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                        }`}>
                        {t("tabs.more")}
                        <ChevronDownIcon
                          className={`h-3 w-3 transition-transform sm:h-4 sm:w-4 ${open ? "rotate-180" : ""}`}
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
                        <Menu.Items className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-dark-bg-secondary dark:ring-gray-700">
                          <div className="py-1">
                            {tabs.map((tab, index) => {
                              if (!overflowTabIds.has(tab.id)) return null
                              return (
                                <Menu.Item key={tab.id}>
                                  {({ active }) => (
                                    <button
                                      onClick={() => handleTabChange(index)}
                                      className={`block w-full px-4 py-2 text-left text-sm ${
                                        selectedTabIndex === index
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
            className="pointer-events-none fixed left-[-9999px] top-[-9999px] flex space-x-1"
            aria-hidden="true">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                data-tab-id={tab.id}
                className="whitespace-nowrap border-b-2 border-transparent px-2 py-2 text-xs font-medium sm:px-3 sm:py-2.5 sm:text-sm">
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
