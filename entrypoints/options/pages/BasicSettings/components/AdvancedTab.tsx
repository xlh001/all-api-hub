import DangerousZone from "./DangerousZone"
import NewApiModelSyncSettings from "./NewApiModelSyncSettings"
import NewApiSettings from "./NewApiSettings"

export default function AdvancedTab() {
  return (
    <div className="space-y-6">
      <section id="new-api">
        <NewApiSettings />
      </section>

      <section id="new-api-model-sync">
        <NewApiModelSyncSettings />
      </section>

      <section id="dangerous-zone">
        <DangerousZone />
      </section>
    </div>
  )
}
