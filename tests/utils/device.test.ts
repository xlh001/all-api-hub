import { afterEach, describe, expect, it } from "vitest"

import {
  getDeviceTypeInfo,
  isDesktopDevice,
  isMobileDevice,
  isTabletDevice,
} from "~/utils/browser/device"

const originalWindowDescriptor = Object.getOwnPropertyDescriptor(
  globalThis,
  "window",
)
const originalNavigatorDescriptor = Object.getOwnPropertyDescriptor(
  globalThis,
  "navigator",
)
const originalScreenDescriptor = Object.getOwnPropertyDescriptor(
  globalThis,
  "screen",
)

const restoreGlobals = () => {
  if (originalWindowDescriptor) {
    Object.defineProperty(globalThis, "window", originalWindowDescriptor)
  } else {
    delete (globalThis as any).window
  }

  if (originalNavigatorDescriptor) {
    Object.defineProperty(globalThis, "navigator", originalNavigatorDescriptor)
  } else {
    delete (globalThis as any).navigator
  }

  if (originalScreenDescriptor) {
    Object.defineProperty(globalThis, "screen", originalScreenDescriptor)
  } else {
    delete (globalThis as any).screen
  }
}

describe("device helpers", () => {
  afterEach(() => {
    restoreGlobals()
  })

  it("defaults to a desktop classification when browser globals are unavailable", () => {
    delete (globalThis as any).window
    delete (globalThis as any).navigator
    delete (globalThis as any).screen

    expect(getDeviceTypeInfo()).toEqual({
      type: "desktop",
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isTouchDevice: false,
    })
  })

  it("treats explicit userAgentData mobile hints as authoritative and powers the convenience wrappers", () => {
    const options = {
      userAgent: "Mozilla/5.0",
      userAgentDataMobile: true,
      screenWidth: 1366,
      screenHeight: 768,
      maxTouchPoints: 0,
    }

    expect(getDeviceTypeInfo(options)).toMatchObject({
      type: "mobile",
      isMobile: true,
      isTablet: false,
      isDesktop: false,
    })
    expect(isMobileDevice(options)).toBe(true)
    expect(isTabletDevice(options)).toBe(false)
    expect(isDesktopDevice(options)).toBe(false)
  })

  it("classifies touch-first tablets even when matchMedia throws", () => {
    const options = {
      userAgent: "Mozilla/5.0",
      matchMedia: () => {
        throw new Error("unsupported")
      },
      maxTouchPoints: 5,
      screenWidth: 1024,
      screenHeight: 768,
    }

    expect(getDeviceTypeInfo(options)).toMatchObject({
      type: "tablet",
      isMobile: false,
      isTablet: true,
      isDesktop: false,
      isTouchDevice: true,
    })
  })

  it("uses global screen and navigator fallbacks when explicit options are omitted", () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        matchMedia: undefined,
      },
    })
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: {
        userAgent: "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)",
        maxTouchPoints: 2,
        userAgentData: {
          mobile: null,
        },
      },
    })
    Object.defineProperty(globalThis, "screen", {
      configurable: true,
      value: {
        width: "wide",
        height: 820,
      },
    })

    expect(getDeviceTypeInfo()).toMatchObject({
      type: "tablet",
      isTablet: true,
      isTouchDevice: true,
    })
  })
})
