import { OPTIONS_PAGE_PATH } from "~/constants/extensionPages"
import { STORAGE_KEYS } from "~/services/core/storageKeys"
import type { SiteBookmark } from "~/types"
import { expect, test } from "~~/e2e/fixtures/extensionTest"
import {
  createStoredBookmark,
  forceExtensionLanguage,
  installExtensionPageGuards,
  seedStoredBookmarks,
  stubLlmMetadataIndex,
} from "~~/e2e/utils/commonUserFlows"
import {
  getPlasmoStorageRawValue,
  getServiceWorker,
} from "~~/e2e/utils/extensionState"
import { waitForExtensionRoot } from "~~/e2e/utils/lazyLoading"

/**
 *
 */
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

test("adds a bookmark from bookmark management and persists it", async ({
  context,
  extensionId,
  page,
}) => {
  const serviceWorker = await getServiceWorker(context)

  await page.goto(
    `chrome-extension://${extensionId}/${OPTIONS_PAGE_PATH}#bookmark`,
  )
  await waitForExtensionRoot(page)

  await page.getByRole("button", { name: "Add Bookmark" }).click()

  const dialog = page.getByRole("dialog")
  await expect(dialog.getByPlaceholder("e.g. Admin Console")).toBeVisible()
  await dialog.getByPlaceholder("e.g. Admin Console").fill("Docs Portal")
  await dialog
    .getByPlaceholder("https://example.com/...")
    .fill("https://example.com/portal")
  await dialog
    .getByPlaceholder("Optional notes...")
    .fill("Primary documentation entrypoint")
  await dialog.getByRole("button", { name: "Add Bookmark" }).click()

  await expect(page.getByText("Docs Portal")).toBeVisible()

  await expect
    .poll(async () => {
      const bookmarks = await readStoredBookmarks(serviceWorker)
      return (
        bookmarks.find((bookmark) => bookmark.name === "Docs Portal") ?? null
      )
    })
    .toMatchObject({
      name: "Docs Portal",
      url: "https://example.com/portal",
      notes: "Primary documentation entrypoint",
    })
})

test("edits a stored bookmark from bookmark management and persists the change", async ({
  context,
  extensionId,
  page,
}) => {
  const serviceWorker = await getServiceWorker(context)
  await seedStoredBookmarks(serviceWorker, [
    createStoredBookmark({
      id: "stored-bookmark-1",
      name: "Original Bookmark",
      url: "https://example.com/original",
      notes: "Original note",
    }),
  ])

  await page.goto(
    `chrome-extension://${extensionId}/${OPTIONS_PAGE_PATH}#bookmark`,
  )
  await waitForExtensionRoot(page)

  await page.getByText("Original Bookmark").hover()
  await page.getByRole("button", { name: "Edit" }).click()

  const dialog = page.getByRole("dialog")
  await expect(dialog.getByPlaceholder("e.g. Admin Console")).toBeVisible()

  await dialog.getByPlaceholder("e.g. Admin Console").fill("Updated Bookmark")
  await dialog
    .getByPlaceholder("https://example.com/...")
    .fill("https://example.com/updated")
  await dialog.getByPlaceholder("Optional notes...").fill("Updated note")
  await dialog.getByRole("button", { name: "Save" }).click()

  await expect(page.getByText("Updated Bookmark")).toBeVisible()
  await expect(page.getByText("https://example.com/updated")).toBeVisible()

  await expect
    .poll(async () => {
      const bookmarks = await readStoredBookmarks(serviceWorker)
      return (
        bookmarks.find((bookmark) => bookmark.id === "stored-bookmark-1") ??
        null
      )
    })
    .toMatchObject({
      id: "stored-bookmark-1",
      name: "Updated Bookmark",
      url: "https://example.com/updated",
      notes: "Updated note",
    })
})

test("deletes a stored bookmark from bookmark management and removes it from storage", async ({
  context,
  extensionId,
  page,
}) => {
  const serviceWorker = await getServiceWorker(context)
  await seedStoredBookmarks(serviceWorker, [
    createStoredBookmark({
      id: "stored-bookmark-1",
      name: "Delete Bookmark",
      url: "https://example.com/delete",
    }),
  ])

  await page.goto(
    `chrome-extension://${extensionId}/${OPTIONS_PAGE_PATH}#bookmark`,
  )
  await waitForExtensionRoot(page)

  await expect(page.getByText("Delete Bookmark")).toBeVisible()

  await page.getByText("Delete Bookmark").hover()
  await page.getByRole("button", { name: "More" }).click()
  await page.getByText("Delete", { exact: true }).click()

  const dialog = page.getByRole("dialog")
  await expect(dialog.getByText("Delete bookmark?")).toBeVisible()
  await dialog.getByRole("button", { name: "Delete" }).click()

  await expect(page.getByText("Delete Bookmark")).toHaveCount(0)

  await expect
    .poll(async () => {
      const bookmarks = await readStoredBookmarks(serviceWorker)
      return bookmarks.some((bookmark) => bookmark.id === "stored-bookmark-1")
    })
    .toBe(false)
})
