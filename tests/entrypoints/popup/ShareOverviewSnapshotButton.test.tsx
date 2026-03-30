import userEvent from "@testing-library/user-event"
import React from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import ShareOverviewSnapshotButton from "~/entrypoints/popup/components/ShareOverviewSnapshotButton"
import { buildDisplaySiteData } from "~~/tests/test-utils/factories"
import { render, screen } from "~~/tests/test-utils/render"

const {
  buildOverviewShareSnapshotPayloadMock,
  exportShareSnapshotWithToastMock,
  getErrorMessageMock,
  loggerErrorMock,
  mockUseAccountDataContext,
  mockUseUserPreferencesContext,
  toastErrorMock,
} = vi.hoisted(() => ({
  buildOverviewShareSnapshotPayloadMock: vi.fn(),
  exportShareSnapshotWithToastMock: vi.fn(),
  getErrorMessageMock: vi.fn(),
  loggerErrorMock: vi.fn(),
  mockUseAccountDataContext: vi.fn(),
  mockUseUserPreferencesContext: vi.fn(),
  toastErrorMock: vi.fn(),
}))

vi.mock("react-hot-toast", () => ({
  default: {
    error: (...args: unknown[]) => toastErrorMock(...args),
  },
}))

vi.mock("react-i18next", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-i18next")>()

  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string, options?: { error?: string }) =>
        options?.error ? `${key}:${options.error}` : key,
    }),
  }
})

vi.mock("~/components/Tooltip", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}))

vi.mock("~/components/ui", () => ({
  IconButton: ({ children, ...props }: any) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
}))

vi.mock("~/contexts/UserPreferencesContext", () => ({
  UserPreferencesProvider: ({ children }: { children: React.ReactNode }) =>
    children,
  useUserPreferencesContext: () => mockUseUserPreferencesContext(),
}))

vi.mock("~/features/AccountManagement/hooks/AccountDataContext", () => ({
  useAccountDataContext: () => mockUseAccountDataContext(),
}))

vi.mock("~/features/ShareSnapshots/utils/exportShareSnapshotWithToast", () => ({
  exportShareSnapshotWithToast: (...args: unknown[]) =>
    exportShareSnapshotWithToastMock(...args),
}))

vi.mock("~/services/sharing/shareSnapshots", () => ({
  buildOverviewShareSnapshotPayload: (...args: unknown[]) =>
    buildOverviewShareSnapshotPayloadMock(...args),
}))

vi.mock("~/utils/core/error", () => ({
  getErrorMessage: (...args: unknown[]) => getErrorMessageMock(...args),
}))

vi.mock("~/utils/core/logger", () => ({
  createLogger: () => ({
    error: (...args: unknown[]) => loggerErrorMock(...args),
  }),
}))

