import { beforeEach, describe, expect, it, vi } from "vitest"

import { modelSyncScheduler } from "~/services/modelSync/scheduler"
import {
  DEFAULT_PREFERENCES,
  userPreferences,
} from "~/services/userPreferences"
import { clearAlarm, createAlarm, hasAlarmsAPI } from "~/utils/browserApi"

vi.mock("~/services/userPreferences", () => ({
  DEFAULT_PREFERENCES: {
    managedSiteModelSync: {
      enabled: true,
      interval: 60_000,
      concurrency: 1,
      maxRetries: 1,
      rateLimit: { requestsPerMinute: 10, burst: 2 },
      allowedModels: [],
      globalChannelModelFilters: [],
    },
  },
  userPreferences: {
    getPreferences: vi.fn(),
    savePreferences: vi.fn(),
  },
}))

vi.mock("~/utils/browserApi", () => ({
  clearAlarm: vi.fn(),
  createAlarm: vi.fn(),
  getAlarm: vi.fn(),
  hasAlarmsAPI: vi.fn(),
  onAlarm: vi.fn(),
}))

const mockedUserPreferences = userPreferences as unknown as {
  getPreferences: ReturnType<typeof vi.fn>
}

const mockedBrowserApi = {
  clearAlarm: clearAlarm as unknown as ReturnType<typeof vi.fn>,
  createAlarm: createAlarm as unknown as ReturnType<typeof vi.fn>,
  hasAlarmsAPI: hasAlarmsAPI as unknown as ReturnType<typeof vi.fn>,
}

describe("modelSyncScheduler.setupAlarm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockedBrowserApi.hasAlarmsAPI.mockReturnValue(true)
    mockedUserPreferences.getPreferences.mockResolvedValue({
      managedSiteModelSync: {
        ...(DEFAULT_PREFERENCES as any).managedSiteModelSync,
        enabled: true,
      },
    })
  })

  it("clears and recreates the canonical alarm when enabled", async () => {
    await modelSyncScheduler.setupAlarm()

    expect(mockedBrowserApi.clearAlarm).toHaveBeenCalledWith(
      "managedSiteModelSync",
    )
    expect(mockedBrowserApi.createAlarm).toHaveBeenCalled()
  })
})
