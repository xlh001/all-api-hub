import {
  UserPreferencesProvider,
  useUserPreferencesContext
} from "~/contexts/UserPreferencesContext"

import DangerousZone from "./components/DangerousZone"
import DisplaySettings from "./components/DisplaySettings"
import LoadingSkeleton from "./components/LoadingSkeleton"
import NewApiModelSyncSettings from "./components/NewApiModelSyncSettings"
import NewApiSettings from "./components/NewApiSettings"
import RefreshSettings from "./components/RefreshSettings"
import SettingsHeader from "./components/SettingsHeader"
import SortingPrioritySettings from "./components/SortingPrioritySettings"

function BasicSettingsContent() {
  const { isLoading } = useUserPreferencesContext()

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="p-6">
      <SettingsHeader />
      <div className="space-y-6">
        <DisplaySettings />
        <RefreshSettings />
        <SortingPrioritySettings />
        <NewApiSettings />
        <NewApiModelSyncSettings />
        <DangerousZone />
      </div>
    </div>
  )
}

export default function BasicSettings() {
  return (
    <UserPreferencesProvider>
      <BasicSettingsContent />
    </UserPreferencesProvider>
  )
}
