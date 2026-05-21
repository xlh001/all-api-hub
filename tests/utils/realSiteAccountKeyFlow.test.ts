import { beforeEach, describe, expect, it, vi } from "vitest"

import { saveAutoDetectedAccountFromApp } from "~~/e2e/utils/accountLifecycle"
import { installExtensionPageGuards } from "~~/e2e/utils/commonUserFlows"
import { runRealSiteAccountKeyFlow } from "~~/e2e/utils/realSite/accountKeyFlow"
import { runRealSiteKeyLifecycleFromAccountRow } from "~~/e2e/utils/realSite/keyManagement"

const mocks = vi.hoisted(() => ({
  installExtensionPageGuards: vi.fn(),
  saveAutoDetectedAccountFromApp: vi.fn(),
  runRealSiteKeyLifecycleFromAccountRow: vi.fn(),
}))

vi.mock("~~/e2e/utils/commonUserFlows", () => ({
  installExtensionPageGuards: mocks.installExtensionPageGuards,
}))

vi.mock("~~/e2e/utils/accountLifecycle", () => ({
  saveAutoDetectedAccountFromApp: mocks.saveAutoDetectedAccountFromApp,
}))

vi.mock("~~/e2e/utils/realSite/keyManagement", () => ({
  runRealSiteKeyLifecycleFromAccountRow:
    mocks.runRealSiteKeyLifecycleFromAccountRow,
}))

describe("runRealSiteAccountKeyFlow", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("runs the shared app account save and key lifecycle after real-site login", async () => {
    const page = {} as any
    const sitePage = {
      close: vi.fn().mockResolvedValue(undefined),
    } as any
    const prepareDetectedDialog = vi.fn().mockResolvedValue(undefined)
    const login = vi.fn().mockResolvedValue({ prepareDetectedDialog })

    vi.mocked(saveAutoDetectedAccountFromApp).mockResolvedValue({
      siteType: "sub2api",
      baseUrl: "https://sub2api.test",
    })
    vi.mocked(runRealSiteKeyLifecycleFromAccountRow).mockResolvedValue(
      undefined,
    )

    await runRealSiteAccountKeyFlow({
      page,
      extensionId: "extension-id",
      sitePage,
      baseUrl: "https://sub2api.test",
      siteType: "sub2api",
      expectedDetectedSiteType: "sub2api",
      label: "Sub2API",
      login,
    })

    expect(login).toHaveBeenCalledWith(sitePage)
    expect(installExtensionPageGuards).toHaveBeenCalledWith(page)
    expect(saveAutoDetectedAccountFromApp).toHaveBeenCalledWith({
      page,
      extensionId: "extension-id",
      baseUrl: "https://sub2api.test",
      siteType: "sub2api",
      expectedSiteType: "sub2api",
      prepareDetectedDialog,
    })
    expect(runRealSiteKeyLifecycleFromAccountRow).toHaveBeenCalledWith({
      page,
      extensionId: "extension-id",
      siteType: "sub2api",
      baseUrl: "https://sub2api.test",
      label: "Sub2API",
    })
    expect(sitePage.close).toHaveBeenCalledOnce()
  })

  it("closes the real-site page when the app lifecycle fails", async () => {
    const sitePage = {
      close: vi.fn().mockResolvedValue(undefined),
    } as any
    const login = vi.fn().mockResolvedValue(undefined)
    const error = new Error("save failed")

    vi.mocked(saveAutoDetectedAccountFromApp).mockRejectedValue(error)

    await expect(
      runRealSiteAccountKeyFlow({
        page: {} as any,
        extensionId: "extension-id",
        sitePage,
        baseUrl: "https://sub2api.test",
        siteType: "sub2api",
        label: "Sub2API",
        login,
      }),
    ).rejects.toThrow(error)

    expect(runRealSiteKeyLifecycleFromAccountRow).not.toHaveBeenCalled()
    expect(sitePage.close).toHaveBeenCalledOnce()
  })
})
