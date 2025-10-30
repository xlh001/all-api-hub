import { useUserPreferencesContext } from "~/contexts/UserPreferencesContext"

import AutoCheckinSettings from "./components/AutoCheckinSettings"
import DangerousZone from "./components/DangerousZone"
import DisplaySettings from "./components/DisplaySettings"
import LoadingSkeleton from "./components/LoadingSkeleton"
import NewApiModelSyncSettings from "./components/NewApiModelSyncSettings"
import NewApiSettings from "./components/NewApiSettings"
import RefreshSettings from "./components/RefreshSettings"
import SettingsHeader from "./components/SettingsHeader"
import SortingPrioritySettings from "./components/SortingPrioritySettings"

export default function BasicSettings() {
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
        <AutoCheckinSettings />
        <NewApiSettings />
        <NewApiModelSyncSettings />
        <DangerousZone />
      </div>
    </div>
  )
}
