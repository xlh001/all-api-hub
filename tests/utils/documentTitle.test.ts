import { describe, expect, it, vi } from "vitest"

import { setDocumentTitle } from "~/utils/documentTitle"

vi.mock("~/utils/i18n", () => ({
  default: {
    t: vi.fn((key: string) => key),
    on: vi.fn()
  }
}))

describe("documentTitle", () => {
  describe("setDocumentTitle", () => {
    it("sets title for options page", () => {
      setDocumentTitle("options")
      expect(document.title).toBe("ui:pageTitle.options")
    })

    it("sets title for popup page", () => {
      setDocumentTitle("popup")
      expect(document.title).toBe("ui:pageTitle.popup")
    })

    it("sets title for sidepanel page", () => {
      setDocumentTitle("sidepanel")
      expect(document.title).toBe("ui:pageTitle.sidepanel")
    })
  })
})
