import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { RuntimeActionIds } from "~/constants/runtimeActions"
import { API_ERROR_CODES } from "~/services/apiService/common/errors"

const originalBrowser = (globalThis as any).browser

describe("tempWindowPool window fallback", () => {
  let createTabMock: ReturnType<typeof vi.fn>
  let createWindowMock: ReturnType<typeof vi.fn>
  let removeTabOrWindowMock: ReturnType<typeof vi.fn>
  let hasWindowsApiMock: ReturnType<typeof vi.fn>
  let isAllowedIncognitoAccessMock: ReturnType<typeof vi.fn>
  let sendMessageMock: ReturnType<typeof vi.fn>
  let tabsGetMock: ReturnType<typeof vi.fn>
  let tabsQueryMock: ReturnType<typeof vi.fn>
  let tempContextMode: "window" | "composite" | "tab"

  beforeEach(() => {
    createTabMock = vi.fn()
    createWindowMock = vi.fn()
    removeTabOrWindowMock = vi.fn().mockResolvedValue(undefined)
    hasWindowsApiMock = vi.fn(() => true)
    isAllowedIncognitoAccessMock = vi.fn().mockResolvedValue(true)
    sendMessageMock = vi.fn(
      async (_tabId: number, message: { action: string }) => {
        switch (message.action) {
          case RuntimeActionIds.ContentShowShieldBypassUi:
            return undefined
          case RuntimeActionIds.ContentCheckCapGuard:
          case RuntimeActionIds.ContentCheckCloudflareGuard:
            return { success: true, passed: true }
          case RuntimeActionIds.ContentPerformTempWindowFetch:
            return {
              success: true,
              data: {
                success: true,
                message: "",
                data: "ok",
              },
            }
          default:
            throw new Error(`Unexpected action: ${message.action}`)
        }
      },
    )
    tabsGetMock = vi.fn().mockResolvedValue({ status: "complete" })
    tabsQueryMock = vi.fn().mockResolvedValue([])
    tempContextMode = "window"

    vi.useFakeTimers()
    vi.resetModules()
    ;(globalThis as any).browser = {
      runtime: {
        getURL: vi.fn((path: string) => `chrome-extension://test/${path}`),
      },
      tabs: {
        get: tabsGetMock,
        query: tabsQueryMock,
        update: vi.fn().mockResolvedValue(undefined),
        sendMessage: sendMessageMock,
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
        isAllowedIncognitoAccess: isAllowedIncognitoAccessMock,
        onTabRemoved: vi.fn(() => () => {}),
        onWindowRemoved: vi.fn(() => () => {}),
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

  it("rolls back popup temp-context creation to a plain tab", async () => {
    tempContextMode = "window"
    createWindowMock.mockRejectedValueOnce(
      new Error("Popup windows are not allowed on this runtime"),
    )
    createTabMock.mockResolvedValueOnce({ id: 101 })

    const { handleTempWindowFetch } = await import(
      "~/entrypoints/background/tempWindowPool"
    )

    const sendResponse = vi.fn()
    const request = handleTempWindowFetch(
      {
        originUrl: "https://example.com",
        fetchUrl: "https://example.com/api/test",
        fetchOptions: { method: "GET" },
        requestId: "req-popup",
      },
      sendResponse,
    )

    await vi.advanceTimersByTimeAsync(500)
    await request

    expect(sendResponse).toHaveBeenCalledWith({
      success: true,
      data: {
        success: true,
        message: "",
        data: "ok",
      },
    })
    expect(createWindowMock).toHaveBeenCalledTimes(1)
    expect(createTabMock).toHaveBeenCalledWith("https://example.com", false)

    await vi.advanceTimersByTimeAsync(2500)
    expect(removeTabOrWindowMock).toHaveBeenCalledWith(101)
  })

  it("rolls back composite temp-context creation to a plain tab", async () => {
    tempContextMode = "composite"
    createWindowMock.mockRejectedValueOnce(
      new Error("Window creation is not supported for popup or normal windows"),
    )
    createTabMock.mockResolvedValueOnce({ id: 202 })

    const { handleTempWindowFetch } = await import(
      "~/entrypoints/background/tempWindowPool"
    )

    const sendResponse = vi.fn()
    const request = handleTempWindowFetch(
      {
        originUrl: "https://example.com",
        fetchUrl: "https://example.com/api/composite",
        fetchOptions: { method: "GET" },
        requestId: "req-composite",
      },
      sendResponse,
    )

    await vi.advanceTimersByTimeAsync(500)
    await request

    expect(sendResponse).toHaveBeenCalledWith({
      success: true,
      data: {
        success: true,
        message: "",
        data: "ok",
      },
    })
    expect(createWindowMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "normal",
        url: "https://example.com",
      }),
    )
    expect(createTabMock).toHaveBeenCalledWith("https://example.com", false)

    await vi.advanceTimersByTimeAsync(2500)
    expect(removeTabOrWindowMock).toHaveBeenCalledWith(202)
  })

  it("cleans up a half-created composite window before rolling back to a plain tab", async () => {
    tempContextMode = "composite"
    createWindowMock.mockResolvedValueOnce({ id: 303 })
    tabsQueryMock.mockResolvedValueOnce([])
    createTabMock.mockResolvedValueOnce({ id: 304 })

    const { handleTempWindowFetch } = await import(
      "~/entrypoints/background/tempWindowPool"
    )

    const sendResponse = vi.fn()
    const request = handleTempWindowFetch(
      {
        originUrl: "https://example.com",
        fetchUrl: "https://example.com/api/composite-missing-tab",
        fetchOptions: { method: "GET" },
        requestId: "req-composite-missing-tab",
      },
      sendResponse,
    )

    await vi.advanceTimersByTimeAsync(500)
    await request

    expect(sendResponse).toHaveBeenCalledWith({
      success: true,
      data: {
        success: true,
        message: "",
        data: "ok",
      },
    })
    expect(removeTabOrWindowMock).toHaveBeenNthCalledWith(1, 303)
    expect(createTabMock).toHaveBeenCalledWith("https://example.com", false)

    await vi.advanceTimersByTimeAsync(2500)
    expect(removeTabOrWindowMock).toHaveBeenNthCalledWith(2, 304)
  })

  it("preserves a structured unsupported result for incognito temp contexts", async () => {
    tempContextMode = "window"
    createWindowMock.mockRejectedValueOnce(
      new Error("Popup windows are not allowed on this runtime"),
    )

    const { handleTempWindowTurnstileFetch } = await import(
      "~/entrypoints/background/tempWindowPool"
    )

    const sendResponse = vi.fn()
    const request = handleTempWindowTurnstileFetch(
      {
        originUrl: "https://example.com",
        pageUrl: "https://example.com/checkin",
        fetchUrl: "https://example.com/api/checkin",
        fetchOptions: { method: "POST" },
        useIncognito: true,
        requestId: "req-incognito",
      },
      sendResponse,
    )

    await request
    await vi.advanceTimersByTimeAsync(2500)

    expect(createTabMock).not.toHaveBeenCalled()
    expect(sendResponse).toHaveBeenCalledWith({
      success: false,
      error: "messages:background.windowCreationUnavailable",
      code: API_ERROR_CODES.TEMP_WINDOW_WINDOW_CREATION_UNAVAILABLE,
      turnstile: {
        status: "error",
        hasTurnstile: false,
      },
    })
  })

  it("preserves a windows-api-unavailable error for incognito temp contexts", async () => {
    tempContextMode = "window"
    hasWindowsApiMock.mockReturnValue(false)
    createWindowMock.mockResolvedValueOnce(undefined)

    const { handleTempWindowTurnstileFetch } = await import(
      "~/entrypoints/background/tempWindowPool"
    )

    const sendResponse = vi.fn()
    await handleTempWindowTurnstileFetch(
      {
        originUrl: "https://example.com",
        pageUrl: "https://example.com/checkin",
        fetchUrl: "https://example.com/api/checkin",
        fetchOptions: { method: "POST" },
        useIncognito: true,
        requestId: "req-incognito-no-windows-api",
      },
      sendResponse,
    )

    expect(createTabMock).not.toHaveBeenCalled()
    expect(sendResponse).toHaveBeenCalledWith({
      success: false,
      error: "messages:background.windowCreationUnavailable",
      code: API_ERROR_CODES.TEMP_WINDOW_WINDOWS_API_UNAVAILABLE,
      turnstile: {
        status: "error",
        hasTurnstile: false,
      },
    })
  })

  it("preserves a missing-handle error for incognito popup temp contexts", async () => {
    tempContextMode = "window"
    createWindowMock.mockResolvedValueOnce({ id: 404 })
    tabsQueryMock.mockResolvedValueOnce([])

    const { handleTempWindowTurnstileFetch } = await import(
      "~/entrypoints/background/tempWindowPool"
    )

    const sendResponse = vi.fn()
    await handleTempWindowTurnstileFetch(
      {
        originUrl: "https://example.com",
        pageUrl: "https://example.com/checkin",
        fetchUrl: "https://example.com/api/checkin",
        fetchOptions: { method: "POST" },
        useIncognito: true,
        requestId: "req-incognito-missing-tab",
      },
      sendResponse,
    )

    expect(createTabMock).not.toHaveBeenCalled()
    expect(removeTabOrWindowMock).toHaveBeenCalledWith(404)
    expect(sendResponse).toHaveBeenCalledWith({
      success: false,
      error: "messages:background.windowCreationUnavailable",
      code: API_ERROR_CODES.TEMP_WINDOW_WINDOW_HANDLE_UNAVAILABLE,
      turnstile: {
        status: "error",
        hasTurnstile: false,
      },
    })
  })

  it("rejects invalid temp-window fetch requests before opening any context", async () => {
    const { handleTempWindowFetch } = await import(
      "~/entrypoints/background/tempWindowPool"
    )

    const sendResponse = vi.fn()
    await handleTempWindowFetch(
      {
        originUrl: "",
        fetchUrl: "",
        fetchOptions: { method: "GET" },
        requestId: "req-invalid",
      },
      sendResponse,
    )

    expect(createWindowMock).not.toHaveBeenCalled()
    expect(createTabMock).not.toHaveBeenCalled()
    expect(sendResponse).toHaveBeenCalledWith({
      success: false,
      error: "messages:background.invalidFetchRequest",
    })
  })

  it("returns a failure response when the content script never answers the temp fetch", async () => {
    sendMessageMock.mockImplementation(
      async (_tabId: number, message: { action: string }) => {
        switch (message.action) {
          case RuntimeActionIds.ContentShowShieldBypassUi:
            return undefined
          case RuntimeActionIds.ContentCheckCapGuard:
          case RuntimeActionIds.ContentCheckCloudflareGuard:
            return { success: true, passed: true }
          case RuntimeActionIds.ContentPerformTempWindowFetch:
            return undefined
          default:
            throw new Error(`Unexpected action: ${message.action}`)
        }
      },
    )
    createWindowMock.mockRejectedValueOnce(
      new Error("Popup windows are not allowed on this runtime"),
    )
    createTabMock.mockResolvedValueOnce({ id: 505 })

    const { handleTempWindowFetch } = await import(
      "~/entrypoints/background/tempWindowPool"
    )

    const sendResponse = vi.fn()
    const request = handleTempWindowFetch(
      {
        originUrl: "https://example.com",
        fetchUrl: "https://example.com/api/no-response",
        fetchOptions: { method: "GET" },
        requestId: "req-no-response",
      },
      sendResponse,
    )

    await vi.advanceTimersByTimeAsync(500)
    await request
    await vi.advanceTimersByTimeAsync(2500)

    expect(sendResponse).toHaveBeenCalledWith({
      success: false,
      error: "No response from temp window fetch",
    })
    expect(removeTabOrWindowMock).toHaveBeenCalledWith(505)
  })
})