describe("ShareOverviewSnapshotButton", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    buildOverviewShareSnapshotPayloadMock.mockImplementation((input: any) => ({
      kind: "overview",
      backgroundSeed: 1,
      ...input,
    }))
    exportShareSnapshotWithToastMock.mockResolvedValue({ method: "clipboard" })
    getErrorMessageMock.mockImplementation((error: Error) => error.message)
    mockUseUserPreferencesContext.mockReturnValue({
      currencyType: "USD",
      showTodayCashflow: true,
    })

    const enabled = buildDisplaySiteData({
      id: "enabled-1",
      disabled: false,
      last_sync_time: 100,
      balance: { USD: 10, CNY: 70 },
      todayIncome: { USD: 2, CNY: 14 },
      todayConsumption: { USD: 1, CNY: 7 },
    })

    mockUseAccountDataContext.mockReturnValue({
      accounts: [enabled],
      displayData: [enabled],
    })
  })

  it("disables the action when there are no enabled accounts to share", () => {
    const disabledOnly = buildDisplaySiteData({
      id: "disabled-only",
      disabled: true,
    })

    mockUseAccountDataContext.mockReturnValue({
      accounts: [disabledOnly],
      displayData: [disabledOnly],
    })

    render(<ShareOverviewSnapshotButton />)

    expect(
      screen.getByRole("button", {
        name: "shareSnapshots:actions.shareOverviewSnapshot",
      }),
    ).toBeDisabled()
    expect(buildOverviewShareSnapshotPayloadMock).not.toHaveBeenCalled()
    expect(exportShareSnapshotWithToastMock).not.toHaveBeenCalled()
  })

  it("builds an enabled-only overview payload and excludes opt-out balances from the total", async () => {
    const user = userEvent.setup()
    const enabledIncluded = buildDisplaySiteData({
      id: "enabled-included",
      disabled: false,
      last_sync_time: 100,
      balance: { USD: 10, CNY: 70 },
      todayIncome: { USD: 2, CNY: 14 },
      todayConsumption: { USD: 1, CNY: 7 },
    })
    const enabledExcluded = buildDisplaySiteData({
      id: "enabled-excluded",
      disabled: false,
      excludeFromTotalBalance: true,
      last_sync_time: 250,
      balance: { USD: 20, CNY: 140 },
      todayIncome: { USD: 4, CNY: 28 },
      todayConsumption: { USD: 3, CNY: 21 },
    })
    const disabledAccount = buildDisplaySiteData({
      id: "disabled-account",
      disabled: true,
      last_sync_time: 999,
      balance: { USD: 100, CNY: 700 },
      todayIncome: { USD: 100, CNY: 700 },
      todayConsumption: { USD: 100, CNY: 700 },
    })

    mockUseAccountDataContext.mockReturnValue({
      accounts: [enabledIncluded, enabledExcluded, disabledAccount],
      displayData: [enabledIncluded, enabledExcluded, disabledAccount],
    })

    render(<ShareOverviewSnapshotButton />)

    await user.click(
      screen.getByRole("button", {
        name: "shareSnapshots:actions.shareOverviewSnapshot",
      }),
    )

    expect(buildOverviewShareSnapshotPayloadMock).toHaveBeenCalledWith({
      currencyType: "USD",
      enabledAccountCount: 2,
      totalBalance: 10,
      includeTodayCashflow: true,
      todayIncome: 6,
      todayOutcome: 4,
      asOf: 250,
    })
    expect(exportShareSnapshotWithToastMock).toHaveBeenCalledWith({
      payload: expect.objectContaining({
        kind: "overview",
        enabledAccountCount: 2,
        totalBalance: 10,
      }),
    })
  })

  it("omits today cashflow and missing sync timestamps when that preference is disabled", async () => {
    const user = userEvent.setup()
    const firstAccount = buildDisplaySiteData({
      id: "first-account",
      disabled: false,
      last_sync_time: undefined,
      balance: { USD: 9, CNY: 63 },
      todayIncome: { USD: 8, CNY: 56 },
      todayConsumption: { USD: 7, CNY: 49 },
    })
    const secondAccount = buildDisplaySiteData({
      id: "second-account",
      disabled: false,
      last_sync_time: 0,
      balance: { USD: 3, CNY: 21 },
      todayIncome: { USD: 2, CNY: 14 },
      todayConsumption: { USD: 1, CNY: 7 },
    })

    mockUseUserPreferencesContext.mockReturnValue({
      currencyType: "CNY",
      showTodayCashflow: false,
    })
    mockUseAccountDataContext.mockReturnValue({
      accounts: [firstAccount, secondAccount],
      displayData: [firstAccount, secondAccount],
    })

    render(<ShareOverviewSnapshotButton />)

    await user.click(
      screen.getByRole("button", {
        name: "shareSnapshots:actions.shareOverviewSnapshot",
      }),
    )

    expect(buildOverviewShareSnapshotPayloadMock).toHaveBeenCalledWith({
      currencyType: "CNY",
      enabledAccountCount: 2,
      totalBalance: 84,
      includeTodayCashflow: false,
      todayIncome: undefined,
      todayOutcome: undefined,
      asOf: undefined,
    })
  })

  it("logs export failures and falls back to the shared unknown-error message when the error text is blank", async () => {
    const user = userEvent.setup()
    const error = new Error("export failed")

    exportShareSnapshotWithToastMock.mockRejectedValue(error)
    getErrorMessageMock.mockReturnValue("")

    render(<ShareOverviewSnapshotButton />)

    await user.click(
      screen.getByRole("button", {
        name: "shareSnapshots:actions.shareOverviewSnapshot",
      }),
    )

    expect(loggerErrorMock).toHaveBeenCalledWith(
      "Failed to export overview share snapshot",
      error,
    )
    expect(toastErrorMock).toHaveBeenCalledWith(
      "messages:toast.error.operationFailed:messages:errors.unknown",
    )
  })
})
