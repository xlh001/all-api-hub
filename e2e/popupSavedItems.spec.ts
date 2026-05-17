import type { Page } from "@playwright/test"

import { OPTIONS_PAGE_PATH, POPUP_PAGE_PATH } from "~/constants/extensionPages"
import { MENU_ITEM_IDS } from "~/constants/optionsMenuIds"
import { getPopupViewTestId, POPUP_TEST_IDS } from "~/entrypoints/popup/testIds"
import {
  ACCOUNT_MANAGEMENT_TEST_IDS,
  getAccountManagementListItemTestId,
} from "~/features/AccountManagement/testIds"
import { API_CREDENTIAL_PROFILES_TEST_IDS } from "~/features/ApiCredentialProfiles/testIds"
import {
  getSiteBookmarkListItemTestId,
  SITE_BOOKMARKS_TEST_IDS,
} from "~/features/SiteBookmarks/testIds"
import { STORAGE_KEYS } from "~/services/core/storageKeys"
import type { SiteAccount, SiteBookmark } from "~/types"
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
  seedUserPreferences,
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

async function readStoredAccounts(
  serviceWorker: Awaited<ReturnType<typeof getServiceWorker>>,
): Promise<SiteAccount[]> {
  const raw = await getPlasmoStorageRawValue<unknown>(
    serviceWorker,
    STORAGE_KEYS.ACCOUNTS,
  )

  if (typeof raw !== "string") return []

  try {
    const parsed = JSON.parse(raw) as { accounts?: SiteAccount[] }
    return Array.isArray(parsed.accounts) ? parsed.accounts : []
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

function getAccountRowByName(page: Page, name: string) {
  return page
    .getByTestId(new RegExp(`^${getAccountManagementListItemTestId("")}`))
    .filter({ hasText: name })
}

function getBookmarkRow(page: Page, name: string) {
  return page
    .getByTestId(new RegExp(`^${getSiteBookmarkListItemTestId("")}`))
    .filter({ hasText: name })
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

  await page.getByTestId(POPUP_TEST_IDS.bookmarksTab).click()
  await expect(page.getByTestId(getPopupViewTestId("bookmarks"))).toBeVisible()

  const bookmarkPagePromise = waitForExtensionPage(context, {
    extensionId,
    path: "options.html",
    hash: "#bookmark",
  })
  await page.getByTestId(POPUP_TEST_IDS.openBookmarkManagementButton).click()
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
  await apiPopupPage
    .getByTestId(POPUP_TEST_IDS.apiCredentialProfilesTab)
    .click()
  await expect(
    apiPopupPage.getByTestId(API_CREDENTIAL_PROFILES_TEST_IDS.popupView),
  ).toBeVisible()

  const profilesPagePromise = waitForExtensionPage(context, {
    extensionId,
    path: "options.html",
    hash: "#apiCredentialProfiles",
  })
  await apiPopupPage
    .getByTestId(POPUP_TEST_IDS.openApiCredentialProfilesButton)
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

  await expect(page.getByTestId(getPopupViewTestId("accounts"))).toBeVisible()
  await expect(
    page.getByRole("button", { name: "Popup Account" }),
  ).toBeVisible()

  const accountPagePromise = waitForExtensionPage(context, {
    extensionId,
    path: OPTIONS_PAGE_PATH,
    hash: `#${MENU_ITEM_IDS.ACCOUNT}`,
  })
  await page.getByTestId(POPUP_TEST_IDS.openAccountManagementButton).click()

  const accountPage = await accountPagePromise
  installExtensionPageGuards(accountPage)
  await waitForExtensionRoot(accountPage)

  await expect(accountPage).toHaveURL(/options\.html#account$/)
  await expect(
    accountPage.getByRole("button", { name: "Popup Account" }),
  ).toBeVisible()
})

test("updates popup account totals after disabling an account from management", async ({
  context,
  extensionId,
  page,
}) => {
  const serviceWorker = await getServiceWorker(context)
  await seedUserPreferences(serviceWorker, {
    currencyType: "USD",
    showTodayCashflow: false,
  })
  await seedStoredAccounts(serviceWorker, [
    createStoredAccount({
      id: "popup-active-account",
      site_name: "Popup Active Account",
      site_url: "https://popup-active.example.com",
      exchange_rate: 7,
      account_info: {
        id: 701,
        username: "popup-active-user",
        access_token: "popup-active-token",
        quota: 500000,
      },
    }),
    createStoredAccount({
      id: "popup-disable-account",
      site_name: "Popup Disable Account",
      site_url: "https://popup-disable.example.com",
      exchange_rate: 7,
      account_info: {
        id: 702,
        username: "popup-disable-user",
        access_token: "popup-disable-token",
        quota: 1000000,
      },
    }),
  ])

  await page.goto(`chrome-extension://${extensionId}/${POPUP_PAGE_PATH}`)
  await waitForExtensionRoot(page)

  await expect(page.getByTestId(getPopupViewTestId("accounts"))).toBeVisible()
  await expect(
    page.getByRole("button", { name: "Popup Active Account" }),
  ).toBeVisible()
  await expect(
    page.getByRole("button", { name: "Popup Disable Account" }),
  ).toBeVisible()
  await expect(
    page.getByRole("button", { name: "Click to switch to CNY" }),
  ).toContainText("$3.00")

  const accountPagePromise = waitForExtensionPage(context, {
    extensionId,
    path: OPTIONS_PAGE_PATH,
    hash: `#${MENU_ITEM_IDS.ACCOUNT}`,
  })
  await page.getByTestId(POPUP_TEST_IDS.openAccountManagementButton).click()

  const accountPage = await accountPagePromise
  installExtensionPageGuards(accountPage)
  await waitForExtensionRoot(accountPage)
  await expect(
    accountPage.getByRole("button", { name: "Popup Disable Account" }),
  ).toBeVisible()

  const accountRow = getAccountRowByName(accountPage, "Popup Disable Account")
  await accountRow.hover()
  await accountRow
    .getByTestId(ACCOUNT_MANAGEMENT_TEST_IDS.rowMoreActionsButton)
    .click()
  await accountPage
    .getByTestId(ACCOUNT_MANAGEMENT_TEST_IDS.rowDisableToggleMenuItem)
    .click()

  await expect
    .poll(async () => {
      const accounts = await readStoredAccounts(serviceWorker)
      return accounts.find((account) => account.id === "popup-disable-account")
        ?.disabled
    })
    .toBe(true)

  const refreshedPopupPage = await context.newPage()
  installExtensionPageGuards(refreshedPopupPage)
  await forceExtensionLanguage(refreshedPopupPage, "en")
  await refreshedPopupPage.goto(
    `chrome-extension://${extensionId}/${POPUP_PAGE_PATH}`,
  )
  await waitForExtensionRoot(refreshedPopupPage)

  await expect(
    refreshedPopupPage.getByTestId(getPopupViewTestId("accounts")),
  ).toBeVisible()
  await expect(
    refreshedPopupPage.getByRole("button", { name: "Click to switch to CNY" }),
  ).toContainText("$1.00")
  await expect(
    refreshedPopupPage.getByTestId(
      getAccountManagementListItemTestId("popup-disable-account"),
    ),
  ).toHaveAttribute("data-disabled", "true")
  await expect(
    refreshedPopupPage.getByTestId(
      getAccountManagementListItemTestId("popup-disable-account"),
    ),
  ).toContainText("Disabled")
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

  await expect(page.getByTestId(getPopupViewTestId("accounts"))).toBeVisible()
  await getAccountRowByName(page, "Open Account")
    .getByTestId(ACCOUNT_MANAGEMENT_TEST_IDS.rowOpenButton)
    .click()

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

  await page.getByTestId(POPUP_TEST_IDS.bookmarksTab).click()
  await expect(page.getByTestId(SITE_BOOKMARKS_TEST_IDS.listView)).toBeVisible()
  await expect(page.getByText("No bookmarks yet")).toBeVisible()

  await page.getByTestId(POPUP_TEST_IDS.bookmarksPrimaryAction).click()

  const dialog = page.getByTestId(SITE_BOOKMARKS_TEST_IDS.dialog)
  await expect(dialog.getByPlaceholder("e.g. Admin Console")).toBeVisible()
  await dialog.getByPlaceholder("e.g. Admin Console").fill("Popup Docs")
  await dialog
    .getByPlaceholder("https://example.com/...")
    .fill("https://docs.example.com/popup")
  await dialog
    .getByPlaceholder("Optional notes...")
    .fill("Added from the popup")
  await dialog.getByTestId(SITE_BOOKMARKS_TEST_IDS.dialogSaveButton).click()

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

  await page.getByTestId(POPUP_TEST_IDS.bookmarksTab).click()
  await expect(page.getByTestId(SITE_BOOKMARKS_TEST_IDS.listView)).toBeVisible()

  await page.getByTestId(POPUP_TEST_IDS.bookmarksPrimaryAction).click()

  const addDialog = page.getByTestId(SITE_BOOKMARKS_TEST_IDS.dialog)
  await addDialog.getByPlaceholder("e.g. Admin Console").fill("Journey Docs")
  await addDialog
    .getByPlaceholder("https://example.com/...")
    .fill("https://docs.example.com/start")
  await addDialog
    .getByPlaceholder("Optional notes...")
    .fill("Created from the popup journey")
  await addDialog.getByTestId(SITE_BOOKMARKS_TEST_IDS.dialogSaveButton).click()

  await expect(page.getByRole("button", { name: "Journey Docs" })).toBeVisible()

  const bookmarkPagePromise = waitForExtensionPage(context, {
    extensionId,
    path: OPTIONS_PAGE_PATH,
    hash: `#${MENU_ITEM_IDS.BOOKMARK}`,
  })
  await page.getByTestId(POPUP_TEST_IDS.openBookmarkManagementButton).click()

  const bookmarkPage = await bookmarkPagePromise
  installExtensionPageGuards(bookmarkPage)
  await waitForExtensionRoot(bookmarkPage)
  await expect(
    bookmarkPage.getByRole("button", { name: "Journey Docs" }),
  ).toBeVisible()

  const bookmarkRow = getBookmarkRow(bookmarkPage, "Journey Docs")
  await bookmarkRow.hover()
  await bookmarkRow.getByTestId(SITE_BOOKMARKS_TEST_IDS.rowEditButton).click()

  const editDialog = bookmarkPage.getByTestId(SITE_BOOKMARKS_TEST_IDS.dialog)
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
  await editDialog.getByTestId(SITE_BOOKMARKS_TEST_IDS.dialogSaveButton).click()

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

  await popupPage.getByTestId(POPUP_TEST_IDS.bookmarksTab).click()
  await expect(
    popupPage.getByTestId(SITE_BOOKMARKS_TEST_IDS.listView),
  ).toBeVisible()
  await expect(
    popupPage.getByRole("button", { name: "Journey Docs Updated" }),
  ).toBeVisible()
  await expect(
    popupPage.getByRole("button", { name: "Journey Docs", exact: true }),
  ).toHaveCount(0)

  const updatedBookmarkRow = getBookmarkRow(popupPage, "Journey Docs Updated")
  await updatedBookmarkRow.hover()
  await updatedBookmarkRow
    .getByTestId(SITE_BOOKMARKS_TEST_IDS.rowOpenButton)
    .click()
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

  await page.getByTestId(POPUP_TEST_IDS.bookmarksTab).click()
  await expect(page.getByTestId(SITE_BOOKMARKS_TEST_IDS.listView)).toBeVisible()

  const bookmarkRow = getBookmarkRow(page, "Open Bookmark")
  await bookmarkRow.hover()
  await bookmarkRow.getByTestId(SITE_BOOKMARKS_TEST_IDS.rowOpenButton).click()

  await expectBrowserTabOpened(
    serviceWorker,
    "https://bookmark-open.example.com/docs",
  )
})
