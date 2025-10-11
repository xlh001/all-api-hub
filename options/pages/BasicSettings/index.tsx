import {
  BasicSettingsProvider,
  useBasicSettings
} from "~/options/pages/BasicSettings/contexts/BasicSettingsContext"
import DangerousZone from "~/options/pages/BasicSettings/DangerousZone"
import DisplaySettings from "~/options/pages/BasicSettings/DisplaySettings"
import LoadingSkeleton from "~/options/pages/BasicSettings/LoadingSkeleton"
import NewApiSettings from "~/options/pages/BasicSettings/NewApiSettings"
import RefreshSettings from "~/options/pages/BasicSettings/RefreshSettings"
import SettingsHeader from "~/options/pages/BasicSettings/SettingsHeader"

function BasicSettingsContent() {
  const { isLoading } = useBasicSettings()

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="p-6">
      <SettingsHeader />
      <div className="space-y-6">
        <DisplaySettings />
        <RefreshSettings />
        <NewApiSettings />
        <DangerousZone />
      </div>
    </div>
  )
}

export default function BasicSettings() {
  return (
    <BasicSettingsProvider>
      <BasicSettingsContent />
    </BasicSettingsProvider>
  )
}
