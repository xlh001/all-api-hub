import {
  UserPreferencesProvider,
  useUserPreferencesContext
} from "~/contexts/UserPreferencesContext"
import DangerousZone from "~/options/pages/BasicSettings/components/DangerousZone"
import DisplaySettings from "~/options/pages/BasicSettings/components/DisplaySettings"
import LoadingSkeleton from "~/options/pages/BasicSettings/components/LoadingSkeleton"
import NewApiSettings from "~/options/pages/BasicSettings/components/NewApiSettings"
import RefreshSettings from "~/options/pages/BasicSettings/components/RefreshSettings"
import SettingsHeader from "~/options/pages/BasicSettings/components/SettingsHeader"
import SortingPrioritySettings from "~/options/pages/BasicSettings/components/SortingPrioritySettings"

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
