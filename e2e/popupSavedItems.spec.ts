import { OPTIONS_PAGE_PATH, POPUP_PAGE_PATH } from "~/constants/extensionPages"
import { MENU_ITEM_IDS } from "~/constants/optionsMenuIds"
import { STORAGE_KEYS } from "~/services/core/storageKeys"
import type { SiteBookmark } from "~/types"
import { expect, test } from "~~/e2e/fixtures/extensionTest"
import {
  createStoredAccount,
  createStoredApiCredentialProfile,
  createStoredBookmark,
  forceExtensionLanguage,
  installExtensionPageGuards,
  seedApiCredentialProfiles,
  seedStoredAccounts,
  seedStoredBookmarks,
  stubLlmMetadataIndex,
  waitForExtensionPage,
} from "~~/e2e/utils/commonUserFlows"
import {
  getPlasmoStorageRawValue,
  getServiceWorker,
} from "~~/e2e/utils/extensionState"
import { waitForExtensionRoot } from "~~/e2e/utils/lazyLoading"

async function readStoredBookmarks(
  serviceWorker: Awaited<ReturnType<typeof getServiceWorker>>,
): Promise<SiteBookmark[]> {
  const raw = await getPlasmoStorageRawValue<unknown>(
    serviceWorker,
    STORAGE_KEYS.ACCOUNTS,
  )

  if (typeof raw !== "string") return []

  try {
    const parsed = JSON.parse(raw) as { bookmarks?: SiteBookmark[] }
    return Array.isArray(parsed.bookmarks) ? parsed.bookmarks : []
  } catch {
    return []
  }
}

async function expectBrowserTabOpened(
  serviceWorker: Awaited<ReturnType<typeof getServiceWorker>>,
  url: string,
) {
  await expect
    .poll(async () => {
      return await serviceWorker.evaluate(async (targetUrl) => {
        const chromeApi = (globalThis as any).chrome
        const tabs = await chromeApi.tabs.query({})
        return tabs.some((tab: { url?: string }) => tab.url === targetUrl)
      }, url)
    })
    .toBe(true)
}

test.beforeEach(async ({ context, page }) => {
  installExtensionPageGuards(page)
  await forceExtensionLanguage(page, "en")
  await stubLlmMetadataIndex(context)
})

