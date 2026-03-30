import userEvent from "@testing-library/user-event"
import type { ReactNode } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { ClaudeCodeRouterImportDialog } from "~/components/ClaudeCodeRouterImportDialog"
import {
  buildApiToken,
  buildDisplaySiteData,
} from "~~/tests/test-utils/factories"
import { fireEvent, render, screen, waitFor } from "~~/tests/test-utils/render"

vi.mock("~/contexts/UserPreferencesContext", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("~/contexts/UserPreferencesContext")>()
  return {
    ...actual,
    UserPreferencesProvider: ({ children }: { children: ReactNode }) =>
      children,
    useUserPreferencesContext: () => ({
      themeMode: "system",
      updateThemeMode: vi.fn().mockResolvedValue(true),
    }),
  }
})

const mockResolveDisplayAccountTokenForSecret = vi.fn()
const mockFetchOpenAICompatibleModels = vi.fn()
const mockImportToClaudeCodeRouter = vi.fn()
const mockShowResultToast = vi.fn()

vi.mock(
  "~/services/accounts/utils/apiServiceRequest",
  async (importOriginal) => {
    const original =
      await importOriginal<
        typeof import("~/services/accounts/utils/apiServiceRequest")
      >()
    return {
      ...original,
      resolveDisplayAccountTokenForSecret: (...args: any[]) =>
        mockResolveDisplayAccountTokenForSecret(...args),
    }
  },
)

vi.mock("~/services/apiService/openaiCompatible", () => ({
  fetchOpenAICompatibleModels: (...args: any[]) =>
    mockFetchOpenAICompatibleModels(...args),
}))

vi.mock("~/services/integrations/claudeCodeRouterService", () => ({
  importToClaudeCodeRouter: (...args: any[]) =>
    mockImportToClaudeCodeRouter(...args),
}))

vi.mock("~/utils/core/toastHelpers", () => ({
  showResultToast: (...args: any[]) => mockShowResultToast(...args),
}))

