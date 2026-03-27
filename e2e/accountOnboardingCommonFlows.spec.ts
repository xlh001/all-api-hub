import { OPTIONS_PAGE_PATH } from "~/constants/extensionPages"
import { expect, test } from "~~/e2e/fixtures/extensionTest"
import {
  createStoredAccount,
  forceExtensionLanguage,
  installExtensionPageGuards,
  seedStoredAccounts,
  seedUserPreferences,
  stubLlmMetadataIndex,
  stubNewApiSiteRoutes,
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
  await stubNewApiSiteRoutes(context, {
    systemName: "E2E New API",
  })
})

test("adds an account through the real add-account auto-detect flow", async ({
  context,
  extensionId,
  page,
}) => {
  const sitePage = await context.newPage()
  await sitePage.addInitScript(() => {
    window.localStorage.setItem(
      "user",
      JSON.stringify({
        id: 1,
        username: "e2e-user",
        quota: 1000,
      }),
    )
  })
  await sitePage.goto("https://example.com")
  await sitePage.bringToFront()

  const serviceWorker = await getServiceWorker(context)
  await seedUserPreferences(serviceWorker, {
    tempWindowFallback: {
      enabled: false,
    },
  })

  await page.goto(
    `chrome-extension://${extensionId}/${OPTIONS_PAGE_PATH}#account`,
  )
  await waitForExtensionRoot(page)
  await expectPermissionOnboardingHidden(page)

  await page.getByRole("button", { name: "Add Account" }).first().click()

  await expect(page.locator("#site-url")).toBeVisible()
  await page.locator("#site-url").fill("https://example.com")
  await page.getByRole("button", { name: "Auto Detect" }).click()

  await expect(page.getByRole("button", { name: "Confirm Add" })).toBeVisible()
  await page.getByRole("button", { name: "Confirm Add" }).click()

  await expect(page.getByTestId("account-list-view")).toContainText("e2e-user")

  const persistedAccounts = await serviceWorker.evaluate(async () => {
    const chromeApi = (globalThis as any).chrome

    return await new Promise<string>((resolve, reject) => {
      chromeApi.storage.local.get(
        "site_accounts",
        (stored: Record<string, string>) => {
          const error = chromeApi.runtime?.lastError
          if (error) {
            reject(new Error(error.message))
            return
          }
          resolve(stored.site_accounts)
        },
      )
    })
  })

  expect(persistedAccounts).toContain('"username":"e2e-user"')
  await sitePage.close()
})

test("requires duplicate-warning confirmation before the manual add flow continues", async ({
  context,
  extensionId,
  page,
}) => {
  const serviceWorker = await getServiceWorker(context)
  await seedStoredAccounts(serviceWorker, [
    createStoredAccount({
      id: "existing-account",
      site_name: "Existing Example",
      site_url: "https://example.com",
      account_info: {
        id: 99,
        username: "existing-user",
        access_token: "existing-token",
      },
    }),
  ])
  await seedUserPreferences(serviceWorker, {
    warnOnDuplicateAccountAdd: true,
  })

  await page.goto(
    `chrome-extension://${extensionId}/${OPTIONS_PAGE_PATH}#account`,
  )
  await waitForExtensionRoot(page)
  await expectPermissionOnboardingHidden(page)

  await page.getByRole("button", { name: "Add Account" }).first().click()

  await expect(page.locator("#site-url")).toBeVisible()
  await page.locator("#site-url").fill("https://example.com")
  await page.getByRole("button", { name: "Manual Add" }).click()

  await expect(page.getByText("Duplicate account")).toBeVisible()
  await page.getByRole("button", { name: "Continue" }).click()

  await expect(page.getByLabel("Site Type")).toBeVisible()
})
