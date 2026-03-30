import { describe, expect, it, vi } from "vitest"

import {
  isInvalidAccessTokenMessage,
  isNoTabWithIdMessage,
  translateAutoCheckinMessageKey,
} from "~/features/AutoCheckin/utils/autoCheckin"

describe("autoCheckin utils", () => {
  describe("translateAutoCheckinMessageKey", () => {
    it.each([
      "autoCheckin:providerFallback.alreadyCheckedToday",
      "autoCheckin:providerFallback.checkinSuccessful",
      "autoCheckin:providerFallback.checkinFailed",
      "autoCheckin:providerFallback.endpointNotSupported",
      "autoCheckin:providerFallback.unknownError",
      "autoCheckin:providerFallback.turnstileManualRequired",
      "autoCheckin:providerFallback.turnstileIncognitoAccessRequired",
      "autoCheckin:providerWong.checkinDisabled",
      "autoCheckin:skipReasons.account_disabled",
      "autoCheckin:skipReasons.detection_disabled",
      "autoCheckin:skipReasons.auto_checkin_disabled",
      "autoCheckin:skipReasons.already_checked_today",
      "autoCheckin:skipReasons.no_provider",
      "autoCheckin:skipReasons.provider_not_ready",
    ])("translates the known key %s", (messageKey) => {
      const t = vi.fn(
        (key: string, params?: Record<string, unknown>) =>
          `${key}:${String(params?.count ?? "")}`,
      )

      const result = translateAutoCheckinMessageKey(t as any, messageKey, {
        count: 2,
      })

      expect(result).toBe(`${messageKey}:2`)
      expect(t).toHaveBeenCalledWith(messageKey, { count: 2 })
    })

    it("returns unknown backend messages unchanged", () => {
      const t = vi.fn()

      expect(
        translateAutoCheckinMessageKey(
          t as any,
          "backend failure: upstream temporarily unavailable",
        ),
      ).toBe("backend failure: upstream temporarily unavailable")
      expect(t).not.toHaveBeenCalled()
    })
  })

  describe("isInvalidAccessTokenMessage", () => {
    it("returns false for blank messages", () => {
      expect(isInvalidAccessTokenMessage("")).toBe(false)
    })

    it("detects the strict chinese invalid-token snippet", () => {
      expect(isInvalidAccessTokenMessage("Access Token 无效，请重新登录")).toBe(
        true,
      )
    })

    it("detects english invalid or expired access-token hints", () => {
      expect(
        isInvalidAccessTokenMessage(
          "Your access token is invalid for this API",
        ),
      ).toBe(true)
      expect(
        isInvalidAccessTokenMessage(
          "The ACCESS TOKEN has expired, please retry",
        ),
      ).toBe(true)
    })

    it("requires an invalidity hint when only the access-token keyword appears", () => {
      expect(
        isInvalidAccessTokenMessage("access token accepted but quota exceeded"),
      ).toBe(false)
    })
  })

  describe("isNoTabWithIdMessage", () => {
    it("returns false for blank messages", () => {
      expect(isNoTabWithIdMessage("")).toBe(false)
    })

    it.each([
      "No tab with id: 123",
      "no tab with id 42",
      "RuntimeError: No Tab With Id: 7",
    ])("detects the known closed-tab error shape: %s", (message) => {
      expect(isNoTabWithIdMessage(message)).toBe(true)
    })

    it("does not match unrelated tab errors", () => {
      expect(isNoTabWithIdMessage("tab closed unexpectedly")).toBe(false)
      expect(isNoTabWithIdMessage("no window with id: 3")).toBe(false)
    })
  })
})
