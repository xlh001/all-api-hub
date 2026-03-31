import React from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { RuntimeActionIds } from "~/constants/runtimeActions"

type ShieldBypassPromptToastProps = {
  onDismiss: () => void
  onOpenSettings: () => Promise<void> | void
}

const {
  toastCustomMock,
  toastDismissMock,
  ensureRedemptionToastUiMock,
  sendRuntimeMessageMock,
  loggerErrorMock,
} = vi.hoisted(() => ({
  toastCustomMock: vi.fn(),
  toastDismissMock: vi.fn(),
  ensureRedemptionToastUiMock: vi.fn(),
  sendRuntimeMessageMock: vi.fn(),
  loggerErrorMock: vi.fn(),
}))

vi.mock("react-hot-toast/headless", () => ({
  default: {
    custom: toastCustomMock,
    dismiss: toastDismissMock,
  },
}))

vi.mock("~/entrypoints/content/shared/uiRoot", () => ({
  ensureRedemptionToastUi: ensureRedemptionToastUiMock,
}))

vi.mock("~/utils/browser/browserApi", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("~/utils/browser/browserApi")>()
  return {
    ...actual,
    sendRuntimeMessage: sendRuntimeMessageMock,
  }
})

vi.mock("~/utils/core/logger", () => ({
  createLogger: () => ({
    error: loggerErrorMock,
  }),
}))

describe("shieldBypassToasts", () => {
  beforeEach(() => {
    vi.resetModules()
    vi.resetAllMocks()
    ensureRedemptionToastUiMock.mockResolvedValue(undefined)
  })

  it("renders the shield-bypass prompt toast with a fixed id and wires dismiss/settings actions", async () => {
    toastCustomMock.mockReturnValue("shield-toast-id")
    sendRuntimeMessageMock.mockResolvedValue({ success: true })

    const { showShieldBypassPromptToast } = await import(
      "~/entrypoints/content/shieldBypassAssist/utils/shieldBypassToasts"
    )

    await showShieldBypassPromptToast()

    expect(ensureRedemptionToastUiMock).toHaveBeenCalledTimes(1)
    expect(toastCustomMock).toHaveBeenCalledWith(expect.any(Function), {
      id: "shield-bypass-helper",
      duration: Infinity,
    })

    const renderer = toastCustomMock.mock
      .calls[0]?.[0] as () => React.ReactElement<ShieldBypassPromptToastProps>
    const element = renderer()

    expect(React.isValidElement(element)).toBe(true)

    const props = element.props
    props.onDismiss()

    expect(toastDismissMock).toHaveBeenCalledWith("shield-bypass-helper")

    await props.onOpenSettings()

    expect(sendRuntimeMessageMock).toHaveBeenCalledWith({
      action: RuntimeActionIds.OpenSettingsShieldBypass,
    })
    expect(loggerErrorMock).not.toHaveBeenCalled()
  })

  it("logs a settings-open failure without throwing from the toast action", async () => {
    sendRuntimeMessageMock.mockRejectedValue(new Error("settings failed"))

    const { showShieldBypassPromptToast } = await import(
      "~/entrypoints/content/shieldBypassAssist/utils/shieldBypassToasts"
    )

    await showShieldBypassPromptToast()

    const renderer = toastCustomMock.mock
      .calls[0]?.[0] as () => React.ReactElement<ShieldBypassPromptToastProps>
    const element = renderer()

    await expect(element.props.onOpenSettings()).resolves.toBeUndefined()

    expect(loggerErrorMock).toHaveBeenCalledWith(
      "Failed to open settings page",
      expect.any(Error),
    )
  })
})
