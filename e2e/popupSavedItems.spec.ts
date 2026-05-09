import { POPUP_PAGE_PATH } from "~/constants/extensionPages"
import { STORAGE_KEYS } from "~/services/core/storageKeys"
import type { SiteBookmark } from "~/types"
import { expect, test } from "~~/e2e/fixtures/extensionTest"
import {
  createStoredApiCredentialProfile,
  createStoredBookmark,
  forceExtensionLanguage,
  installExtensionPageGuards,
  seedApiCredentialProfiles,
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
