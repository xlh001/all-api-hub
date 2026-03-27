import { beforeEach, describe, expect, it, vi } from "vitest"

import { getSiteApiRouter } from "~/constants/siteType"
import { isExtensionPopup } from "~/utils/browser"
import {
  createTab as createTabApi,
  createWindow,
  focusTab as focusTabApi,
  getExtensionURL,
  hasWindowsAPI,
  openSidePanel as openSidePanelApi,
} from "~/utils/browser/browserApi"
import { joinUrl } from "~/utils/core/url"
import {
  navigateWithinOptionsPage,
  openAutoCheckinPage,
  openCheckInAndRedeem,
  openCheckInPages,
  openKeysPage,
  openModelsPage,
  openMultiplePages,
  openOrFocusOptionsPage,
  openSidePanelPage,
  openSidePanelWithFallback,
  openUsagePage,
} from "~/utils/navigation"

vi.mock("~/utils/browser", () => ({
  isExtensionPopup: vi.fn().mockReturnValue(false),
  OPTIONS_PAGE_URL: "https://extension.local/options.html",
}))

vi.mock("~/utils/browser/browserApi", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("~/utils/browser/browserApi")>()
  const createTab = vi.fn()
  const createWindow = vi.fn()
  const focusTab = vi.fn()
  const getExtensionURL = vi.fn((path: string) => `ext://${path}`)
  const hasWindowsAPI = vi.fn(() => false)
  const openSidePanel = vi.fn()

  return {
    ...actual,
    createTab,
    createWindow,
    focusTab,
    getExtensionURL,
    hasWindowsAPI,
    openSidePanel,
  }
})

vi.mock("~/constants/siteType", () => ({
  getSiteApiRouter: vi.fn(() => ({
    usagePath: "/usage",
    checkInPath: "/checkin",
    redeemPath: "/redeem",
  })),
}))

vi.mock("~/utils/core/url", () => ({
  joinUrl: vi.fn((base: string, path: string) => `${base}${path}`),
}))

const mockedIsExtensionPopup = vi.mocked(isExtensionPopup)
const mockedCreateTab = vi.mocked(createTabApi)
const mockedCreateWindow = vi.mocked(createWindow)
const mockedFocusTab = vi.mocked(focusTabApi)
const mockedGetExtensionURL = vi.mocked(getExtensionURL)
const mockedHasWindowsAPI = vi.mocked(hasWindowsAPI)
const mockedOpenSidePanel = vi.mocked(openSidePanelApi)
const mockedGetSiteApiRouter = vi.mocked(getSiteApiRouter)
const mockedJoinUrl = vi.mocked(joinUrl)

