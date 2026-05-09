import {
  OPTIONS_PAGE_PATH,
  SIDEPANEL_PAGE_PATH,
} from "~/constants/extensionPages"
import { MENU_ITEM_IDS } from "~/constants/optionsMenuIds"
import {
  createDefaultAccountStorageConfig,
  normalizeAccountStorageConfigForWrite,
} from "~/services/accounts/accountDefaults"
import { STORAGE_KEYS } from "~/services/core/storageKeys"
import { expect, test } from "~~/e2e/fixtures/extensionTest"
import {
  createStoredAccount,
  createStoredApiCredentialProfile,
  createStoredBookmark,
  forceExtensionLanguage,
  installExtensionPageGuards,
  seedApiCredentialProfiles,
  stubLlmMetadataIndex,
  waitForExtensionPage,
} from "~~/e2e/utils/commonUserFlows"
import {
  expectPermissionOnboardingHidden,
  getServiceWorker,
  setPlasmoStorageValue,
} from "~~/e2e/utils/extensionState"
import { waitForExtensionRoot } from "~~/e2e/utils/lazyLoading"

const SIDEPANEL_URL = (extensionId: string) =>
  `chrome-extension://${extensionId}/${SIDEPANEL_PAGE_PATH}`

test.beforeEach(async ({ context, page }) => {
  installExtensionPageGuards(page)
  await forceExtensionLanguage(page, "en")
  await stubLlmMetadataIndex(context)
})

test("sidepanel switches common saved-item tabs and opens the matching management pages", async ({
  context,
  extensionId,
  page,
}) => {
  const serviceWorker = await getServiceWorker(context)
  const now = Date.now()
  await setPlasmoStorageValue(
    serviceWorker,
    STORAGE_KEYS.ACCOUNTS,
    normalizeAccountStorageConfigForWrite(
      {
        ...createDefaultAccountStorageConfig(now),
        accounts: [
          createStoredAccount({
            id: "sidepanel-account-1",
            site_name: "Sidepanel Account",
            site_url: "https://sidepanel-account.example.com",
            account_info: {
              id: 31,
              username: "sidepanel-user",
              access_token: "sidepanel-token",
            },
          }),
        ],
        bookmarks: [
          createStoredBookmark({
            id: "sidepanel-bookmark-1",
            name: "Sidepanel Docs",
            url: "https://sidepanel-docs.example.com",
          }),
        ],
      },
      now,
    ),
  )
  await seedApiCredentialProfiles(serviceWorker, [
    createStoredApiCredentialProfile({
      id: "sidepanel-profile-1",
      name: "Sidepanel Profile",
      baseUrl: "https://sidepanel-api.example.com",
      apiKey: "sk-sidepanel-profile",
    }),
  ])

  await page.goto(SIDEPANEL_URL(extensionId))
  await waitForExtensionRoot(page)
  await expectPermissionOnboardingHidden(page)

  await expect(page.getByText("All API Hub", { exact: true })).toBeVisible()
  await expect(page.getByTestId("popup-view-accounts")).toBeVisible()
  await expect(page.getByText("Sidepanel Account")).toBeVisible()
  await expect(
    page.getByRole("button", { name: "Open Side Panel" }),
  ).toHaveCount(0)

  const accountsPagePromise = waitForExtensionPage(context, {
    extensionId,
    path: OPTIONS_PAGE_PATH,
    hash: `#${MENU_ITEM_IDS.ACCOUNT}`,
  })
  await page.getByRole("button", { name: "Account Management" }).click()
  const accountsPage = await accountsPagePromise
  installExtensionPageGuards(accountsPage)
  await waitForExtensionRoot(accountsPage)
  expect(new URL(accountsPage.url()).hash).toBe(`#${MENU_ITEM_IDS.ACCOUNT}`)
  await accountsPage.close()

  await page.getByRole("tab", { name: "Bookmarks" }).click()
  await expect(page.getByTestId("popup-view-bookmarks")).toBeVisible()
  await expect(
    page.getByRole("button", { name: "Sidepanel Docs" }),
  ).toBeVisible()

  const bookmarksPagePromise = waitForExtensionPage(context, {
    extensionId,
    path: OPTIONS_PAGE_PATH,
    hash: `#${MENU_ITEM_IDS.BOOKMARK}`,
  })
  await page.getByRole("button", { name: "Bookmark Management" }).click()
  const bookmarksPage = await bookmarksPagePromise
  installExtensionPageGuards(bookmarksPage)
  await waitForExtensionRoot(bookmarksPage)
  expect(new URL(bookmarksPage.url()).hash).toBe(`#${MENU_ITEM_IDS.BOOKMARK}`)
  await bookmarksPage.close()

  await page.getByRole("tab", { name: "API Credentials" }).click()
  await expect(
    page.getByTestId("api-credential-profiles-popup-view"),
  ).toBeVisible()
  await expect(page.getByText("Sidepanel Profile")).toBeVisible()

  const profilesPagePromise = waitForExtensionPage(context, {
    extensionId,
    path: OPTIONS_PAGE_PATH,
    hash: `#${MENU_ITEM_IDS.API_CREDENTIAL_PROFILES}`,
  })
  await page.getByRole("button", { name: "API Credential Profiles" }).click()
  const profilesPage = await profilesPagePromise
  installExtensionPageGuards(profilesPage)
  await waitForExtensionRoot(profilesPage)
  expect(new URL(profilesPage.url()).hash).toBe(
    `#${MENU_ITEM_IDS.API_CREDENTIAL_PROFILES}`,
  )
})