test("opens the full management page for the active popup tab", async ({
  context,
  extensionId,
  page,
}) => {
  const serviceWorker = await getServiceWorker(context)
  await seedStoredBookmarks(serviceWorker, [
    createStoredBookmark({
      id: "popup-bookmark-1",
      name: "Popup Bookmark",
      url: "https://bookmark.example.com/docs",
    }),
  ])
  await seedApiCredentialProfiles(serviceWorker, [
    createStoredApiCredentialProfile({
      id: "popup-profile-1",
      name: "Popup Profile",
      baseUrl: "https://api.example.com",
      apiKey: "sk-popup-profile",
    }),
  ])

  await page.goto(`chrome-extension://${extensionId}/${POPUP_PAGE_PATH}`)
  await waitForExtensionRoot(page)

  await page.getByRole("tab", { name: "Bookmarks" }).click()
  await expect(page.getByTestId("popup-view-bookmarks")).toBeVisible()

  const bookmarkPagePromise = waitForExtensionPage(context, {
    extensionId,
    path: "options.html",
    hash: "#bookmark",
  })
  await page.getByRole("button", { name: "Bookmark Management" }).click()
  const bookmarkPage = await bookmarkPagePromise
  installExtensionPageGuards(bookmarkPage)
  await waitForExtensionRoot(bookmarkPage)
  await expect(bookmarkPage).toHaveURL(/options\.html#bookmark$/)
  await bookmarkPage.close()

  const apiPopupPage = await context.newPage()
  installExtensionPageGuards(apiPopupPage)
  await forceExtensionLanguage(apiPopupPage, "en")
  await apiPopupPage.goto(
    `chrome-extension://${extensionId}/${POPUP_PAGE_PATH}`,
  )
  await waitForExtensionRoot(apiPopupPage)
  await apiPopupPage.getByRole("tab", { name: "API Credentials" }).click()
  await expect(
    apiPopupPage.getByTestId("api-credential-profiles-popup-view"),
  ).toBeVisible()

  const profilesPagePromise = waitForExtensionPage(context, {
    extensionId,
    path: "options.html",
    hash: "#apiCredentialProfiles",
  })
  await apiPopupPage
    .getByRole("button", { name: "API Credential Profiles" })
    .click()
  const profilesPage = await profilesPagePromise
  installExtensionPageGuards(profilesPage)
  await waitForExtensionRoot(profilesPage)
  await expect(profilesPage).toHaveURL(/options\.html#apiCredentialProfiles$/)
})

test("opens the account manager from the default popup accounts tab", async ({
  context,
  extensionId,
  page,
}) => {
  const serviceWorker = await getServiceWorker(context)
  await seedStoredAccounts(serviceWorker, [
    createStoredAccount({
      id: "popup-account-1",
      site_name: "Popup Account",
      site_url: "https://popup-account.example.com",
      account_info: {
        id: 501,
        username: "popup-account-user",
        access_token: "popup-account-token",
      },
    }),
  ])

  await page.goto(`chrome-extension://${extensionId}/${POPUP_PAGE_PATH}`)
  await waitForExtensionRoot(page)

  await expect(page.getByTestId("popup-view-accounts")).toBeVisible()
  await expect(
    page.getByRole("button", { name: "Popup Account" }),
  ).toBeVisible()

  const accountPagePromise = waitForExtensionPage(context, {
    extensionId,
    path: OPTIONS_PAGE_PATH,
    hash: `#${MENU_ITEM_IDS.ACCOUNT}`,
  })
  await page.getByRole("button", { name: "Account Management" }).click()

  const accountPage = await accountPagePromise
  installExtensionPageGuards(accountPage)
  await waitForExtensionRoot(accountPage)

  await expect(accountPage).toHaveURL(/options\.html#account$/)
  await expect(
    accountPage.getByRole("button", { name: "Popup Account" }),
  ).toBeVisible()
})

test("opens a saved account site from the popup accounts tab", async ({
  context,
  extensionId,
  page,
}) => {
  const serviceWorker = await getServiceWorker(context)
  await seedStoredAccounts(serviceWorker, [
    createStoredAccount({
      id: "popup-open-account",
      site_name: "Open Account",
      site_url: "https://account-open.example.com",
      account_info: {
        id: 601,
        username: "open-account-user",
        access_token: "open-account-token",
      },
    }),
  ])

  await page.goto(`chrome-extension://${extensionId}/${POPUP_PAGE_PATH}`)
  await waitForExtensionRoot(page)

  await expect(page.getByTestId("popup-view-accounts")).toBeVisible()
  await page.getByRole("button", { name: "Open Account" }).click()

  await expectBrowserTabOpened(
    serviceWorker,
    "https://account-open.example.com/",
  )
})

test("adds a bookmark from the popup bookmarks tab and keeps it in storage", async ({
  context,
  extensionId,
  page,
}) => {
  const serviceWorker = await getServiceWorker(context)

  await page.goto(`chrome-extension://${extensionId}/${POPUP_PAGE_PATH}`)
  await waitForExtensionRoot(page)

  await page.getByRole("tab", { name: "Bookmarks" }).click()
  await expect(page.getByTestId("bookmarks-list-view")).toBeVisible()
  await expect(page.getByText("No bookmarks yet")).toBeVisible()

  await page
    .getByTestId("popup-view-bookmarks")
    .getByRole("button", { name: "Add Bookmark" })
    .first()
    .click()

  const dialog = page.getByRole("dialog")
  await expect(dialog.getByPlaceholder("e.g. Admin Console")).toBeVisible()
  await dialog.getByPlaceholder("e.g. Admin Console").fill("Popup Docs")
  await dialog
    .getByPlaceholder("https://example.com/...")
    .fill("https://docs.example.com/popup")
  await dialog
    .getByPlaceholder("Optional notes...")
    .fill("Added from the popup")
  await dialog.getByRole("button", { name: "Add Bookmark" }).click()

  await expect(page.getByRole("button", { name: "Popup Docs" })).toBeVisible()
  await expect(page.getByText("No bookmarks yet")).toHaveCount(0)

  await expect
    .poll(async () => {
      const bookmarks = await readStoredBookmarks(serviceWorker)
      return (
        bookmarks.find((bookmark) => bookmark.name === "Popup Docs") ?? null
      )
    })
    .toMatchObject({
      name: "Popup Docs",
      url: "https://docs.example.com/popup",
      notes: "Added from the popup",
    })
})

test("adds a bookmark from the popup, edits it in management, and opens the updated target", async ({
  context,
  extensionId,
  page,
}) => {
  const serviceWorker = await getServiceWorker(context)
  await context.route("https://docs.example.com/updated", (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "<!doctype html><title>Updated Docs</title><h1>Updated Docs</h1>",
    }),
  )

  await page.goto(`chrome-extension://${extensionId}/${POPUP_PAGE_PATH}`)
  await waitForExtensionRoot(page)

  await page.getByRole("tab", { name: "Bookmarks" }).click()
  await expect(page.getByTestId("bookmarks-list-view")).toBeVisible()

  await page
    .getByTestId("popup-view-bookmarks")
    .getByRole("button", { name: "Add Bookmark" })
    .first()
    .click()

  const addDialog = page.getByRole("dialog")
  await addDialog.getByPlaceholder("e.g. Admin Console").fill("Journey Docs")
  await addDialog
    .getByPlaceholder("https://example.com/...")
    .fill("https://docs.example.com/start")
  await addDialog
    .getByPlaceholder("Optional notes...")
    .fill("Created from the popup journey")
  await addDialog.getByRole("button", { name: "Add Bookmark" }).click()

  await expect(page.getByRole("button", { name: "Journey Docs" })).toBeVisible()

  const bookmarkPagePromise = waitForExtensionPage(context, {
    extensionId,
    path: OPTIONS_PAGE_PATH,
    hash: `#${MENU_ITEM_IDS.BOOKMARK}`,
  })
  await page.getByRole("button", { name: "Bookmark Management" }).click()

  const bookmarkPage = await bookmarkPagePromise
  installExtensionPageGuards(bookmarkPage)
  await waitForExtensionRoot(bookmarkPage)
  await expect(
    bookmarkPage.getByRole("button", { name: "Journey Docs" }),
  ).toBeVisible()

  await bookmarkPage.getByText("Journey Docs").hover()
  await bookmarkPage.getByRole("button", { name: "Edit" }).click()

  const editDialog = bookmarkPage.getByRole("dialog")
  await expect(editDialog.getByPlaceholder("e.g. Admin Console")).toBeVisible()
  await editDialog
    .getByPlaceholder("e.g. Admin Console")
    .fill("Journey Docs Updated")
  await editDialog
    .getByPlaceholder("https://example.com/...")
    .fill("https://docs.example.com/updated")
  await editDialog
    .getByPlaceholder("Optional notes...")
    .fill("Edited from bookmark management")
  await editDialog.getByRole("button", { name: "Save" }).click()

  await expect(
    bookmarkPage.getByRole("button", { name: "Journey Docs Updated" }),
  ).toBeVisible()

  await expect
    .poll(async () => {
      const bookmarks = await readStoredBookmarks(serviceWorker)
      return (
        bookmarks.find(
          (bookmark) => bookmark.name === "Journey Docs Updated",
        ) ?? null
      )
    })
    .toMatchObject({
      name: "Journey Docs Updated",
      url: "https://docs.example.com/updated",
      notes: "Edited from bookmark management",
    })

  const popupPage = await context.newPage()
  installExtensionPageGuards(popupPage)
  await forceExtensionLanguage(popupPage, "en")
  await popupPage.goto(`chrome-extension://${extensionId}/${POPUP_PAGE_PATH}`)
  await waitForExtensionRoot(popupPage)

  await popupPage.getByRole("tab", { name: "Bookmarks" }).click()
  await expect(popupPage.getByTestId("bookmarks-list-view")).toBeVisible()
  await expect(
    popupPage.getByRole("button", { name: "Journey Docs Updated" }),
  ).toBeVisible()
  await expect(
    popupPage.getByRole("button", { name: "Journey Docs", exact: true }),
  ).toHaveCount(0)

  await popupPage.getByRole("button", { name: "Journey Docs Updated" }).click()
  await expectBrowserTabOpened(
    serviceWorker,
    "https://docs.example.com/updated",
  )
})

test("opens a saved bookmark from the popup bookmarks tab", async ({
  context,
  extensionId,
  page,
}) => {
  const serviceWorker = await getServiceWorker(context)
  await seedStoredBookmarks(serviceWorker, [
    createStoredBookmark({
      id: "popup-open-bookmark",
      name: "Open Bookmark",
      url: "https://bookmark-open.example.com/docs",
    }),
  ])
  await context.route("https://bookmark-open.example.com/docs", (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "<!doctype html><title>Opened Bookmark</title><h1>Opened Bookmark</h1>",
    }),
  )

  await page.goto(`chrome-extension://${extensionId}/${POPUP_PAGE_PATH}`)
  await waitForExtensionRoot(page)

  await page.getByRole("tab", { name: "Bookmarks" }).click()
  await expect(page.getByTestId("bookmarks-list-view")).toBeVisible()

  await page.getByRole("button", { name: "Open Bookmark" }).click()

  await expectBrowserTabOpened(
    serviceWorker,
    "https://bookmark-open.example.com/docs",
  )
})
