import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { TempWindowFallbackReminderGate } from "~/features/AccountManagement/components/TempWindowFallbackReminderGate"
import { TEMP_WINDOW_HEALTH_STATUS_CODES } from "~/types"

const {
  accountDataState,
  reminderPreferenceState,
  updateTempWindowFallbackReminderMock,
} = vi.hoisted(() => ({
  accountDataState: {
    displayData: [] as any[],
  },
  reminderPreferenceState: {
    dismissed: false,
  },
  updateTempWindowFallbackReminderMock: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("~/contexts/UserPreferencesContext", () => ({
  useUserPreferencesContext: () => ({
    tempWindowFallbackReminder: reminderPreferenceState,
    updateTempWindowFallbackReminder: (...args: unknown[]) =>
      updateTempWindowFallbackReminderMock(...args),
  }),
}))

vi.mock("~/features/AccountManagement/hooks/AccountDataContext", () => ({
  useAccountDataContext: () => ({
    displayData: accountDataState.displayData,
  }),
}))

vi.mock(
  "~/features/AccountManagement/components/TempWindowFallbackReminderDialog",
  () => ({
    TempWindowFallbackReminderDialog: ({
      isOpen,
      issue,
      onClose,
      onNeverRemind,
    }: {
      isOpen: boolean
      issue: { accountName: string; settingsTab: string }
      onClose: () => void
      onNeverRemind: () => Promise<void> | void
    }) => (
      <section
        data-testid="temp-window-fallback-reminder"
        data-account-name={issue.accountName}
        data-open={String(isOpen)}
        data-settings-tab={issue.settingsTab}
      >
        <button type="button" onClick={onClose}>
          close reminder
        </button>
        <button
          type="button"
          onClick={() => {
            void onNeverRemind()
          }}
        >
          never remind
        </button>
      </section>
    ),
  }),
)

describe("TempWindowFallbackReminderGate", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    accountDataState.displayData = []
    reminderPreferenceState.dismissed = false
  })

  it("renders nothing when there is no temp-window fallback issue", () => {
    render(<TempWindowFallbackReminderGate />)

    expect(
      screen.queryByTestId("temp-window-fallback-reminder"),
    ).not.toBeInTheDocument()
  })

  it("opens once for the first blocked site and stays closed after the user dismisses it in the same session", () => {
    accountDataState.displayData = [
      {
        id: "acc-1",
        name: "Relay",
        health: {
          code: TEMP_WINDOW_HEALTH_STATUS_CODES.DISABLED,
        },
      },
    ]

    const { rerender } = render(<TempWindowFallbackReminderGate />)

    const reminder = screen.getByTestId("temp-window-fallback-reminder")
    expect(reminder).toHaveAttribute("data-account-name", "Relay")
    expect(reminder).toHaveAttribute("data-settings-tab", "refresh")
    expect(reminder).toHaveAttribute("data-open", "true")

    fireEvent.click(screen.getByRole("button", { name: "close reminder" }))

    expect(reminder).toHaveAttribute("data-open", "false")

    rerender(<TempWindowFallbackReminderGate />)

    expect(reminder).toHaveAttribute("data-open", "false")
  })

  it("keeps the dialog closed when the reminder is already dismissed and persists the never-remind action", async () => {
    accountDataState.displayData = [
      {
        id: "acc-2",
        name: "Permission blocked",
        health: {
          code: TEMP_WINDOW_HEALTH_STATUS_CODES.PERMISSION_REQUIRED,
        },
      },
    ]
    reminderPreferenceState.dismissed = true

    const { rerender } = render(<TempWindowFallbackReminderGate />)

    expect(screen.getByTestId("temp-window-fallback-reminder")).toHaveAttribute(
      "data-open",
      "false",
    )
    expect(screen.getByTestId("temp-window-fallback-reminder")).toHaveAttribute(
      "data-settings-tab",
      "permissions",
    )

    reminderPreferenceState.dismissed = false
    rerender(<TempWindowFallbackReminderGate />)

    fireEvent.click(screen.getByRole("button", { name: "never remind" }))

    await waitFor(() => {
      expect(updateTempWindowFallbackReminderMock).toHaveBeenCalledWith({
        dismissed: true,
      })
    })
  })
})
