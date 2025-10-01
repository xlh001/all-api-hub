import type { DisplaySiteData } from "~/types"

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
  const logUrl = `${account.baseUrl}/log`
  chrome.tabs.create({ url: logUrl })
}
