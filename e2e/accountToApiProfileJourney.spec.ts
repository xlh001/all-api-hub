import type { Page, Worker } from "@playwright/test"

import { OPTIONS_PAGE_PATH, POPUP_PAGE_PATH } from "~/constants/extensionPages"
import { MENU_ITEM_IDS } from "~/constants/optionsMenuIds"
import { STORAGE_KEYS } from "~/services/core/storageKeys"
import type { ApiToken, SiteAccount } from "~/types"
import type { ApiCredentialProfile } from "~/types/apiCredentialProfiles"
import { expect, test } from "~~/e2e/fixtures/extensionTest"
import {
  forceExtensionLanguage,
  installExtensionPageGuards,
  seedUserPreferences,
  stubLlmMetadataIndex,
  stubNewApiSiteRoutes,
  waitForExtensionPage,
} from "~~/e2e/utils/commonUserFlows"
import {
  expectPermissionOnboardingHidden,
  getPlasmoStorageRawValue,
  getServiceWorker,
} from "~~/e2e/utils/extensionState"
import { waitForExtensionRoot } from "~~/e2e/utils/lazyLoading"

const JOURNEY_SITE_URL = "https://example.com"

async function readStoredAccounts(
  serviceWorker: Worker,
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
  serviceWorker: Worker,
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

async function getJourneyAccountId(serviceWorker: Worker): Promise<string> {
  const account = (await readStoredAccounts(serviceWorker)).find(
    (storedAccount) =>
      storedAccount.site_url === JOURNEY_SITE_URL &&
      storedAccount.account_info.username === "journey-user",
  )

  expect(account).toBeTruthy()
  return account!.id
}

function createJourneyToken(overrides: Partial<ApiToken> = {}): ApiToken {
  const nowSeconds = Math.floor(Date.now() / 1000)

  return {
    id: 1,
    user_id: 77,
    key: "sk-existing-journey",
    status: 1,
    name: "Existing Journey Key",
    created_time: nowSeconds,
    accessed_time: nowSeconds,
    expired_time: -1,
    remain_quota: -1,
    unlimited_quota: true,
    model_limits_enabled: false,
    model_limits: "",
    allow_ips: "",
    used_quota: 0,
    group: "default",
    ...overrides,
  }
}

function getAccountRowByText(page: Page, text: string) {
  return page
    .getByTestId(/^account-management-account-list-item-/)
    .filter({ hasText: text })
}

async function openAccountActionsMenu(page: Page, accountRowText: string) {
  const row = getAccountRowByText(page, accountRowText)

  await row.hover()
  await row.getByRole("button", { name: "More" }).click()
}

test.beforeEach(async ({ context, page }) => {
  installExtensionPageGuards(page)
  await forceExtensionLanguage(page, "en")
  await stubLlmMetadataIndex(context)
  await stubNewApiSiteRoutes(context, {
    baseUrl: JOURNEY_SITE_URL,
    title: "new-api",
    systemName: "new-api",
    userId: 77,
    username: "journey-user",
    accessToken: "journey-access-token",
    models: ["gpt-journey-mini", "gpt-journey-pro"],
    initialTokens: [
      createJourneyToken({
        id: 42,
        name: "Reusable Journey Key",
        key: "sk-reusable-journey",
      }),
    ],
  })
})

test("adds an account, creates a reusable API profile from its key, and verifies it from the popup", async ({
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

  const sitePage = await context.newPage()
  installExtensionPageGuards(sitePage)
  await forceExtensionLanguage(sitePage, "en")
  await sitePage.addInitScript(() => {
    window.localStorage.setItem(
      "user",
      JSON.stringify({
        id: 77,
        username: "journey-user",
        quota: 1000,
      }),
    )
  })
  await sitePage.goto(JOURNEY_SITE_URL)
  await sitePage.bringToFront()

  await page.goto(
    `chrome-extension://${extensionId}/${OPTIONS_PAGE_PATH}#${MENU_ITEM_IDS.ACCOUNT}`,
  )
  await waitForExtensionRoot(page)
  await expectPermissionOnboardingHidden(page)

  await page.getByRole("button", { name: "Add Account" }).first().click()
  await page.locator("#site-url").fill(JOURNEY_SITE_URL)
  await page.getByRole("button", { name: "Auto Detect" }).click()
  await expect(page.getByRole("button", { name: "Confirm Add" })).toBeVisible()
  await page.getByRole("button", { name: "Confirm Add" }).click()

  await expect(page.getByTestId("account-list-view")).toContainText(
    "journey-user",
  )
  await expect(getAccountRowByText(page, "journey-user")).toBeVisible()

  const accountId = await getJourneyAccountId(serviceWorker)
  const keysPagePromise = waitForExtensionPage(context, {
    extensionId,
    path: OPTIONS_PAGE_PATH,
    hash: `#${MENU_ITEM_IDS.KEYS}`,
    searchParams: { accountId },
  })

  await openAccountActionsMenu(page, "journey-user")
  await page.getByRole("menuitem", { name: "Key Management" }).click()

  const keysPage = await keysPagePromise
  installExtensionPageGuards(keysPage)
  await waitForExtensionRoot(keysPage)
  await expect(keysPage).toHaveURL(new RegExp(`accountId=${accountId}#keys$`))

  await keysPage.getByRole("button", { name: "Add API Key" }).click()
  await expect(keysPage.locator("#tokenName")).toBeVisible()
  await keysPage.locator("#tokenName").fill("Journey Created Key")
  await keysPage.getByRole("button", { name: "Create Key" }).click()
  await expect(
    keysPage.getByRole("heading", { name: "Journey Created Key" }),
  ).toBeVisible()

  await keysPage
    .getByRole("heading", { name: "Journey Created Key" })
    .locator(
      "xpath=ancestor::*[.//button[@aria-label='Save to API profiles']][1]",
    )
    .getByRole("button", { name: "Save to API profiles" })
    .click()

  await expect
    .poll(async () => {
      const profiles = await readStoredApiCredentialProfiles(serviceWorker)
      return (
        profiles.find((profile) => profile.apiKey === "sk-created-43") ?? null
      )
    })
    .toMatchObject({
      name: "Example - Journey Created Key",
      baseUrl: JOURNEY_SITE_URL,
      apiKey: "sk-created-43",
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
    popupPage.getByRole("heading", {
      name: "Example - Journey Created Key",
    }),
  ).toBeVisible()

  await popupPage.getByRole("button", { name: "Verify API" }).click()
  const modelsProbe = popupPage.getByTestId("profile-verify-probe-models")
  await expect(popupPage.getByTestId("profile-verify-model-id")).toBeVisible()

  await modelsProbe.getByRole("button", { name: "Run" }).click()

  await expect(modelsProbe).toContainText("Pass")
  await expect(modelsProbe).toContainText("Fetched 2 models.")

  await sitePage.close()
})
