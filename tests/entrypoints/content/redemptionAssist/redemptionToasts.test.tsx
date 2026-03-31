import { waitFor } from "@testing-library/react"
import React from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const {
  toastCustomMock,
  toastSuccessMock,
  toastErrorMock,
  toastDismissMock,
  ensureRedemptionToastUiMock,
} = vi.hoisted(() => ({
  toastCustomMock: vi.fn(),
  toastSuccessMock: vi.fn(),
  toastErrorMock: vi.fn(),
  toastDismissMock: vi.fn(),
  ensureRedemptionToastUiMock: vi.fn(),
}))

vi.mock("react-hot-toast/headless", () => ({
  default: {
    custom: toastCustomMock,
    success: toastSuccessMock,
    error: toastErrorMock,
    dismiss: toastDismissMock,
  },
}))

vi.mock("~/entrypoints/content/shared/uiRoot", () => ({
  ensureRedemptionToastUi: ensureRedemptionToastUiMock,
}))

vi.mock(
  "~/entrypoints/content/redemptionAssist/components/RedemptionAccountSelectToast",
  () => ({
    RedemptionAccountSelectToast: (props: unknown) =>
      React.createElement("mock-account-select-toast", props),
  }),
)

vi.mock(
  "~/entrypoints/content/redemptionAssist/components/RedemptionBatchResultToast",
  () => ({
    RedemptionBatchResultToast: (props: unknown) =>
      React.createElement("mock-batch-result-toast", props),
  }),
)

vi.mock(
  "~/entrypoints/content/redemptionAssist/components/RedemptionLoadingToast",
  () => ({
    RedemptionLoadingToast: (props: unknown) =>
      React.createElement("mock-loading-toast", props),
  }),
)

vi.mock(
  "~/entrypoints/content/redemptionAssist/components/RedemptionPromptToast",
  () => ({
    RedemptionPromptToast: (props: unknown) =>
      React.createElement("mock-prompt-toast", props),
  }),
)

