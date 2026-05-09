import { OPTIONS_PAGE_PATH } from "~/constants/extensionPages"
import { MENU_ITEM_IDS } from "~/constants/optionsMenuIds"
import { expect, test } from "~~/e2e/fixtures/extensionTest"
import {
  forceExtensionLanguage,
  installExtensionPageGuards,
  seedUserPreferences,
  stubLlmMetadataIndex,
} from "~~/e2e/utils/commonUserFlows"
import {
  expectPermissionOnboardingHidden,
  getServiceWorker,
} from "~~/e2e/utils/extensionState"
import { waitForExtensionRoot } from "~~/e2e/utils/lazyLoading"

test.beforeEach(async ({ context, page }) => {
  installExtensionPageGuards(page)
  await forceExtensionLanguage(page, "en")
  await stubLlmMetadataIndex(context)
})

test("opens a common options page from settings search", async ({
  extensionId,
  page,
}) => {
  await page.goto(
    `chrome-extension://${extensionId}/${OPTIONS_PAGE_PATH}#${MENU_ITEM_IDS.BASIC}`,
  )
  await waitForExtensionRoot(page)
  await expectPermissionOnboardingHidden(page)

  await page.getByRole("button", { name: "Open settings search" }).click()

  const dialog = page.getByRole("dialog", { name: "Search settings" })
  await expect(dialog).toBeVisible()
  await dialog.getByPlaceholder("Search settings...").fill("import")
  await dialog
    .getByRole("option", { name: /Import\/Export/ })
    .first()
    .click()

  await expect(dialog).toHaveCount(0)
  await expect(page).toHaveURL(/options\.html#importExport$/)
  await expect(
    page.getByRole("heading", { name: "Import/Export" }),
  ).toBeVisible()
})

test("opens a searched settings control and preserves its tab and anchor in the URL", async ({
  context,
  extensionId,
  page,
}) => {
  const serviceWorker = await getServiceWorker(context)
  await seedUserPreferences(serviceWorker, {
    autoRefresh: true,
  })

  await page.goto(
    `chrome-extension://${extensionId}/${OPTIONS_PAGE_PATH}#${MENU_ITEM_IDS.BASIC}`,
  )
  await waitForExtensionRoot(page)
  await expectPermissionOnboardingHidden(page)

  await page.keyboard.press("Control+K")

  const dialog = page.getByRole("dialog", { name: "Search settings" })
  await expect(dialog).toBeVisible()
  await dialog.getByPlaceholder("Search settings...").fill("refresh interval")
  await dialog
    .getByRole("option", { name: /Refresh Interval/ })
    .first()
    .click()

  await expect(dialog).toHaveCount(0)
  await expect(page).toHaveURL(/options\.html\?.*#basic$/)

  await expect
    .poll(() => {
      const url = new URL(page.url())
      return {
        hash: url.hash,
        tab: url.searchParams.get("tab"),
        anchor: url.searchParams.get("anchor"),
      }
    })
    .toEqual({
      hash: "#basic",
      tab: "refresh",
      anchor: "refresh-interval",
    })

  await expect(
    page.getByRole("button", { name: "Data Refresh" }),
  ).toHaveAttribute("aria-pressed", "true")
  await expect(page.getByText("Refresh Interval").first()).toBeVisible()
})
