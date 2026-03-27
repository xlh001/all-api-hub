import { afterEach, describe, expect, it, vi } from "vitest"

import { RuntimeActionIds } from "~/constants/runtimeActions"
import { DEFAULT_PREFERENCES } from "~/services/preferences/userPreferences"

vi.mock("~/services/preferences/userPreferences", async (importOriginal) => {
  const actual =
    await importOriginal<
      typeof import("~/services/preferences/userPreferences")
    >()
  return {
    ...actual,
    userPreferences: {
      getPreferences: vi.fn(),
    },
  }
})

afterEach(() => {
  vi.doUnmock("~/services/accounts/accountStorage")
  vi.doUnmock("~/services/redemption/redeemService")
  vi.resetModules()
  vi.restoreAllMocks()
})

describe("redemptionAssist shouldPrompt batch filtering", () => {
  it("returns only prompt-eligible codes for a url", async () => {
    vi.resetModules()
    const { userPreferences } = await import(
      "~/services/preferences/userPreferences"
    )
    const getPreferencesMock = vi.mocked(userPreferences.getPreferences)

    getPreferencesMock.mockResolvedValue({
      ...DEFAULT_PREFERENCES,
      redemptionAssist: {
        enabled: true,
        contextMenu: {
          enabled: true,
        },
        urlWhitelist: {
          enabled: false,
          patterns: [""],
          includeAccountSiteUrls: true,
          includeCheckInAndRedeemUrls: true,
        },
        // Strict hex validation for this test case.
        relaxedCodeValidation: false,
      },
    })

    const { handleRedemptionAssistMessage } = await import(
      "~/services/redemption/redemptionAssist"
    )

    const validHex = "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6"
    const invalidHex = "g1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6"
    const tooShort = "1234"

    const sendResponse = vi.fn()

    await handleRedemptionAssistMessage(
      {
        action: RuntimeActionIds.RedemptionAssistShouldPrompt,
        url: "https://example.com/redeem",
        codes: [validHex, invalidHex, tooShort],
      },
      { tab: { id: 99 } } as any,
      sendResponse,
    )

    expect(sendResponse).toHaveBeenCalledWith({
      success: true,
      promptableCodes: [validHex],
    })
  })

  it("filters out codes when the whitelist blocks the url", async () => {
    vi.resetModules()
    const { userPreferences } = await import(
      "~/services/preferences/userPreferences"
    )
    const getPreferencesMock = vi.mocked(userPreferences.getPreferences)

    getPreferencesMock.mockResolvedValue({
      ...DEFAULT_PREFERENCES,
      redemptionAssist: {
        enabled: true,
        contextMenu: {
          enabled: true,
        },
        urlWhitelist: {
          enabled: true,
          patterns: ["^https://allowed\\.example\\.com"],
          includeAccountSiteUrls: false,
          includeCheckInAndRedeemUrls: false,
        },
        relaxedCodeValidation: false,
      },
    })

    const { handleRedemptionAssistMessage } = await import(
      "~/services/redemption/redemptionAssist"
    )

    const sendResponse = vi.fn()

    await handleRedemptionAssistMessage(
      {
        action: RuntimeActionIds.RedemptionAssistShouldPrompt,
        url: "https://blocked.example.com/redeem",
        codes: ["a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6"],
      },
      { tab: { id: 7 } } as any,
      sendResponse,
    )

    expect(sendResponse).toHaveBeenCalledWith({
      success: true,
      promptableCodes: [],
    })
  })
})

