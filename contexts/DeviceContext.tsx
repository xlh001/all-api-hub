import React, { createContext, useContext, useEffect, useState } from "react"

interface DeviceContextType {
  isTouchDevice: boolean
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined)

export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    const checkDevice = () => {
      // 检测触摸设备
      const hasTouch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches

      setIsTouchDevice(hasTouch)

      // 检测屏幕尺寸
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
      setIsDesktop(width >= 1024)
    }

    checkDevice()

    // 监听窗口大小变化
    window.addEventListener("resize", checkDevice)

    // 监听媒体查询变化
    const touchMediaQuery = window.matchMedia("(pointer: coarse)")
    const handler = () => checkDevice()

    if (touchMediaQuery.addEventListener) {
      touchMediaQuery.addEventListener("change", handler)
    }

    return () => {
      window.removeEventListener("resize", checkDevice)
      if (touchMediaQuery.removeEventListener) {
        touchMediaQuery.removeEventListener("change", handler)
      }
    }
  }, [])

  return (
    <DeviceContext.Provider
      value={{ isTouchDevice, isMobile, isTablet, isDesktop }}>
      {children}
    </DeviceContext.Provider>
  )
}

export function useDevice() {
  const context = useContext(DeviceContext)
  if (context === undefined) {
    throw new Error("useDevice must be used within a DeviceProvider")
  }
  return context
}