describe("ClaudeCodeRouterImportDialog", () => {
  beforeEach(() => {
    mockResolveDisplayAccountTokenForSecret.mockReset()
    mockFetchOpenAICompatibleModels.mockReset()
    mockImportToClaudeCodeRouter.mockReset()
    mockShowResultToast.mockReset()

    mockResolveDisplayAccountTokenForSecret.mockImplementation(
      async (_account, token) => token,
    )
    mockFetchOpenAICompatibleModels.mockResolvedValue([])
    mockImportToClaudeCodeRouter.mockResolvedValue({
      success: true,
      message: "ok",
    })
  })

  it("prefills provider fields, refetches models for edited endpoints, and submits trimmed values", async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    mockFetchOpenAICompatibleModels
      .mockResolvedValueOnce([{ id: "z-model" }, { id: "" }, { id: "a-model" }])
      .mockResolvedValueOnce([{ id: "edited-model" }])

    render(
      <ClaudeCodeRouterImportDialog
        isOpen={true}
        onClose={onClose}
        account={buildDisplaySiteData({
          id: "acc",
          name: "Example",
          baseUrl: "https://x.test",
        })}
        token={buildApiToken({ id: 7, key: "sk-test" })}
        routerBaseUrl="https://router.example.com"
        routerApiKey="router-secret"
      />,
    )

    const providerNameInput = await screen.findByPlaceholderText(
      "ui:dialog.claudeCodeRouter.placeholders.providerName",
    )
    const providerApiBaseUrlInput = screen.getByPlaceholderText(
      "ui:dialog.claudeCodeRouter.placeholders.providerApiBaseUrl",
    )

    expect(providerNameInput).toHaveValue("Example")
    expect(providerApiBaseUrlInput).toHaveValue(
      "https://x.test/v1/chat/completions",
    )

    await waitFor(() => {
      expect(mockFetchOpenAICompatibleModels).toHaveBeenCalledWith({
        baseUrl: "https://x.test",
        apiKey: "sk-test",
      })
    })

    fireEvent.change(providerNameInput, {
      target: { value: "  Trimmed Provider  " },
    })
    fireEvent.change(providerApiBaseUrlInput, {
      target: {
        value: "  https://proxy.example.com/openai/v1/chat/completions  ",
      },
    })

    await waitFor(() => {
      expect(mockFetchOpenAICompatibleModels).toHaveBeenLastCalledWith({
        baseUrl: "https://proxy.example.com/openai",
        apiKey: "sk-test",
      })
    })

    const restartCheckbox = screen.getByRole("checkbox")
    expect(restartCheckbox).toBeChecked()
    await user.click(restartCheckbox)
    expect(restartCheckbox).not.toBeChecked()

    await user.click(screen.getByRole("combobox"))
    expect(
      await screen.findByRole("option", { name: "edited-model" }),
    ).toBeInTheDocument()
    await user.click(screen.getByRole("option", { name: "edited-model" }))
    await user.keyboard("{Escape}")
    await waitFor(() => {
      expect(
        screen.queryByRole("option", { name: "edited-model" }),
      ).not.toBeInTheDocument()
    })

    await user.click(
      screen.getByRole("button", { name: "common:actions.import" }),
    )

    await waitFor(() => {
      expect(mockImportToClaudeCodeRouter).toHaveBeenCalledWith(
        expect.objectContaining({
          routerBaseUrl: "https://router.example.com",
          routerApiKey: "router-secret",
          providerName: "Trimmed Provider",
          providerApiBaseUrl:
            "https://proxy.example.com/openai/v1/chat/completions",
          providerModels: ["edited-model"],
          restartAfterSave: false,
        }),
      )
    })

    expect(mockShowResultToast).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: "ok",
      }),
    )
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("clears model suggestions when the provider endpoint becomes blank", async () => {
    const user = userEvent.setup()

    mockFetchOpenAICompatibleModels.mockResolvedValueOnce([
      { id: "alpha-model" },
    ])

    render(
      <ClaudeCodeRouterImportDialog
        isOpen={true}
        onClose={() => {}}
        account={buildDisplaySiteData({
          id: "acc",
          name: "Example",
          baseUrl: "https://x.test",
        })}
        token={buildApiToken({ key: "sk-test" })}
        routerBaseUrl="https://router.example.com"
      />,
    )

    await waitFor(() => {
      expect(mockFetchOpenAICompatibleModels).toHaveBeenCalledWith({
        baseUrl: "https://x.test",
        apiKey: "sk-test",
      })
    })

    await user.click(screen.getByRole("combobox"))
    expect(
      await screen.findByRole("option", { name: "alpha-model" }),
    ).toBeInTheDocument()

    fireEvent.change(
      screen.getByPlaceholderText(
        "ui:dialog.claudeCodeRouter.placeholders.providerApiBaseUrl",
      ),
      {
        target: { value: "   " },
      },
    )

    await user.click(screen.getByRole("combobox"))
    await waitFor(() => {
      expect(
        screen.queryByRole("option", { name: "alpha-model" }),
      ).not.toBeInTheDocument()
    })
    expect(mockFetchOpenAICompatibleModels).toHaveBeenCalledTimes(1)
  })

  it("shows a failed import result without closing the dialog", async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    mockImportToClaudeCodeRouter.mockResolvedValueOnce({
      success: false,
      message: "router rejected config",
    })

    render(
      <ClaudeCodeRouterImportDialog
        isOpen={true}
        onClose={onClose}
        account={buildDisplaySiteData({
          id: "acc",
          name: "Example",
          baseUrl: "https://x.test",
        })}
        token={buildApiToken({ key: "sk-test" })}
        routerBaseUrl="https://router.example.com"
      />,
    )

    await user.click(
      await screen.findByRole("button", { name: "common:actions.import" }),
    )

    await waitFor(() => {
      expect(mockShowResultToast).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "router rejected config",
        }),
      )
    })
    expect(onClose).not.toHaveBeenCalled()
  })

  it("falls back to a local error toast when submission throws", async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    mockImportToClaudeCodeRouter.mockRejectedValueOnce(
      new Error("router unavailable"),
    )

    render(
      <ClaudeCodeRouterImportDialog
        isOpen={true}
        onClose={onClose}
        account={buildDisplaySiteData({
          id: "acc",
          name: "Example",
          baseUrl: "https://x.test",
        })}
        token={buildApiToken({ key: "sk-test" })}
        routerBaseUrl="https://router.example.com"
      />,
    )

    const submitButton = await screen.findByRole("button", {
      name: "common:actions.import",
    })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockShowResultToast).toHaveBeenCalled()
    })

    const toastArg = mockShowResultToast.mock.calls[0][0]
    expect(toastArg.success).toBe(false)
    expect(String(toastArg.message)).toBe("messages:errors.operation.failed")
    expect(onClose).not.toHaveBeenCalled()
    expect(submitButton).toBeEnabled()
  })
})
