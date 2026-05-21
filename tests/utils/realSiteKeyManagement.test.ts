import { describe, expect, it } from "vitest"

import { buildRealSiteTestTokenName } from "~~/e2e/utils/realSite/keyManagement"

describe("real-site key management E2E helpers", () => {
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
})