describe("redemptionAssist post-redeem refresh", () => {
  it("refreshes account after successful auto redeem (explicit account)", async () => {
    vi.resetModules()

    const refreshAccount = vi.fn().mockResolvedValue({ refreshed: true })
    const redeemCodeForAccount = vi
      .fn()
      .mockResolvedValue({ success: true, message: "ok" })

    vi.doMock("~/services/accounts/accountStorage", () => ({
      accountStorage: {
        refreshAccount,
      },
    }))

    vi.doMock("~/services/redemption/redeemService", () => ({
      redeemService: {
        redeemCodeForAccount,
      },
    }))

    const { handleRedemptionAssistMessage } = await import(
      "~/services/redemption/redemptionAssist"
    )

    const sendResponse = vi.fn()

    await handleRedemptionAssistMessage(
      {
        action: RuntimeActionIds.RedemptionAssistAutoRedeem,
        accountId: "acc_1",
        code: "CODE_1",
      },
      {} as any,
      sendResponse,
    )

    expect(redeemCodeForAccount).toHaveBeenCalledWith("acc_1", "CODE_1")
    expect(refreshAccount).toHaveBeenCalledWith("acc_1", true)
    expect(sendResponse).toHaveBeenCalledWith({
      success: true,
      data: { success: true, message: "ok" },
    })
  })

  it("refreshes account after successful auto redeem by url (inferred account)", async () => {
    vi.resetModules()

    const { userPreferences } = await import(
      "~/services/preferences/userPreferences"
    )
    const getPreferencesMock = vi.mocked(userPreferences.getPreferences)
    getPreferencesMock.mockResolvedValue(DEFAULT_PREFERENCES)

    const refreshAccount = vi.fn().mockResolvedValue({ refreshed: true })
    const redeemCodeForAccount = vi
      .fn()
      .mockResolvedValue({ success: true, message: "ok" })

    const displayAccount = {
      id: "acc_2",
      baseUrl: "https://example.com",
      checkIn: {
        customCheckIn: {
          url: "https://example.com/checkin",
        },
      },
    }

    vi.doMock("~/services/accounts/accountStorage", () => ({
      accountStorage: {
        refreshAccount,
        getAllAccounts: vi.fn().mockResolvedValue([]),
        convertToDisplayData: vi.fn().mockReturnValue([displayAccount]),
      },
    }))

    vi.doMock("~/services/redemption/redeemService", () => ({
      redeemService: {
        redeemCodeForAccount,
      },
    }))

    const { handleRedemptionAssistMessage } = await import(
      "~/services/redemption/redemptionAssist"
    )

    const sendResponse = vi.fn()

    await handleRedemptionAssistMessage(
      {
        action: RuntimeActionIds.RedemptionAssistAutoRedeemByUrl,
        url: "https://example.com/redeem",
        code: "CODE_2",
      },
      {} as any,
      sendResponse,
    )

    expect(redeemCodeForAccount).toHaveBeenCalledWith("acc_2", "CODE_2")
    expect(refreshAccount).toHaveBeenCalledWith("acc_2", true)
    expect(sendResponse).toHaveBeenCalledWith({
      success: true,
      data: {
        success: true,
        message: "ok",
        selectedAccount: displayAccount,
      },
    })
  })

  it("swallows refresh failures and still reports redemption success", async () => {
    vi.resetModules()

    const refreshAccount = vi.fn().mockRejectedValue(new Error("refresh boom"))
    const redeemCodeForAccount = vi
      .fn()
      .mockResolvedValue({ success: true, message: "ok" })

    vi.doMock("~/services/accounts/accountStorage", () => ({
      accountStorage: {
        refreshAccount,
      },
    }))

    vi.doMock("~/services/redemption/redeemService", () => ({
      redeemService: {
        redeemCodeForAccount,
      },
    }))

    const { handleRedemptionAssistMessage } = await import(
      "~/services/redemption/redemptionAssist"
    )

    const sendResponse = vi.fn()

    await handleRedemptionAssistMessage(
      {
        action: RuntimeActionIds.RedemptionAssistAutoRedeem,
        accountId: "acc_3",
        code: "CODE_3",
      },
      {} as any,
      sendResponse,
    )

    expect(refreshAccount).toHaveBeenCalledWith("acc_3", true)
    expect(sendResponse).toHaveBeenCalledWith({
      success: true,
      data: { success: true, message: "ok" },
    })
  })

  it("awaits refresh before responding", async () => {
    vi.resetModules()

    let resolveRefresh: ((value: { refreshed: true }) => void) | undefined
    const refreshAccount = vi.fn(
      () =>
        new Promise<{ refreshed: true }>((resolve) => {
          resolveRefresh = resolve
        }),
    )
    const redeemCodeForAccount = vi
      .fn()
      .mockResolvedValue({ success: true, message: "ok" })

    vi.doMock("~/services/accounts/accountStorage", () => ({
      accountStorage: {
        refreshAccount,
      },
    }))

    vi.doMock("~/services/redemption/redeemService", () => ({
      redeemService: {
        redeemCodeForAccount,
      },
    }))

    const { handleRedemptionAssistMessage } = await import(
      "~/services/redemption/redemptionAssist"
    )

    const sendResponse = vi.fn()

    const handlePromise = handleRedemptionAssistMessage(
      {
        action: RuntimeActionIds.RedemptionAssistAutoRedeem,
        accountId: "acc_await",
        code: "CODE_AWAIT",
      },
      {} as any,
      sendResponse,
    )

    await Promise.resolve()
    expect(refreshAccount).toHaveBeenCalledWith("acc_await", true)
    expect(sendResponse).not.toHaveBeenCalled()

    resolveRefresh?.({ refreshed: true })
    await handlePromise

    expect(sendResponse).toHaveBeenCalledWith({
      success: true,
      data: { success: true, message: "ok" },
    })
  })

  it("does not refresh when redemption fails", async () => {
    vi.resetModules()

    const refreshAccount = vi.fn().mockResolvedValue({ refreshed: true })
    const redeemCodeForAccount = vi
      .fn()
      .mockResolvedValue({ success: false, message: "nope" })

    vi.doMock("~/services/accounts/accountStorage", () => ({
      accountStorage: {
        refreshAccount,
      },
    }))

    vi.doMock("~/services/redemption/redeemService", () => ({
      redeemService: {
        redeemCodeForAccount,
      },
    }))

    const { handleRedemptionAssistMessage } = await import(
      "~/services/redemption/redemptionAssist"
    )

    const sendResponse = vi.fn()

    await handleRedemptionAssistMessage(
      {
        action: RuntimeActionIds.RedemptionAssistAutoRedeem,
        accountId: "acc_4",
        code: "CODE_4",
      },
      {} as any,
      sendResponse,
    )

    expect(refreshAccount).not.toHaveBeenCalled()
    expect(sendResponse).toHaveBeenCalledWith({
      success: true,
      data: { success: false, message: "nope" },
    })
  })

  it("returns INVALID_URL when auto redeem by url receives an unparsable url", async () => {
    vi.resetModules()

    const { userPreferences } = await import(
      "~/services/preferences/userPreferences"
    )
    vi.mocked(userPreferences.getPreferences).mockResolvedValue(
      DEFAULT_PREFERENCES,
    )

    const { handleRedemptionAssistMessage } = await import(
      "~/services/redemption/redemptionAssist"
    )

    const sendResponse = vi.fn()

    await handleRedemptionAssistMessage(
      {
        action: RuntimeActionIds.RedemptionAssistAutoRedeemByUrl,
        url: "not-a-url",
        code: "CODE_BAD_URL",
      },
      {} as any,
      sendResponse,
    )

    expect(sendResponse).toHaveBeenCalledWith({
      success: true,
      data: {
        success: false,
        code: "INVALID_URL",
        message: "redemptionAssist:messages.noAccountForUrl",
      },
    })
  })

  it("returns MULTIPLE_ACCOUNTS when several same-domain candidates match", async () => {
    vi.resetModules()

    const { userPreferences } = await import(
      "~/services/preferences/userPreferences"
    )
    vi.mocked(userPreferences.getPreferences).mockResolvedValue(
      DEFAULT_PREFERENCES,
    )

    const candidates = [
      {
        id: "acc_multi_1",
        baseUrl: "https://example.com",
        checkIn: { customCheckIn: { url: "https://example.com/check-in" } },
      },
      {
        id: "acc_multi_2",
        baseUrl: "https://example.com",
        checkIn: { customCheckIn: { url: "https://example.com/redeem" } },
      },
    ]

    vi.doMock("~/services/accounts/accountStorage", () => ({
      accountStorage: {
        getAllAccounts: vi.fn().mockResolvedValue([]),
        convertToDisplayData: vi.fn().mockReturnValue(candidates),
      },
    }))

    vi.doMock("~/services/search/accountSearch", () => ({
      searchAccounts: vi.fn().mockReturnValue(
        candidates.map((account) => ({
          account,
        })),
      ),
    }))

    const { handleRedemptionAssistMessage } = await import(
      "~/services/redemption/redemptionAssist"
    )

    const sendResponse = vi.fn()

    await handleRedemptionAssistMessage(
      {
        action: RuntimeActionIds.RedemptionAssistAutoRedeemByUrl,
        url: "https://example.com/redeem",
        code: "CODE_MULTI",
      },
      {} as any,
      sendResponse,
    )

    expect(sendResponse).toHaveBeenCalledWith({
      success: true,
      data: {
        success: false,
        code: "MULTIPLE_ACCOUNTS",
        candidates,
      },
    })
  })

  it("returns NO_ACCOUNTS with all accounts when no same-domain candidate matches", async () => {
    vi.resetModules()

    const { userPreferences } = await import(
      "~/services/preferences/userPreferences"
    )
    vi.mocked(userPreferences.getPreferences).mockResolvedValue(
      DEFAULT_PREFERENCES,
    )

    const allAccounts = [
      {
        id: "acc_manual_1",
        baseUrl: "https://manual.example.com",
        checkIn: {
          customCheckIn: { url: "https://other.example.com/check-in" },
        },
      },
    ]

    vi.doMock("~/services/accounts/accountStorage", () => ({
      accountStorage: {
        getAllAccounts: vi.fn().mockResolvedValue([]),
        convertToDisplayData: vi.fn().mockReturnValue(allAccounts),
      },
    }))

    vi.doMock("~/services/search/accountSearch", () => ({
      searchAccounts: vi.fn().mockReturnValue([]),
    }))

    const { handleRedemptionAssistMessage } = await import(
      "~/services/redemption/redemptionAssist"
    )

    const sendResponse = vi.fn()

    await handleRedemptionAssistMessage(
      {
        action: RuntimeActionIds.RedemptionAssistAutoRedeemByUrl,
        url: "https://example.com/redeem",
        code: "CODE_NONE",
      },
      {} as any,
      sendResponse,
    )

    expect(sendResponse).toHaveBeenCalledWith({
      success: true,
      data: {
        success: false,
        code: "NO_ACCOUNTS",
        candidates: [],
        allAccounts,
        message: "redemptionAssist:messages.noAccountForUrl",
      },
    })
  })

  it("handles validation failures and unknown runtime actions", async () => {
    vi.resetModules()

    const { handleRedemptionAssistMessage } = await import(
      "~/services/redemption/redemptionAssist"
    )

    const sendResponse = vi.fn()

    await handleRedemptionAssistMessage(
      {
        action: RuntimeActionIds.RedemptionAssistShouldPrompt,
        url: "",
        codes: [],
      },
      {} as any,
      sendResponse,
    )
    await handleRedemptionAssistMessage(
      {
        action: RuntimeActionIds.RedemptionAssistAutoRedeem,
        accountId: "",
        code: "",
      },
      {} as any,
      sendResponse,
    )
    await handleRedemptionAssistMessage(
      {
        action: RuntimeActionIds.RedemptionAssistAutoRedeemByUrl,
        url: "",
        code: "",
      },
      {} as any,
      sendResponse,
    )
    await handleRedemptionAssistMessage(
      {
        action: "unknown-action",
      },
      {} as any,
      sendResponse,
    )

    expect(sendResponse).toHaveBeenNthCalledWith(1, {
      success: false,
      error: "Missing url or codes",
    })
    expect(sendResponse).toHaveBeenNthCalledWith(2, {
      success: false,
      error: "Missing accountId or code",
    })
    expect(sendResponse).toHaveBeenNthCalledWith(3, {
      success: false,
      error: "Missing url or code",
    })
    expect(sendResponse).toHaveBeenNthCalledWith(4, {
      success: false,
      error: "Unknown action",
    })
  })

  it("reports handler errors when redeeming throws", async () => {
    vi.resetModules()

    const redeemCodeForAccount = vi
      .fn()
      .mockRejectedValue(new Error("redeem exploded"))

    vi.doMock("~/services/accounts/accountStorage", () => ({
      accountStorage: {
        refreshAccount: vi.fn(),
      },
    }))

    vi.doMock("~/services/redemption/redeemService", () => ({
      redeemService: {
        redeemCodeForAccount,
      },
    }))

    const { handleRedemptionAssistMessage } = await import(
      "~/services/redemption/redemptionAssist"
    )

    const sendResponse = vi.fn()

    await handleRedemptionAssistMessage(
      {
        action: RuntimeActionIds.RedemptionAssistAutoRedeem,
        accountId: "acc_error",
        code: "CODE_ERR",
      },
      {} as any,
      sendResponse,
    )

    expect(sendResponse).toHaveBeenCalledWith({
      success: false,
      error: "redeem exploded",
    })
  })
})
