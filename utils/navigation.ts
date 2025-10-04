import { getSiteApiRouter } from "~/constants/siteType"
import type { DisplaySiteData } from "~/types"
import { joinUrl } from "~/utils/url"

const getURL = (path: string) => chrome.runtime.getURL(path)

export const openFullManagerPage = () => {
  chrome.tabs.create({ url: getURL("options.html") })
}

export const openSettingsPage = () => {
  chrome.tabs.create({ url: getURL("options.html#basic") })
}

export const openSidePanel = () => {
  browser.sidebarAction.open()
  window.close()
}

export const openKeysPage = (accountId?: string) => {
  const url = accountId
    ? getURL(`options.html#keys?accountId=${accountId}`)
    : getURL("options.html#keys")
  chrome.tabs.create({ url })
}

export const openModelsPage = (accountId?: string) => {
  const url = accountId
    ? getURL(`options.html#models?accountId=${accountId}`)
    : getURL("options.html#models")
  chrome.tabs.create({ url })
}

export const openUsagePage = (account: DisplaySiteData) => {
  const logUrl = joinUrl(
    account.baseUrl,
    getSiteApiRouter(account.siteType).usagePath
  )
  chrome.tabs.create({ url: logUrl })
}
