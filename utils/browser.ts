import { getExtensionURL } from "~/utils/browserApi.ts"

export const OPTIONS_PAGE_URL = getExtensionURL("options.html")

export function isFirefoxByUA(): boolean {
  return (
    navigator.userAgent.indexOf(" Firefox/") !== -1 ||
    navigator.userAgent.indexOf(" Gecko/") !== -1
  )
}

/**
 * Determines if the current device is a mobile device.
 *
 * This function checks the user agent string against a set of known mobile device keywords.
 * If the user agent string contains any of these keywords, it is considered a mobile device.
 * Otherwise, it is considered a desktop device.
 *
 * @returns {boolean} true if the device is a mobile device, false otherwise.
 */
export function isMobileByUA(): boolean {
  // 检测是否为移动设备，如果不是移动设备则认为是桌面设备
  const userAgent = navigator.userAgent.toLowerCase()
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    userAgent
  )
}

/**
 * Determines if the current device is a desktop device.
 * Returns true if the device is not identified as a mobile device.
 *
 * Returns a boolean indicating whether the device is a desktop.
 */
export function isDesktopByUA(): boolean {
  return !isMobileByUA()
}

export function isExtensionPopup() {
  try {
    const url = new URL(window.location.href)
    // 检查是否是扩展内部页面
    const isExtensionPage = url.protocol.includes("-extension:")
    // 进一步限定 popup.html 或其它命名规则
    return isExtensionPage && /popup.html/i.test(url.pathname)
  } catch {
    return false
  }
}
