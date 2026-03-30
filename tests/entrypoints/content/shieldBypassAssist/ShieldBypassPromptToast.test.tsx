import { waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { ShieldBypassPromptToast } from "~/entrypoints/content/shieldBypassAssist/components/ShieldBypassPromptToast"
import { render, screen } from "~~/tests/test-utils/render"

vi.mock("react-i18next", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-i18next")>()

  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => {
        const map: Record<string, string> = {
          titlePrefix: "Shield Mode",
          "toast.title": "Shield Prompt",
          "toast.body": "Complete the browser verification first.",
          "toast.actions.dismiss": "Dismiss",
          "toast.actions.openSettings": "Open settings",
        }
        return map[key] ?? key
      },
    }),
  }
})

describe("ShieldBypassPromptToast", () => {
  it("prefixes and keeps the document title in sync with host-page updates, then restores the base title on cleanup", async () => {
    document.title = "Original Title"

    const { unmount } = render(
      <ShieldBypassPromptToast onDismiss={vi.fn()} onOpenSettings={vi.fn()} />,
    )

    await waitFor(() => {
      expect(document.title).toBe("Shield Mode · Original Title")
    })

    document.title = "Host Changed Title"

    await waitFor(() => {
      expect(document.title).toBe("Shield Mode · Host Changed Title")
    })

    unmount()

    expect(document.title).toBe("Host Changed Title")
  })

  it("normalizes an already-prefixed title and wires the dismiss/settings actions", async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    const onOpenSettings = vi.fn()

    document.title = "Shield Mode Existing Title"

    const { unmount } = render(
      <ShieldBypassPromptToast
        onDismiss={onDismiss}
        onOpenSettings={onOpenSettings}
      />,
    )

    expect(await screen.findByText("Shield Prompt")).toBeInTheDocument()
    expect(
      screen.getByText("Complete the browser verification first."),
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(document.title).toBe("Shield Mode · Existing Title")
    })

    await user.click(screen.getByRole("button", { name: "Dismiss" }))
    await user.click(screen.getByRole("button", { name: "Open settings" }))

    expect(onDismiss).toHaveBeenCalledTimes(1)
    expect(onOpenSettings).toHaveBeenCalledTimes(1)

    unmount()

    expect(document.title).toBe("Existing Title")
  })
})
