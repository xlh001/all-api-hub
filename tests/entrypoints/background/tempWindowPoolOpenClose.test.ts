import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const originalBrowser = (globalThis as any).browser

describe("tempWindowPool open/close handlers", () => {
  let createTabMock: ReturnType<typeof vi.fn>
  let createWindowMock: ReturnType<typeof vi.fn>
  let hasWindowsApiMock: ReturnType<typeof vi.fn>
  let onTabRemovedMock: ReturnType<typeof vi.fn>
  let onWindowRemovedMock: ReturnType<typeof vi.fn>
  let removeTabOrWindowMock: ReturnType<typeof vi.fn>
  let tabsQueryMock: ReturnType<typeof vi.fn>
  let tempContextMode: "window" | "composite" | "tab"

  beforeEach(() => {
    createTabMock = vi.fn()
    createWindowMock = vi.fn()
    hasWindowsApiMock = vi.fn(() => true)
    onTabRemovedMock = vi.fn(() => () => {})
    onWindowRemovedMock = vi.fn(() => () => {})
    removeTabOrWindowMock = vi.fn().mockResolvedValue(undefined)
    tabsQueryMock = vi.fn().mockResolvedValue([{ id: 902 }])
    tempContextMode = "window"

    vi.useFakeTimers()
    vi.resetModules()
    ;(globalThis as any).browser = {
      runtime: {
        getURL: vi.fn((path: string) => `chrome-extension://test/${path}`),
      },
      tabs: {
        query: tabsQueryMock,
      },
      windows: {
        get: vi.fn(),
        update: vi.fn().mockResolvedValue(undefined),
      },
    }

    vi.doMock("~/utils/browser/browserApi", async (importOriginal) => {
      const actual =
        await importOriginal<typeof import("~/utils/browser/browserApi")>()

      return {
        ...actual,
        createTab: createTabMock,
        createWindow: createWindowMock,
        hasWindowsAPI: hasWindowsApiMock,
        onTabRemoved: onTabRemovedMock,
        onWindowRemoved: onWindowRemovedMock,
        removeTabOrWindow: removeTabOrWindowMock,
      }
    })
    vi.doMock("~/services/preferences/userPreferences", () => ({
      DEFAULT_PREFERENCES: {
        tempWindowFallback: {
          tempContextMode,
        },
      },
      userPreferences: {
        getPreferences: vi.fn().mockImplementation(() =>
          Promise.resolve({
            tempWindowFallback: {
              tempContextMode,
            },
          }),
        ),
      },
    }))
    vi.doMock("~/utils/i18n/core", () => ({
      t: vi.fn((key: string) => key),
    }))
  })

  afterEach(() => {
    ;(globalThis as any).browser = originalBrowser
    vi.useRealTimers()
    vi.doUnmock("~/utils/browser/browserApi")
    vi.doUnmock("~/services/preferences/userPreferences")
    vi.doUnmock("~/utils/i18n/core")
    vi.resetModules()
    vi.restoreAllMocks()
  })

  it("opens and closes a popup temp window in window mode", async () => {
    tempContextMode = "window"
    createWindowMock.mockResolvedValueOnce({ id: 801 })

    const { handleCloseTempWindow, handleOpenTempWindow } = await import(
      "~/entrypoints/background/tempWindowPool"
    )

    const openResponse = vi.fn()
    await handleOpenTempWindow(
      {
        requestId: "req-window",
        url: "https://example.com/window",
      },
      openResponse,
    )

    expect(openResponse).toHaveBeenCalledWith({
      success: true,
      windowId: 801,
    })

    const closeResponse = vi.fn()
    await handleCloseTempWindow({ requestId: "req-window" }, closeResponse)

    expect(removeTabOrWindowMock).toHaveBeenCalledWith(801)
    expect(closeResponse).toHaveBeenCalledWith({ success: true })
  })

  it("opens a composite temp tab when composite mode is enabled", async () => {
    tempContextMode = "composite"
    createWindowMock.mockResolvedValueOnce({ id: 901 })

    const { handleOpenTempWindow } = await import(
      "~/entrypoints/background/tempWindowPool"
    )

    const sendResponse = vi.fn()
    await handleOpenTempWindow(
      {
        requestId: "req-composite",
        url: "https://example.com/composite",
      },
      sendResponse,
    )

    expect(createWindowMock).toHaveBeenCalledWith(
      expect.objectContaining({
        focused: false,
        type: "normal",
        url: "https://example.com/composite",
      }),
    )
    expect(sendResponse).toHaveBeenCalledWith({
      success: true,
      windowId: 901,
      tabId: 902,
    })
  })

  it("falls back to a plain tab when window mode is unavailable", async () => {
    tempContextMode = "window"
    hasWindowsApiMock.mockReturnValue(false)
    createTabMock.mockResolvedValueOnce({ id: 701 })

    const { handleOpenTempWindow } = await import(
      "~/entrypoints/background/tempWindowPool"
    )

    const sendResponse = vi.fn()
    await handleOpenTempWindow(
      {
        requestId: "req-tab",
        url: "https://example.com/tab",
      },
      sendResponse,
    )

    expect(createTabMock).toHaveBeenCalledWith("https://example.com/tab", false)
    expect(sendResponse).toHaveBeenCalledWith({
      success: true,
      tabId: 701,
    })
  })

  it("returns an error when window mode cannot provide a window id", async () => {
    tempContextMode = "window"
    createWindowMock.mockResolvedValueOnce({})

    const { handleOpenTempWindow } = await import(
      "~/entrypoints/background/tempWindowPool"
    )

    const sendResponse = vi.fn()
    await handleOpenTempWindow(
      {
        requestId: "req-window-missing-id",
        url: "https://example.com/window",
      },
      sendResponse,
    )

    expect(sendResponse).toHaveBeenCalledWith({
      success: false,
      error: "messages:background.cannotCreateWindow",
    })
  })

  it("returns an error when tab mode cannot provide a tab id", async () => {
    tempContextMode = "tab"
    createTabMock.mockResolvedValueOnce({})

    const { handleOpenTempWindow } = await import(
      "~/entrypoints/background/tempWindowPool"
    )

    const sendResponse = vi.fn()
    await handleOpenTempWindow(
      {
        requestId: "req-tab-missing-id",
        url: "https://example.com/tab",
      },
      sendResponse,
    )

    expect(sendResponse).toHaveBeenCalledWith({
      success: false,
      error: "messages:background.cannotCreateWindow",
    })
  })

  it("returns a not-found error when closing an unknown temp window", async () => {
    const { handleCloseTempWindow } = await import(
      "~/entrypoints/background/tempWindowPool"
    )

    const sendResponse = vi.fn()
    await handleCloseTempWindow({ requestId: "missing" }, sendResponse)

    expect(removeTabOrWindowMock).not.toHaveBeenCalled()
    expect(sendResponse).toHaveBeenCalledWith({
      success: false,
      error: "messages:background.windowNotFound",
    })
  })

  it("registers tab and window cleanup listeners", async () => {
    const { setupTempWindowListeners } = await import(
      "~/entrypoints/background/tempWindowPool"
    )

    setupTempWindowListeners()

    expect(onWindowRemovedMock).toHaveBeenCalledTimes(1)
    expect(onTabRemovedMock).toHaveBeenCalledTimes(1)
  })
})
