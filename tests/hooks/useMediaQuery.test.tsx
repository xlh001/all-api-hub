import { renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  useIsDesktop,
  useIsMobile,
  useIsSmallScreen,
  useIsTablet,
  useMediaQuery
} from "~/hooks/useMediaQuery"

describe("useMediaQuery", () => {
  it("returns boolean for media query", () => {
    const { result } = renderHook(() => useMediaQuery("(max-width: 1px)"))
    expect(typeof result.current).toBe("boolean")
  })

  describe("predefined breakpoint hooks", () => {
    it("useIsMobile returns boolean", () => {
      const { result } = renderHook(() => useIsMobile())
      expect(typeof result.current).toBe("boolean")
    })

    it("useIsTablet returns boolean", () => {
      const { result } = renderHook(() => useIsTablet())
      expect(typeof result.current).toBe("boolean")
    })

    it("useIsDesktop returns boolean", () => {
      const { result } = renderHook(() => useIsDesktop())
      expect(typeof result.current).toBe("boolean")
    })

    it("useIsSmallScreen returns boolean", () => {
      const { result } = renderHook(() => useIsSmallScreen())
      expect(typeof result.current).toBe("boolean")
    })
  })
})
