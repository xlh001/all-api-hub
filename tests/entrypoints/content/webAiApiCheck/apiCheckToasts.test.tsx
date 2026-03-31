import { waitFor } from "@testing-library/react"
import React from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const { toastCustomMock, toastDismissMock, ensureRedemptionToastUiMock } =
  vi.hoisted(() => ({
    toastCustomMock: vi.fn(),
    toastDismissMock: vi.fn(),
    ensureRedemptionToastUiMock: vi.fn(),
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

vi.mock(
  "~/entrypoints/content/webAiApiCheck/components/ApiCheckConfirmToast",
  () => ({
    ApiCheckConfirmToast: (props: unknown) =>
      React.createElement("mock-api-check-confirm-toast", props),
  }),
)

describe("apiCheckToasts", () => {
  beforeEach(() => {
    vi.resetModules()
    vi.resetAllMocks()
    ensureRedemptionToastUiMock.mockResolvedValue(undefined)
  })

  it("shows the confirm toast with infinite duration and resolves true only once for confirm actions", async () => {
    let renderedElement: React.ReactElement | null = null

    toastCustomMock.mockImplementation((renderer) => {
      const element = renderer({ id: "api-check-toast-id" })
      renderedElement = element as React.ReactElement
      return "api-check-toast-return"
    })

    const { showApiCheckConfirmToast } = await import(
      "~/entrypoints/content/webAiApiCheck/utils/apiCheckToasts"
    )

    const toastPromise = showApiCheckConfirmToast()

    await waitFor(() => {
      expect(ensureRedemptionToastUiMock).toHaveBeenCalledTimes(1)
      expect(toastCustomMock).toHaveBeenCalledWith(expect.any(Function), {
        duration: Infinity,
      })
      expect(renderedElement).toBeTruthy()
    })

    renderedElement!.props.onAction("confirm")
    renderedElement!.props.onAction("cancel")

    await expect(toastPromise).resolves.toBe(true)
    expect(toastDismissMock).toHaveBeenCalledTimes(1)
    expect(toastDismissMock).toHaveBeenCalledWith("api-check-toast-id")
  })

  it("resolves false for cancel actions and still dismisses the owning toast once", async () => {
    toastCustomMock.mockReturnValue("api-check-toast-return")

    const { showApiCheckConfirmToast } = await import(
      "~/entrypoints/content/webAiApiCheck/utils/apiCheckToasts"
    )

    const toastPromise = showApiCheckConfirmToast()

    await waitFor(() => {
      expect(toastCustomMock).toHaveBeenCalledTimes(1)
    })

    const renderer = toastCustomMock.mock.calls[0]?.[0]
    const element = renderer({ id: "api-check-toast-id" }) as React.ReactElement

    element.props.onAction("cancel")
    element.props.onAction("confirm")

    await expect(toastPromise).resolves.toBe(false)
    expect(toastDismissMock).toHaveBeenCalledTimes(1)
    expect(toastDismissMock).toHaveBeenCalledWith("api-check-toast-id")
  })
})
