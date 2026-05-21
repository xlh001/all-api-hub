import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  createAndVerifyTokenFromApp,
  deleteTokenFromKeyManagementPage,
} from "~~/e2e/utils/accountLifecycle"
import {
  buildRealSiteTestTokenName,
  runRealSiteKeyLifecycleFromAccountRow,
} from "~~/e2e/utils/realSite/keyManagement"

const mocks = vi.hoisted(() => ({
  createAndVerifyTokenFromApp: vi.fn(),
  deleteTokenFromKeyManagementPage: vi.fn(),
}))

vi.mock("~~/e2e/utils/accountLifecycle", () => ({
  createAndVerifyTokenFromApp: mocks.createAndVerifyTokenFromApp,
  deleteTokenFromKeyManagementPage: mocks.deleteTokenFromKeyManagementPage,
}))

describe("real-site key management E2E helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("builds names that are unique and easy to identify for cleanup", () => {
    const name = buildRealSiteTestTokenName({
      label: "New API",
      runId: "run-123",
    })

    expect(name).toBe("AAH E2E NewAPI run-123")
  })

  it("normalizes noisy labels and run ids before using them in live token names", () => {
    const name = buildRealSiteTestTokenName({
      label: "  Done/Hub! ",
      runId: "  2026:05:21 #1  ",
    })

    expect(name).toBe("AAH E2E DoneHub 2026-05-21-1")
  })

  it("keeps live token names below conservative compatible-backend limits", () => {
    const name = buildRealSiteTestTokenName({
      label: "Very Long Compatible Site",
      runId: "run-with-a-long-random-suffix",
    })

    expect(name.length).toBeLessThanOrEqual(30)
    expect(name).toBe("AAH E2E VeryLong run-with-a-l")
  })

  it("attempts UI cleanup when token creation fails after submitting a live token name", async () => {
    const page = {} as any
    const submittedPage = { page: "key-management" } as any
    const creationError = new Error("token row did not reload")

    vi.spyOn(Date, "now").mockReturnValue(1_773_600_000_000)
    vi.spyOn(Math, "random").mockReturnValue(0.123456789)
    vi.mocked(createAndVerifyTokenFromApp).mockImplementation(
      async (params) => {
        params.onTokenSubmitted?.({
          page: submittedPage,
          tokenName: expectedTokenName,
        })
        throw creationError
      },
    )
    vi.mocked(deleteTokenFromKeyManagementPage).mockResolvedValue(undefined)

    const expectedTokenName = buildRealSiteTestTokenName({
      label: "New API",
      runId: "s3naio4fzz",
    })

    await expect(
      runRealSiteKeyLifecycleFromAccountRow({
        page,
        extensionId: "extension-id",
        siteType: "new-api",
        baseUrl: "https://new-api.test",
        label: "New API",
      }),
    ).rejects.toThrow(creationError)

    expect(createAndVerifyTokenFromApp).toHaveBeenCalledWith({
      page,
      extensionId: "extension-id",
      siteType: "new-api",
      baseUrl: "https://new-api.test",
      tokenName: expectedTokenName,
      openFromAccountRow: true,
      onTokenSubmitted: expect.any(Function),
    })
    expect(deleteTokenFromKeyManagementPage).toHaveBeenCalledWith({
      page: submittedPage,
      token: expectedTokenName,
    })
  })
})
