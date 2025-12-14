import { NEW_API } from "~/constants/siteType"
import { useUserPreferencesContext } from "~/contexts/UserPreferencesContext"

import ManagedSiteModelSyncSettings from "./managedSiteModelSyncSettings"
import ManagedSiteSelector from "./ManagedSiteSelector"
import ModelRedirectSettings from "./ModelRedirectSettings"
import NewApiSettings from "./NewApiSettings"
import VeloeraSettings from "./VeloeraSettings"

/**
 * Basic Settings tab aggregating managed site selector, New API/Veloera settings,
 * model sync, and model redirect.
 */
export default function ManagedSiteTab() {
  const { managedSiteType } = useUserPreferencesContext()

  return (
    <div className="space-y-6">
      <ManagedSiteSelector />

      {managedSiteType === NEW_API ? <NewApiSettings /> : <VeloeraSettings />}

      <ManagedSiteModelSyncSettings />

      <ModelRedirectSettings />
    </div>
  )
}
