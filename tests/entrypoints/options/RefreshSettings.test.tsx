import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import toast from "react-hot-toast"
import { I18nextProvider } from "react-i18next"
import { describe, expect, it, vi } from "vitest"

import { useUserPreferencesContext } from "~/contexts/UserPreferencesContext"
import RefreshSettings from "~/entrypoints/options/pages/BasicSettings/components/RefreshSettings"
import commonEn from "~/locales/en/common.json"
import settingsEn from "~/locales/en/settings.json"
import { testI18n } from "~/tests/test-utils/i18n"

vi.mock("~/contexts/UserPreferencesContext", () => ({
  useUserPreferencesContext: vi.fn(),
}))

vi.mock("~/utils/toastHelpers", () => ({
  showUpdateToast: vi.fn(),
}))

vi.mock("react-hot-toast", () => ({
  default: { error: vi.fn() },
}))

describe("RefreshSettings (min refresh interval)", () => {
  testI18n.addResourceBundle("en", "settings", settingsEn, true, true)
  testI18n.addResourceBundle("en", "common", commonEn, true, true)

  const renderSubject = () =>
    render(
      <I18nextProvider i18n={testI18n}>
        <RefreshSettings />
      </I18nextProvider>,
    )

  it("accepts values greater than 300 seconds (no max cap)", async () => {
    const updateMinRefreshInterval = vi.fn().mockResolvedValue(true)
    vi.mocked(useUserPreferencesContext).mockReturnValue({
      autoRefresh: true,
      refreshOnOpen: true,
      refreshInterval: 360,
      minRefreshInterval: 60,
      updateAutoRefresh: vi.fn().mockResolvedValue(true),
      updateRefreshOnOpen: vi.fn().mockResolvedValue(true),
      updateRefreshInterval: vi.fn().mockResolvedValue(true),
      updateMinRefreshInterval,
      resetAutoRefreshConfig: vi.fn().mockResolvedValue(true),
    } as any)

    renderSubject()

    const input = screen.getByPlaceholderText("60")
    fireEvent.change(input, { target: { value: "301" } })
    fireEvent.blur(input)

    await waitFor(() => {
      expect(updateMinRefreshInterval).toHaveBeenCalledWith(301)
    })
    expect(vi.mocked(toast).error).not.toHaveBeenCalled()
  })

  it("rejects negative values", async () => {
    const updateMinRefreshInterval = vi.fn().mockResolvedValue(true)
    vi.mocked(useUserPreferencesContext).mockReturnValue({
      autoRefresh: true,
      refreshOnOpen: true,
      refreshInterval: 360,
      minRefreshInterval: 60,
      updateAutoRefresh: vi.fn().mockResolvedValue(true),
      updateRefreshOnOpen: vi.fn().mockResolvedValue(true),
      updateRefreshInterval: vi.fn().mockResolvedValue(true),
      updateMinRefreshInterval,
      resetAutoRefreshConfig: vi.fn().mockResolvedValue(true),
    } as any)

    renderSubject()

    const input = screen.getByPlaceholderText("60") as HTMLInputElement
    fireEvent.change(input, { target: { value: "-1" } })
    fireEvent.blur(input)

    await waitFor(() => {
      expect(vi.mocked(toast).error).toHaveBeenCalled()
    })
    expect(updateMinRefreshInterval).not.toHaveBeenCalled()
    await waitFor(() => {
      expect(input.value).toBe("60")
    })
  })
})
