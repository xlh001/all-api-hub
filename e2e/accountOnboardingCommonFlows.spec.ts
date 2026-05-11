import { OPTIONS_PAGE_PATH, POPUP_PAGE_PATH } from "~/constants/extensionPages"
import { MENU_ITEM_IDS } from "~/constants/optionsMenuIds"
import { STORAGE_KEYS } from "~/services/core/storageKeys"
import type { SiteAccount } from "~/types"
import type { ApiCredentialProfile } from "~/types/apiCredentialProfiles"
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
  getPlasmoStorageRawValue,
  getServiceWorker,
} from "~~/e2e/utils/extensionState"
import { waitForExtensionRoot } from "~~/e2e/utils/lazyLoading"

const DEFAULT_AUTO_PROVISION_TOKEN_NAME = "user group (auto)"

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

async function readStoredApiCredentialProfiles(
  serviceWorker: Awaited<ReturnType<typeof getServiceWorker>>,
): Promise<ApiCredentialProfile[]> {
  const raw = await getPlasmoStorageRawValue<unknown>(
    serviceWorker,
    STORAGE_KEYS.API_CREDENTIAL_PROFILES,
  )

  if (typeof raw !== "string") return []

  try {
    const parsed = JSON.parse(raw) as { profiles?: ApiCredentialProfile[] }
    return Array.isArray(parsed.profiles) ? parsed.profiles : []
  } catch {
    return []
  }
}

async function findStoredAccountIdByUsername(
  serviceWorker: Awaited<ReturnType<typeof getServiceWorker>>,
  username: string,
): Promise<string | null> {
  const account = (await readStoredAccounts(serviceWorker)).find(
    (storedAccount) =>
      storedAccount.site_url === "https://example.com" &&
      storedAccount.account_info.username === username,
  )

  return account?.id ?? null
}

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

test("enables default-key provisioning, adds an account, saves the created key as a reusable API profile, and verifies it from the popup", async ({
  context,
  extensionId,
  page,
}) => {
  const serviceWorker = await getServiceWorker(context)
  await seedUserPreferences(serviceWorker, {
    tempWindowFallback: {
      enabled: false,
    },
  })

  await page.goto(
    `chrome-extension://${extensionId}/${OPTIONS_PAGE_PATH}?tab=accountManagement#${MENU_ITEM_IDS.BASIC}`,
  )
  await waitForExtensionRoot(page)
  await expectPermissionOnboardingHidden(page)

  const autoProvisionSwitch = page
    .locator("#auto-provision-key-on-account-add")
    .getByRole("switch")
  await expect(autoProvisionSwitch).toHaveAttribute("aria-checked", "false")
  await autoProvisionSwitch.click()
  await expect(autoProvisionSwitch).toHaveAttribute("aria-checked", "true")

  const sitePage = await context.newPage()
  installExtensionPageGuards(sitePage)
  await forceExtensionLanguage(sitePage, "en")
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

  await page.goto(
    `chrome-extension://${extensionId}/${OPTIONS_PAGE_PATH}#${MENU_ITEM_IDS.ACCOUNT}`,
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
  await expect(page.getByText("Created a default API key for")).toBeVisible()

  await expect
    .poll(() => findStoredAccountIdByUsername(serviceWorker, "e2e-user"))
    .not.toBeNull()
  const accountId = await findStoredAccountIdByUsername(
    serviceWorker,
    "e2e-user",
  )
  expect(accountId).toBeTruthy()

  await page.goto(
    `chrome-extension://${extensionId}/${OPTIONS_PAGE_PATH}#${MENU_ITEM_IDS.KEYS}?accountId=${accountId}`,
  )
  await waitForExtensionRoot(page)
  await expectPermissionOnboardingHidden(page)

  await expect(
    page.getByRole("heading", { name: DEFAULT_AUTO_PROVISION_TOKEN_NAME }),
  ).toBeVisible()
  await expect(page.getByText("Group:")).toBeVisible()
  await expect(page.getByText("default", { exact: true })).toBeVisible()

  await page
    .getByRole("heading", { name: DEFAULT_AUTO_PROVISION_TOKEN_NAME })
    .locator(
      "xpath=ancestor::*[.//button[@aria-label='Save to API profiles']][1]",
    )
    .getByRole("button", { name: "Save to API profiles" })
    .click()

  let savedProfileName = ""
  await expect
    .poll(async () => {
      const profiles = await readStoredApiCredentialProfiles(serviceWorker)
      const profile =
        profiles.find((candidate) => candidate.apiKey === "sk-created-1") ??
        null

      savedProfileName = profile?.name ?? ""
      return profile
    })
    .toMatchObject({
      baseUrl: "https://example.com",
      apiKey: "sk-created-1",
    })

  const popupPage = await context.newPage()
  installExtensionPageGuards(popupPage)
  await forceExtensionLanguage(popupPage, "en")
  await popupPage.goto(`chrome-extension://${extensionId}/${POPUP_PAGE_PATH}`)
  await waitForExtensionRoot(popupPage)

  await popupPage.getByRole("tab", { name: "API Credentials" }).click()
  await expect(
    popupPage.getByTestId("api-credential-profiles-popup-view"),
  ).toBeVisible()
  await expect(
    popupPage.getByRole("heading", { name: savedProfileName }),
  ).toBeVisible()

  await popupPage.getByRole("button", { name: "Verify API" }).click()
  const modelsProbe = popupPage.getByTestId("profile-verify-probe-models")
  await expect(popupPage.getByTestId("profile-verify-model-id")).toBeVisible()

  await modelsProbe.getByRole("button", { name: "Run" }).click()

  await expect(modelsProbe).toContainText("Pass")
  await expect(modelsProbe).toContainText("Fetched 2 models.")

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
