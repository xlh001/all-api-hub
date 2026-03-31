import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { ApiCheckConfirmToast } from "~/entrypoints/content/webAiApiCheck/components/ApiCheckConfirmToast"

vi.mock("react-i18next", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-i18next")>()

  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => {
        const map: Record<string, string> = {
          "webAiApiCheck:confirmToast.title": "AI API URL and API Key Detected",
          "webAiApiCheck:confirmToast.body":
            "Do you want to open the AI API test Panel to check and test the AI API's availability?",
          "webAiApiCheck:confirmToast.open": "Open",
          "common:actions.cancel": "Cancel",
        }
        return map[key] ?? key
      },
    }),
  }
})

describe("ApiCheckConfirmToast", () => {
  it("renders the confirmation copy and emits cancel and confirm actions without bubbling clicks", async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    const parentClick = vi.fn()

    render(
      <div onClick={parentClick}>
        <ApiCheckConfirmToast onAction={onAction} />
      </div>,
    )

    expect(
      screen.getByText("AI API URL and API Key Detected"),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        "Do you want to open the AI API test Panel to check and test the AI API's availability?",
      ),
    ).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Cancel" }))
    await user.click(
      screen.getByRole("button", {
        name: "Open",
      }),
    )

    expect(onAction).toHaveBeenNthCalledWith(1, "cancel")
    expect(onAction).toHaveBeenNthCalledWith(2, "confirm")
    expect(parentClick).not.toHaveBeenCalled()
  })
})
