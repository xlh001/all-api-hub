import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("~/utils/browser/browserApi", () => ({
  sendRuntimeActionMessage: vi.fn(),
}))

describe("ldohSiteLookup runtime", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns a validated success response from background", async () => {
    const { sendRuntimeActionMessage } = await import(
      "~/utils/browser/browserApi"
    )
    vi.mocked(sendRuntimeActionMessage).mockResolvedValueOnce({
      success: true,
      cachedCount: 3,
    })

    const { requestLdohSiteLookupRefreshSites } = await import(
      "~/services/integrations/ldohSiteLookup/runtime"
    )

    await expect(requestLdohSiteLookupRefreshSites()).resolves.toEqual({
      success: true,
      cachedCount: 3,
    })
  })

  it("preserves authenticated failure details from background", async () => {
    const { sendRuntimeActionMessage } = await import(
      "~/utils/browser/browserApi"
    )
    vi.mocked(sendRuntimeActionMessage).mockResolvedValueOnce({
      success: false,
      unauthenticated: true,
      error: "Sign in required",
    })

    const { requestLdohSiteLookupRefreshSites } = await import(
      "~/services/integrations/ldohSiteLookup/runtime"
    )

    await expect(requestLdohSiteLookupRefreshSites()).resolves.toEqual({
      success: false,
      unauthenticated: true,
      error: "Sign in required",
    })
  })

  it("rejects missing or malformed background responses", async () => {
    const { sendRuntimeActionMessage } = await import(
      "~/utils/browser/browserApi"
    )
    const { requestLdohSiteLookupRefreshSites } = await import(
      "~/services/integrations/ldohSiteLookup/runtime"
    )

    vi.mocked(sendRuntimeActionMessage).mockResolvedValueOnce(undefined)
    await expect(requestLdohSiteLookupRefreshSites()).resolves.toEqual({
      success: false,
      error: "No response from background.",
    })

    vi.mocked(sendRuntimeActionMessage).mockResolvedValueOnce({
      success: true,
      cachedCount: -1,
    })
    await expect(requestLdohSiteLookupRefreshSites()).resolves.toEqual({
      success: false,
      error: "Invalid response from background.",
    })

    vi.mocked(sendRuntimeActionMessage).mockResolvedValueOnce({
      success: false,
      error: "",
    })
    await expect(requestLdohSiteLookupRefreshSites()).resolves.toEqual({
      success: false,
      error: "Invalid response from background.",
    })
  })
})
