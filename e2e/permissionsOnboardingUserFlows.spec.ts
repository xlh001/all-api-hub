import { OPTIONS_PAGE_PATH } from "~/constants/extensionPages"
import { MENU_ITEM_IDS } from "~/constants/optionsMenuIds"
import { expect, test } from "~~/e2e/fixtures/extensionTest"
import {
  forceExtensionLanguage,
  installExtensionPageGuards,
  stubLlmMetadataIndex,
} from "~~/e2e/utils/commonUserFlows"
import {
  expectPermissionOnboardingHidden,
  getPlasmoStorageRawValue,
  getServiceWorker,
} from "~~/e2e/utils/extensionState"
import { waitForExtensionRoot } from "~~/e2e/utils/lazyLoading"

const OPTIONAL_PERMISSIONS_STORAGE_KEY = "optional_permissions_state"

test.beforeEach(async ({ context, page }) => {
  installExtensionPageGuards(page)
  await forceExtensionLanguage(page, "en")
  await stubLlmMetadataIndex(context)
})

test("lets first-use users defer recommended permissions and continue into settings", async ({
  context,
  extensionId,
  page,
}) => {
  const serviceWorker = await getServiceWorker(context)

  await page.goto(
    `chrome-extension://${extensionId}/${OPTIONS_PAGE_PATH}?tab=permissions&onboarding=permissions#${MENU_ITEM_IDS.BASIC}`,
  )
  await waitForExtensionRoot(page)

  const dialog = page.getByTestId("permission-onboarding-dialog")
  await expect(dialog).toBeVisible()
  await expect(
    page.getByRole("heading", { name: "Welcome to All API Hub" }),
  ).toBeVisible()
  await expect(dialog.getByText("What these permissions do")).toBeVisible()
  await expect(
    page.getByRole("button", { name: "Allow recommended permissions" }),
  ).toBeVisible()

  await page.getByRole("button", { name: "Maybe later" }).click()

  await expectPermissionOnboardingHidden(page)
  await expect(page).toHaveURL(/options\.html\?tab=permissions#basic$/)
  await expect(page.getByRole("heading", { name: "Permissions" })).toBeVisible()

  await expect
    .poll(async () => {
      const raw = await getPlasmoStorageRawValue<unknown>(
        serviceWorker,
        OPTIONAL_PERMISSIONS_STORAGE_KEY,
      )

      if (typeof raw !== "string") return []

      try {
        const parsed = JSON.parse(raw) as { lastSeen?: string[] }
        return parsed.lastSeen ?? []
      } catch {
        return []
      }
    })
    .toEqual([
      "clipboardRead",
      "cookies",
      "declarativeNetRequestWithHostAccess",
      "notifications",
    ])
})
