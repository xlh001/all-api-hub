import { POPUP_PAGE_PATH } from "~/constants/extensionPages"
import { MENU_ITEM_IDS } from "~/constants/optionsMenuIds"
import { expect, test } from "~~/e2e/fixtures/extensionTest"
import {
  forceExtensionLanguage,
  installExtensionPageGuards,
  stubLlmMetadataIndex,
  waitForExtensionPage,
} from "~~/e2e/utils/commonUserFlows"
import { waitForExtensionRoot } from "~~/e2e/utils/lazyLoading"

test.beforeEach(async ({ context, page }) => {
  installExtensionPageGuards(page)
  await forceExtensionLanguage(page, "en")
  await stubLlmMetadataIndex(context)
})

test("opens basic settings from the popup header", async ({
  context,
  extensionId,
  page,
}) => {
  await page.goto(`chrome-extension://${extensionId}/${POPUP_PAGE_PATH}`)
  await waitForExtensionRoot(page)

  const targetPagePromise = waitForExtensionPage(context, {
    extensionId,
    path: "options.html",
    hash: `#${MENU_ITEM_IDS.BASIC}`,
  })

  await page.getByRole("button", { name: "Settings" }).click()

  const targetPage = await targetPagePromise
  installExtensionPageGuards(targetPage)
  await waitForExtensionRoot(targetPage)

  await expect(targetPage).toHaveURL(/options\.html#basic$/)
  await expect(
    targetPage
      .getByTestId("basic-settings-page")
      .getByRole("heading", { name: "Settings", exact: true }),
  ).toBeVisible()
})

test("opens the key-management destination from the popup quick action", async ({
  context,
  extensionId,
  page,
}) => {
  await page.goto(`chrome-extension://${extensionId}/${POPUP_PAGE_PATH}`)
  await waitForExtensionRoot(page)

  const targetPagePromise = waitForExtensionPage(context, {
    extensionId,
    path: "options.html",
    hash: "#keys",
  })

  await page.getByRole("button", { name: "Key Management" }).click()

  const targetPage = await targetPagePromise
  installExtensionPageGuards(targetPage)
  await waitForExtensionRoot(targetPage)

  await expect(targetPage).toHaveURL(/options\.html#keys$/)
})

test("opens the model-management destination from the popup quick action", async ({
  context,
  extensionId,
  page,
}) => {
  await page.goto(`chrome-extension://${extensionId}/${POPUP_PAGE_PATH}`)
  await waitForExtensionRoot(page)

  const targetPagePromise = waitForExtensionPage(context, {
    extensionId,
    path: "options.html",
    hash: "#models",
  })

  await page.getByRole("button", { name: "Model List" }).click()

  const targetPage = await targetPagePromise
  installExtensionPageGuards(targetPage)
  await waitForExtensionRoot(targetPage)

  await expect(targetPage).toHaveURL(/options\.html#models$/)
})

test("preserves run-now routing when opening auto check-in from the popup", async ({
  context,
  extensionId,
  page,
}) => {
  await page.goto(`chrome-extension://${extensionId}/${POPUP_PAGE_PATH}`)
  await waitForExtensionRoot(page)

  const targetPagePromise = waitForExtensionPage(context, {
    extensionId,
    path: "options.html",
    hash: "#autoCheckin",
    searchParams: {
      runNow: "true",
    },
  })

  await page.getByRole("button", { name: "Quick check-in" }).click()

  const targetPage = await targetPagePromise
  installExtensionPageGuards(targetPage)
  await waitForExtensionRoot(targetPage)

  expect(new URL(targetPage.url()).hash).toBe("#autoCheckin")
})
