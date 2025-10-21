import { isNotEmptyArray } from "~/utils/index.ts"

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
