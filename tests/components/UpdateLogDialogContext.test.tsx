import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import {
  UpdateLogDialogContainer,
  UpdateLogDialogProvider,
  useUpdateLogDialogContext,
} from "~/components/dialogs/UpdateLogDialog"

vi.mock(
  "~/components/dialogs/UpdateLogDialog/components/UpdateLogDialog",
  () => ({
    UpdateLogDialog: ({
      isOpen,
      onClose,
      version,
    }: {
      isOpen: boolean
      onClose: () => void
      version: string
    }) => (
      <section data-testid="update-log-dialog" data-open={String(isOpen)}>
        <span>{version}</span>
        <button type="button" onClick={onClose}>
          close dialog
        </button>
      </section>
    ),
  }),
)

function ContextHarness() {
  const { state, openDialog, closeDialog } = useUpdateLogDialogContext()

  return (
    <div>
      <div data-testid="dialog-state">{JSON.stringify(state)}</div>
      <button
        type="button"
        onClick={() => {
          openDialog(" 2.39.0 ")
        }}
      >
        open trimmed
      </button>
      <button
        type="button"
        onClick={() => {
          openDialog("   ")
        }}
      >
        open blank
      </button>
      <button type="button" onClick={closeDialog}>
        close state
      </button>
    </div>
  )
}

function HookOutsideProvider() {
  useUpdateLogDialogContext()
  return null
}

describe("UpdateLogDialogContext", () => {
  it("throws when the hook is used outside the provider", () => {
    expect(() => render(<HookOutsideProvider />)).toThrow(
      "useUpdateLogDialogContext must be used within an UpdateLogDialogProvider",
    )
  })

  it("trims versions, ignores blank input, and closes without clearing the last version", () => {
    render(
      <UpdateLogDialogProvider>
        <ContextHarness />
      </UpdateLogDialogProvider>,
    )

    expect(screen.getByTestId("dialog-state")).toHaveTextContent(
      JSON.stringify({ isOpen: false, version: null }),
    )

    fireEvent.click(screen.getByRole("button", { name: "open blank" }))

    expect(screen.getByTestId("dialog-state")).toHaveTextContent(
      JSON.stringify({ isOpen: false, version: null }),
    )

    fireEvent.click(screen.getByRole("button", { name: "open trimmed" }))

    expect(screen.getByTestId("dialog-state")).toHaveTextContent(
      JSON.stringify({ isOpen: true, version: "2.39.0" }),
    )

    fireEvent.click(screen.getByRole("button", { name: "close state" }))

    expect(screen.getByTestId("dialog-state")).toHaveTextContent(
      JSON.stringify({ isOpen: false, version: "2.39.0" }),
    )
  })

  it("renders the container only after a version is opened and wires closeDialog through the dialog props", () => {
    render(
      <UpdateLogDialogProvider>
        <ContextHarness />
        <UpdateLogDialogContainer />
      </UpdateLogDialogProvider>,
    )

    expect(screen.queryByTestId("update-log-dialog")).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "open trimmed" }))

    expect(screen.getByTestId("update-log-dialog")).toHaveAttribute(
      "data-open",
      "true",
    )
    expect(screen.getByTestId("update-log-dialog")).toHaveTextContent("2.39.0")

    fireEvent.click(screen.getByRole("button", { name: "close dialog" }))

    expect(screen.getByTestId("update-log-dialog")).toHaveAttribute(
      "data-open",
      "false",
    )
  })
})
