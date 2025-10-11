import { createRoot } from "react-dom/client"

import { openSidePanel } from "~/utils/navigation"

import FirefoxAddAccountWarningDialog from "./index"

export function showFirefoxWarningDialog(
  onConfirm: () => void = openSidePanel
) {
  const container = document.createElement("div")
  document.body.appendChild(container)
  const root = createRoot(container)

  const handleClose = () => {
    root.unmount()
    container.remove()
  }

  root.render(
    <FirefoxAddAccountWarningDialog
      isOpen={true}
      onClose={handleClose}
      onConfirm={() => {
        handleClose()
        onConfirm?.()
      }}
    />
  )
}