describe("navigation utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockedHasWindowsAPI.mockReturnValue(false)
    mockedIsExtensionPopup.mockReturnValue(false)
    window.history.replaceState(null, "", "/")
  })

  it("openKeysPage should open keys page without accountId", async () => {
    const closeSpy = vi.spyOn(window, "close").mockImplementation(() => {})

    await openKeysPage()

    expect(mockedGetExtensionURL).toHaveBeenCalledWith("options.html")
    const baseUrl = mockedGetExtensionURL.mock.results[0].value
    expect(mockedCreateTab).toHaveBeenCalledWith(`${baseUrl}#keys`, true)
    expect(closeSpy).not.toHaveBeenCalled()

    closeSpy.mockRestore()
  })

  it("openKeysPage should include accountId when provided", async () => {
    await openKeysPage("123")

    expect(mockedGetExtensionURL).toHaveBeenCalledWith("options.html")
    const baseUrl = mockedGetExtensionURL.mock.results[0].value
    expect(mockedCreateTab).toHaveBeenCalledWith(
      `${baseUrl}?accountId=123#keys`,
      true,
    )
  })

  it("openKeysPage should close popup after dispatching navigation", async () => {
    const closeSpy = vi.spyOn(window, "close").mockImplementation(() => {})
    mockedIsExtensionPopup.mockReturnValue(true)

    await openKeysPage()

    expect(mockedCreateTab).toHaveBeenCalledWith(
      "ext://options.html#keys",
      true,
    )
    expect(closeSpy).toHaveBeenCalledTimes(1)

    closeSpy.mockRestore()
  })

  it("openUsagePage should open usage URL built from site router", async () => {
    const account = {
      baseUrl: "https://example.com",
      siteType: "one-api",
    } as any

    await openUsagePage(account)

    expect(mockedGetSiteApiRouter).toHaveBeenCalledWith("one-api")
    expect(mockedJoinUrl).toHaveBeenCalledWith("https://example.com", "/usage")
    const url = mockedJoinUrl.mock.results[0].value
    expect(mockedCreateTab).toHaveBeenCalledWith(url, true)
  })

  it("openModelsPage should open models page for the default view, accounts, and stored profiles", async () => {
    await openModelsPage()
    await openModelsPage("42")
    await openModelsPage({ accountId: "43" })
    await openModelsPage({ profileId: "profile-7" })

    expect(mockedGetExtensionURL).toHaveBeenCalledTimes(4)
    expect(mockedGetExtensionURL).toHaveBeenCalledWith("options.html")
    const baseUrl = mockedGetExtensionURL.mock.results[0].value
    const baseUrl2 = mockedGetExtensionURL.mock.results[1].value
    const baseUrl3 = mockedGetExtensionURL.mock.results[2].value
    const baseUrl4 = mockedGetExtensionURL.mock.results[3].value
    expect(baseUrl2).toBe(baseUrl)
    expect(baseUrl3).toBe(baseUrl)
    expect(baseUrl4).toBe(baseUrl)
    expect(mockedCreateTab).toHaveBeenCalledWith(`${baseUrl}#models`, true)
    expect(mockedCreateTab).toHaveBeenCalledWith(
      `${baseUrl}?accountId=42#models`,
      true,
    )
    expect(mockedCreateTab).toHaveBeenCalledWith(
      `${baseUrl}?accountId=43#models`,
      true,
    )
    expect(mockedCreateTab).toHaveBeenCalledWith(
      `${baseUrl}?profileId=profile-7#models`,
      true,
    )
  })

  it("openModelsPage should close popup and preserve parameterized routing", async () => {
    const closeSpy = vi.spyOn(window, "close").mockImplementation(() => {})
    mockedIsExtensionPopup.mockReturnValue(true)

    await openModelsPage({ profileId: "profile-7" })

    expect(mockedCreateTab).toHaveBeenCalledWith(
      "ext://options.html?profileId=profile-7#models",
      true,
    )
    expect(closeSpy).toHaveBeenCalledTimes(1)

    closeSpy.mockRestore()
  })

  it("openAutoCheckinPage should omit undefined params and close popup", async () => {
    const closeSpy = vi.spyOn(window, "close").mockImplementation(() => {})
    const querySpy = vi.spyOn(browser.tabs, "query").mockResolvedValue([])
    mockedIsExtensionPopup.mockReturnValue(true)

    await openAutoCheckinPage({ runNow: "true", ignored: undefined })

    expect(querySpy).toHaveBeenCalledWith({})
    expect(mockedCreateTab).toHaveBeenCalledWith(
      "https://extension.local/options.html?runNow=true#autoCheckin",
      true,
    )
    expect(closeSpy).toHaveBeenCalledTimes(1)

    querySpy.mockRestore()
    closeSpy.mockRestore()
  })

  it("openOrFocusOptionsPage should reuse an existing matching tab and append refresh markers", async () => {
    const querySpy = vi.spyOn(browser.tabs, "query").mockResolvedValue([
      {
        id: 5,
        url: "https://extension.local/options.html?runNow=true#autoCheckin",
      } as browser.tabs.Tab,
    ])
    const updateSpy = vi
      .spyOn(browser.tabs, "update")
      .mockResolvedValue({ id: 5 } as browser.tabs.Tab)
    const nowSpy = vi.spyOn(Date, "now").mockReturnValue(123)

    await openOrFocusOptionsPage("#autoCheckin", { runNow: "true" })

    expect(updateSpy).toHaveBeenCalledWith(5, {
      active: true,
      url: "https://extension.local/options.html?runNow=true&refresh=true&t=123#autoCheckin",
    })
    expect(mockedOpenSidePanel).not.toHaveBeenCalled()
    expect(mockedCreateTab).not.toHaveBeenCalled()
    expect(mockedFocusTab).toHaveBeenCalledWith({
      id: 5,
      url: "https://extension.local/options.html?runNow=true#autoCheckin",
    })

    nowSpy.mockRestore()
    updateSpy.mockRestore()
    querySpy.mockRestore()
  })

  it("navigateWithinOptionsPage should dispatch hashchange without replacing history when the URL is unchanged", () => {
    window.history.replaceState(
      null,
      "",
      "/options.html?runNow=true#autoCheckin",
    )
    const dispatchSpy = vi.spyOn(window, "dispatchEvent")
    const replaceStateSpy = vi.spyOn(window.history, "replaceState")

    navigateWithinOptionsPage("#autoCheckin", {
      runNow: "true",
      ignored: undefined,
    })

    expect(replaceStateSpy).not.toHaveBeenCalled()
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Event))
    expect(window.location.search).toBe("?runNow=true")

    replaceStateSpy.mockRestore()
    dispatchSpy.mockRestore()
  })

  it("openMultiplePages should execute all operations and not close popup when isExtensionPopup is false", async () => {
    const op1 = vi.fn()
    const op2 = vi.fn()
    const closeSpy = vi.spyOn(window, "close").mockImplementation(() => {})

    await openMultiplePages([op1, op2])

    expect(op1).toHaveBeenCalled()
    expect(op2).toHaveBeenCalled()
    expect(closeSpy).not.toHaveBeenCalled()

    closeSpy.mockRestore()
  })

  it("openMultiplePages should close popup when isExtensionPopup is true", async () => {
    const op = vi.fn()
    const closeSpy = vi.spyOn(window, "close").mockImplementation(() => {})
    mockedIsExtensionPopup.mockReturnValue(true)

    await openMultiplePages([op])

    expect(op).toHaveBeenCalled()
    expect(closeSpy).toHaveBeenCalled()

    closeSpy.mockRestore()
  })

  it("openCheckInAndRedeem should open redeem and custom check-in URLs", async () => {
    const account = {
      baseUrl: "https://example.com",
      siteType: "one-api",
      checkIn: {
        customCheckIn: {
          url: "https://checkin.custom",
          redeemUrl: "https://redeem.custom",
        },
      },
    } as any

    await openCheckInAndRedeem(account)

    // openMultiplePages wraps two operations; ensure both tabs were opened
    const calls = mockedCreateTab.mock.calls.map((call) => call[0] as string)
    expect(calls).toContain("https://redeem.custom")
    expect(calls).toContain("https://checkin.custom")
  })

  it("openCheckInPages should open grouped check-in tabs by default", async () => {
    mockedCreateTab
      .mockResolvedValueOnce({ id: 11 } as any)
      .mockResolvedValueOnce({ id: 12 } as any)

    const result = await openCheckInPages([
      {
        baseUrl: "https://example.com",
        siteType: "one-api",
      } as any,
      {
        baseUrl: "https://example.org",
        siteType: "one-api",
      } as any,
    ])

    expect(mockedCreateTab).toHaveBeenCalledWith(
      "https://example.com/checkin",
      true,
    )
    expect(mockedCreateTab).toHaveBeenCalledWith(
      "https://example.org/checkin",
      true,
    )
    expect(result).toEqual({ openedCount: 2, failedCount: 0 })
  })

  it("openCheckInPages should reuse a dedicated window when requested", async () => {
    mockedHasWindowsAPI.mockReturnValue(true)
    mockedCreateWindow.mockResolvedValue({ id: 77 } as any)
    mockedCreateTab.mockResolvedValueOnce({ id: 21 } as any)

    const result = await openCheckInPages(
      [
        {
          baseUrl: "https://example.com",
          siteType: "one-api",
        } as any,
        {
          baseUrl: "https://example.org",
          siteType: "one-api",
        } as any,
      ],
      { openInNewWindow: true },
    )

    expect(mockedCreateWindow).toHaveBeenCalledWith({
      url: "https://example.com/checkin",
      focused: true,
    })
    expect(mockedCreateTab).toHaveBeenCalledWith(
      "https://example.org/checkin",
      true,
      { windowId: 77 },
    )
    expect(result).toEqual({ openedCount: 2, failedCount: 0 })
  })

  it("openSidePanelWithFallback should open settings when side panel opening fails", async () => {
    mockedOpenSidePanel.mockRejectedValueOnce(new Error("fail"))

    await openSidePanelWithFallback()

    await vi.waitFor(() => {
      expect(mockedCreateTab).toHaveBeenCalledWith(
        "https://extension.local/options.html#basic",
        true,
      )
    })
  })

  it("openSidePanelWithFallback should forward the clicked tab context", async () => {
    const clickedTab = { id: 7, windowId: 9 } as browser.tabs.Tab

    await openSidePanelWithFallback(clickedTab)

    expect(mockedOpenSidePanel).toHaveBeenCalledWith(clickedTab)
  })

  it("openSidePanelPage should close the popup after fallback navigation", async () => {
    const closeSpy = vi.spyOn(window, "close").mockImplementation(() => {})
    mockedIsExtensionPopup.mockReturnValue(true)
    mockedOpenSidePanel.mockRejectedValueOnce(new Error("fail"))

    await openSidePanelPage()

    expect(closeSpy).toHaveBeenCalledTimes(1)

    closeSpy.mockRestore()
  })
})
