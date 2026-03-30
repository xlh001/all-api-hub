import toast from "react-hot-toast"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useUsageAnalyticsExport } from "~/features/UsageAnalytics/hooks/useUsageAnalyticsExport"
import * as usageAnalytics from "~/services/history/usageHistory/analytics"
import { USAGE_HISTORY_STORE_SCHEMA_VERSION } from "~/types/usageHistory"
import { renderHook, waitFor } from "~~/tests/test-utils/render"

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe("useUsageAnalyticsExport", () => {
  const originalCreateObjectURL = URL.createObjectURL
  const originalRevokeObjectURL = URL.revokeObjectURL
  const originalCreateElement = document.createElement

  beforeEach(() => {
    vi.restoreAllMocks()
    vi.mocked(toast.success).mockReset()
    vi.mocked(toast.error).mockReset()
    URL.createObjectURL = vi.fn(() => "blob:usage-export") as any
    URL.revokeObjectURL = vi.fn() as any
  })

  afterEach(() => {
    URL.createObjectURL = originalCreateObjectURL
    URL.revokeObjectURL = originalRevokeObjectURL
    document.createElement = originalCreateElement
  })

  it("shows an error toast when export data is unavailable", async () => {
    const { result } = renderHook(() =>
      useUsageAnalyticsExport({
        store: null,
        exportSelection: null,
      }),
    )

    await waitFor(() => {
      expect(result.current).toBeTruthy()
    })
    await result.current.handleExport()

    expect(toast.error).toHaveBeenCalledWith(
      "usageAnalytics:messages.error.exportNoData",
    )
    expect(URL.createObjectURL).not.toHaveBeenCalled()
  })

  it("downloads the computed export and reports success", async () => {
    const exportData = {
      schemaVersion: USAGE_HISTORY_STORE_SCHEMA_VERSION,
      accounts: {},
      fused: {
        daily: {},
        dailyByToken: {},
        tokenNamesById: {},
      },
    }
    const anchor = document.createElementNS(
      "http://www.w3.org/1999/xhtml",
      "a",
    ) as HTMLAnchorElement
    const clickSpy = vi.spyOn(anchor, "click").mockImplementation(() => {})

    vi.spyOn(usageAnalytics, "computeUsageHistoryExport").mockReturnValue(
      exportData as any,
    )
    document.createElement = vi.fn(() => anchor) as any

    const appendChildSpy = vi.spyOn(document.body, "appendChild")
    const removeChildSpy = vi.spyOn(document.body, "removeChild")

    const { result } = renderHook(() =>
      useUsageAnalyticsExport({
        store: {
          schemaVersion: USAGE_HISTORY_STORE_SCHEMA_VERSION,
          accounts: {},
        } as any,
        exportSelection: {
          accountIds: ["account-a"],
          startDay: "2026-01-01",
          endDay: "2026-01-02",
        },
      }),
    )

    await waitFor(() => {
      expect(result.current).toBeTruthy()
    })
    await result.current.handleExport()

    expect(usageAnalytics.computeUsageHistoryExport).toHaveBeenCalledWith({
      store: {
        schemaVersion: USAGE_HISTORY_STORE_SCHEMA_VERSION,
        accounts: {},
      },
      selection: {
        accountIds: ["account-a"],
        startDay: "2026-01-01",
        endDay: "2026-01-02",
      },
    })
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1)
    expect(anchor.href).toBe("blob:usage-export")
    expect(anchor.download).toMatch(
      /^all-api-hub-usage-history-\d{4}-\d{2}-\d{2}\.json$/,
    )
    expect(clickSpy).toHaveBeenCalledTimes(1)
    expect(appendChildSpy).toHaveBeenCalledWith(anchor)
    expect(removeChildSpy).toHaveBeenCalledWith(anchor)
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:usage-export")
    expect(toast.success).toHaveBeenCalledWith(
      "usageAnalytics:messages.success.exported",
    )
  })

  it("surfaces a translated failure toast when export generation fails", async () => {
    vi.spyOn(usageAnalytics, "computeUsageHistoryExport").mockImplementation(
      () => {
        throw new Error("disk full")
      },
    )

    const { result } = renderHook(() =>
      useUsageAnalyticsExport({
        store: {
          schemaVersion: USAGE_HISTORY_STORE_SCHEMA_VERSION,
          accounts: {},
        } as any,
        exportSelection: {
          accountIds: ["account-a"],
          startDay: "2026-01-01",
          endDay: "2026-01-02",
        },
      }),
    )

    await waitFor(() => {
      expect(result.current).toBeTruthy()
    })
    await result.current.handleExport()

    expect(toast.error).toHaveBeenCalledWith(
      "usageAnalytics:messages.error.exportFailed",
    )
    expect(URL.createObjectURL).not.toHaveBeenCalled()
    expect(toast.success).not.toHaveBeenCalled()
  })
})