describe("redemptionToasts", () => {
  beforeEach(() => {
    vi.resetModules()
    vi.resetAllMocks()
    ensureRedemptionToastUiMock.mockResolvedValue(undefined)
  })

  it("shows the loading toast through the shared UI root with an indefinite duration", async () => {
    toastCustomMock.mockReturnValue("loading-toast-id")

    const { showRedeemLoadingToast } = await import(
      "~/entrypoints/content/redemptionAssist/utils/redemptionToasts"
    )

    await expect(showRedeemLoadingToast("Redeeming now")).resolves.toBe(
      "loading-toast-id",
    )

    expect(ensureRedemptionToastUiMock).toHaveBeenCalledTimes(1)
    expect(toastCustomMock).toHaveBeenCalledWith(expect.any(Function), {
      duration: Infinity,
    })

    const loadingRenderer = toastCustomMock.mock.calls[0]?.[0]
    const loadingElement = loadingRenderer()

    expect(React.isValidElement(loadingElement)).toBe(true)
    expect((loadingElement as React.ReactElement).props.message).toBe(
      "Redeeming now",
    )
  })

  it("passes toast ids through to dismissToast", async () => {
    const { dismissToast } = await import(
      "~/entrypoints/content/redemptionAssist/utils/redemptionToasts"
    )

    dismissToast("toast-123")
    dismissToast()

    expect(toastDismissMock).toHaveBeenNthCalledWith(1, "toast-123")
    expect(toastDismissMock).toHaveBeenNthCalledWith(2, undefined)
  })

  it("skips blank result toasts and routes non-blank messages to success or error", async () => {
    const { showRedeemResultToast } = await import(
      "~/entrypoints/content/redemptionAssist/utils/redemptionToasts"
    )

    await showRedeemResultToast(true, "")

    expect(ensureRedemptionToastUiMock).not.toHaveBeenCalled()
    expect(toastSuccessMock).not.toHaveBeenCalled()
    expect(toastErrorMock).not.toHaveBeenCalled()

    await showRedeemResultToast(true, "Redeemed")
    await showRedeemResultToast(false, "Failed")

    expect(ensureRedemptionToastUiMock).toHaveBeenCalledTimes(2)
    expect(toastSuccessMock).toHaveBeenCalledWith("Redeemed")
    expect(toastErrorMock).toHaveBeenCalledWith("Failed")
  })

  it("resolves account selection exactly once and dismisses the owning toast", async () => {
    let renderedElement: React.ReactElement | null = null

    toastCustomMock.mockImplementation((renderer) => {
      const element = renderer({ id: "account-toast-id" })
      expect(React.isValidElement(element)).toBe(true)
      renderedElement = element as React.ReactElement
      expect(renderedElement.props.title).toBe("Pick account")
      expect(renderedElement.props.message).toBe("Choose one")
      return "account-toast-return"
    })

    const { showAccountSelectToast } = await import(
      "~/entrypoints/content/redemptionAssist/utils/redemptionToasts"
    )

    const chosenAccount = { id: "account-a", siteName: "Alpha" } as any
    const ignoredAccount = { id: "account-b", siteName: "Beta" } as any

    const selectionPromise = showAccountSelectToast([chosenAccount], {
      title: "Pick account",
      message: "Choose one",
    })

    await waitFor(() => {
      expect(toastCustomMock).toHaveBeenCalledTimes(1)
      expect(renderedElement).toBeTruthy()
    })

    renderedElement!.props.onSelect(chosenAccount)
    renderedElement!.props.onSelect(ignoredAccount)

    await expect(selectionPromise).resolves.toBe(chosenAccount)
    expect(toastDismissMock).toHaveBeenCalledTimes(1)
    expect(toastDismissMock).toHaveBeenCalledWith("account-toast-id")
  })

  it("resolves the redemption prompt exactly once and preserves the first action payload", async () => {
    toastCustomMock.mockReturnValue("prompt-toast-return")

    const { showRedemptionPromptToast } = await import(
      "~/entrypoints/content/redemptionAssist/utils/redemptionToasts"
    )

    const promptPromise = showRedemptionPromptToast("Prompt message", [
      { code: "code-a", preview: "AA**" },
      { code: "code-b", preview: "BB**" },
    ])

    await waitFor(() => {
      expect(toastCustomMock).toHaveBeenCalledTimes(1)
    })

    const promptRenderer = toastCustomMock.mock.calls[0]?.[0]
    const promptElement = promptRenderer({ id: "prompt-toast-id" })
    const firstResult = { action: "auto", selectedCodes: ["code-a"] }

    expect((promptElement as React.ReactElement).props.message).toBe(
      "Prompt message",
    )
    expect((promptElement as React.ReactElement).props.codes).toEqual([
      { code: "code-a", preview: "AA**" },
      { code: "code-b", preview: "BB**" },
    ])
    ;(promptElement as React.ReactElement).props.onAction(firstResult)
    ;(promptElement as React.ReactElement).props.onAction({
      action: "cancel",
      selectedCodes: [],
    })

    await expect(promptPromise).resolves.toEqual(firstResult)
    expect(toastDismissMock).toHaveBeenCalledTimes(1)
    expect(toastDismissMock).toHaveBeenCalledWith("prompt-toast-id")
  })

  it("renders the batch result toast with an indefinite duration and dismisses on close", async () => {
    toastCustomMock.mockReturnValue("batch-toast-return")

    const { showRedeemBatchResultToast } = await import(
      "~/entrypoints/content/redemptionAssist/utils/redemptionToasts"
    )

    const results = [
      {
        code: "code-a",
        preview: "AA**",
        success: false,
        message: "Failed",
      },
    ]
    const onRetry = vi.fn()

    await expect(showRedeemBatchResultToast(results, onRetry)).resolves.toBe(
      "batch-toast-return",
    )

    expect(ensureRedemptionToastUiMock).toHaveBeenCalledTimes(1)
    expect(toastCustomMock).toHaveBeenCalledWith(expect.any(Function), {
      duration: Infinity,
    })

    await waitFor(() => {
      expect(toastCustomMock).toHaveBeenCalledTimes(1)
    })

    const batchRenderer = toastCustomMock.mock.calls[0]?.[0]
    const batchElement = batchRenderer({ id: "batch-toast-id" })

    expect((batchElement as React.ReactElement).props.results).toEqual(results)
    expect((batchElement as React.ReactElement).props.onRetry).toBe(onRetry)
    ;(batchElement as React.ReactElement).props.onClose()

    expect(toastDismissMock).toHaveBeenCalledWith("batch-toast-id")
  })
})
