import { afterEach, describe, expect, it, vi } from "vitest"

import { UpdateLogDialog } from "~/components/dialogs/UpdateLogDialog"
import { userPreferences } from "~/services/preferences/userPreferences"
import { buildUserPreferences } from "~~/tests/test-utils/factories"
import { fireEvent, render, screen, waitFor } from "~~/tests/test-utils/render"

describe("UpdateLogDialog", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("toggles the open-changelog-on-update preference from the dialog", async () => {
    vi.spyOn(userPreferences, "getPreferences").mockResolvedValue(
      buildUserPreferences({ openChangelogOnUpdate: true }),
    )

    const updateSpy = vi
      .spyOn(userPreferences, "updateOpenChangelogOnUpdate")
      .mockResolvedValue(true)

    render(<UpdateLogDialog isOpen onClose={() => {}} version="2.39.0" />)

    const toggleButton = await screen.findByTestId(
      "update-log-dialog-auto-open-toggle",
    )

    expect(toggleButton).toHaveTextContent(
      "ui:dialog.updateLog.disableAutoOpen",
    )

    fireEvent.click(toggleButton)

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledWith(false)
    })

    await waitFor(() => {
      expect(toggleButton).toHaveTextContent(
        "ui:dialog.updateLog.enableAutoOpen",
      )
    })

    fireEvent.click(toggleButton)

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledWith(true)
    })

    await waitFor(() => {
      expect(toggleButton).toHaveTextContent(
        "ui:dialog.updateLog.disableAutoOpen",
      )
    })
  })

  it("uses a responsive footer layout so action buttons do not overflow", async () => {
    vi.spyOn(userPreferences, "getPreferences").mockResolvedValue(
      buildUserPreferences({ openChangelogOnUpdate: true }),
    )

    render(<UpdateLogDialog isOpen onClose={() => {}} version="2.39.0" />)

    expect(await screen.findByTestId("update-log-dialog-footer")).toHaveClass(
      "flex-col",
      "sm:flex-row",
    )

    expect(screen.getByTestId("update-log-dialog-footer-actions")).toHaveClass(
      "flex-col",
      "sm:flex-row",
    )

    expect(
      screen.getByTestId("update-log-dialog-auto-open-toggle"),
    ).toHaveClass("h-auto", "min-h-9", "w-full", "whitespace-normal")

    expect(
      screen.getByTestId("update-log-dialog-open-full-changelog"),
    ).toHaveClass("h-auto", "min-h-9", "w-full", "whitespace-normal")
  })
})
