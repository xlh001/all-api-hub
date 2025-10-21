import { isNotEmptyArray } from "~/utils/index.ts"

if (typeof browser === "undefined") {
  // @ts-ignore
  window.browser = chrome
}

export async function getBrowserTabs() {
  let tabs = []
  tabs = await browser.tabs.query({
    active: true,
    currentWindow: true
  })
  if (!isNotEmptyArray(tabs)) {
    tabs = await browser.tabs.query({})
  }
  return tabs || []
}
