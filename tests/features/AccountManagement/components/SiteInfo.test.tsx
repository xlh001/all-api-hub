import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import SiteInfo from "~/features/AccountManagement/components/AccountList/SiteInfo"

const { mockOpenAccountBaseUrl } = vi.hoisted(() => ({
  mockOpenAccountBaseUrl: vi.fn(),
}))

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

vi.mock("~/features/AccountManagement/hooks/AccountDataContext", () => ({
  useAccountDataContext: () => ({
    detectedAccount: null,
    isAccountPinned: () => false,
    togglePinAccount: vi.fn(),
    isPinFeatureEnabled: false,
  }),
}))

vi.mock("~/features/AccountManagement/hooks/AccountActionsContext", () => ({
  useAccountActionsContext: () => ({
    handleRefreshAccount: vi.fn(),
    refreshingAccountId: null,
    handleMarkCustomCheckInAsCheckedIn: vi.fn(),
  }),
}))

vi.mock("~/utils/navigation", () => ({
  openAccountBaseUrl: mockOpenAccountBaseUrl,
  openCheckInAndRedeem: vi.fn(),
  openCheckInPage: vi.fn(),
  openCustomCheckInPage: vi.fn(),
  openSettingsTab: vi.fn(),
}))

describe("SiteInfo", () => {
  it("shows a disabled badge and still opens the site URL", async () => {
    const user = userEvent.setup()

    render(
      <SiteInfo
        site={
          {
            id: "acc-1",
            disabled: true,
            name: "Site",
            username: "user",
            baseUrl: "https://example.com",
            siteType: "test",
            token: "token",
            userId: 1,
            authType: "access_token",
            balance: { USD: 0, CNY: 0 },
            todayConsumption: { USD: 0, CNY: 0 },
            todayIncome: { USD: 0, CNY: 0 },
            todayTokens: { upload: 0, download: 0 },
            health: { status: "healthy" },
            checkIn: { enableDetection: false },
          } as any
        }
      />,
    )

    expect(screen.getByText("list.site.disabled")).toBeInTheDocument()

    const siteLinkButton = screen.getByRole("button", { name: "Site" })

    // Regression: The link button must be able to shrink/truncate so it doesn't overlap the row action buttons.
    expect(siteLinkButton).toHaveClass("flex-1")
    expect(siteLinkButton).toHaveClass("shrink")
    expect(siteLinkButton).not.toHaveClass("w-full")

    await user.click(siteLinkButton)
    expect(mockOpenAccountBaseUrl).toHaveBeenCalledTimes(1)
    expect(mockOpenAccountBaseUrl).toHaveBeenCalledWith(
      expect.objectContaining({ baseUrl: "https://example.com" }),
    )
  })
})
