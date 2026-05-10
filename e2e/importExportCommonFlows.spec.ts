import fs from "node:fs/promises"

import { OPTIONS_PAGE_PATH, POPUP_PAGE_PATH } from "~/constants/extensionPages"
import { MENU_ITEM_IDS } from "~/constants/optionsMenuIds"
import {
  createDefaultAccountStorageConfig,
  normalizeAccountStorageConfigForWrite,
} from "~/services/accounts/accountDefaults"
import { STORAGE_KEYS } from "~/services/core/storageKeys"
import type { AccountStorageConfig, SiteAccount } from "~/types"
import {
  API_CREDENTIAL_PROFILES_CONFIG_VERSION,
  type ApiCredentialProfilesConfig,
} from "~/types/apiCredentialProfiles"
import { expect, test } from "~~/e2e/fixtures/extensionTest"
import {
  createStoredAccount,
  createStoredApiCredentialProfile,
  forceExtensionLanguage,
  installExtensionPageGuards,
  seedApiCredentialProfiles,
  seedStoredAccounts,
  seedUserPreferences,
  stubLlmMetadataIndex,
} from "~~/e2e/utils/commonUserFlows"
import {
  getPlasmoStorageRawValue,
  getServiceWorker,
} from "~~/e2e/utils/extensionState"
import { waitForExtensionRoot } from "~~/e2e/utils/lazyLoading"

async function readStoredAccountConfig(
  serviceWorker: Awaited<ReturnType<typeof getServiceWorker>>,
): Promise<AccountStorageConfig> {
  const raw = await getPlasmoStorageRawValue<unknown>(
    serviceWorker,
    STORAGE_KEYS.ACCOUNTS,
  )

  if (typeof raw !== "string") {
    return createDefaultAccountStorageConfig()
  }

  try {
    return JSON.parse(raw) as AccountStorageConfig
  } catch {
    return createDefaultAccountStorageConfig()
  }
}

async function readStoredPreferences(
  serviceWorker: Awaited<ReturnType<typeof getServiceWorker>>,
): Promise<Record<string, unknown>> {
  const raw = await getPlasmoStorageRawValue<unknown>(
    serviceWorker,
    STORAGE_KEYS.USER_PREFERENCES,
  )

  if (typeof raw !== "string") {
    return {}
  }

  try {
    return JSON.parse(raw) as Record<string, unknown>
  } catch {
    return {}
  }
}

async function readStoredApiCredentialProfiles(
  serviceWorker: Awaited<ReturnType<typeof getServiceWorker>>,
): Promise<ApiCredentialProfilesConfig> {
  const raw = await getPlasmoStorageRawValue<unknown>(
    serviceWorker,
    STORAGE_KEYS.API_CREDENTIAL_PROFILES,
  )

  if (typeof raw !== "string") {
    return {
      version: API_CREDENTIAL_PROFILES_CONFIG_VERSION,
      profiles: [],
      lastUpdated: 0,
    }
  }

  try {
    return JSON.parse(raw) as ApiCredentialProfilesConfig
  } catch {
    return {
      version: API_CREDENTIAL_PROFILES_CONFIG_VERSION,
      profiles: [],
      lastUpdated: 0,
    }
  }
}

function buildAccountBackup(accounts: SiteAccount[]) {
  const now = Date.parse("2026-03-30T12:00:00.000Z")

  return {
    version: "2.0",
    type: "accounts",
    timestamp: now,
    accounts: normalizeAccountStorageConfigForWrite(
      {
        ...createDefaultAccountStorageConfig(now),
        accounts,
        pinnedAccountIds: accounts.slice(0, 1).map((account) => account.id),
        orderedAccountIds: accounts.map((account) => account.id),
      },
      now,
    ),
  }
}

test.beforeEach(async ({ context, page }) => {
  installExtensionPageGuards(page)
  await forceExtensionLanguage(page, "en")
  await stubLlmMetadataIndex(context)
})

test("exports a full backup containing accounts, user preferences, and API credential profiles", async ({
  context,
  extensionId,
  page,
}) => {
  const serviceWorker = await getServiceWorker(context)
  await seedStoredAccounts(serviceWorker, [
    createStoredAccount({
      id: "export-account-1",
      site_name: "Export Account",
      site_url: "https://export.example.com",
      account_info: {
        id: 101,
        username: "export-user",
        access_token: "export-token",
      },
    }),
  ])
  await seedApiCredentialProfiles(serviceWorker, [
    createStoredApiCredentialProfile({
      id: "export-profile-1",
      name: "Export Profile",
      baseUrl: "https://export-profile.example.com",
      apiKey: "sk-export-profile",
    }),
  ])
  await seedUserPreferences(serviceWorker, {
    currencyType: "CNY",
    actionClickBehavior: "sidepanel",
  })

  await page.goto(
    `chrome-extension://${extensionId}/${OPTIONS_PAGE_PATH}#${MENU_ITEM_IDS.IMPORT_EXPORT}`,
  )
  await waitForExtensionRoot(page)

  const downloadPromise = page.waitForEvent("download")
  await page
    .locator("#export-full-backup")
    .getByRole("button", { name: "Export" })
    .click()

  const download = await downloadPromise
  expect(download.suggestedFilename()).toMatch(
    /^all-api-hub-backup-\d{4}-\d{2}-\d{2}\.json$/,
  )

  const downloadPath = await download.path()
  if (!downloadPath) {
    throw new Error("Exported backup did not produce a readable download")
  }

  const backup = JSON.parse(await fs.readFile(downloadPath, "utf8")) as {
    version?: string
    accounts?: { accounts?: Array<{ id?: string; site_name?: string }> }
    preferences?: {
      currencyType?: string
      actionClickBehavior?: string
    }
    apiCredentialProfiles?: {
      profiles?: Array<{
        id?: string
        name?: string
        baseUrl?: string
        apiKey?: string
      }>
    }
  }

  expect(backup.version).toBe("2.0")
  expect(backup.accounts?.accounts).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: "export-account-1",
        site_name: "Export Account",
      }),
    ]),
  )
  expect(backup.preferences).toMatchObject({
    currencyType: "CNY",
    actionClickBehavior: "sidepanel",
  })
  expect(backup.apiCredentialProfiles?.profiles).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: "export-profile-1",
        name: "Export Profile",
        baseUrl: "https://export-profile.example.com",
        apiKey: "sk-export-profile",
      }),
    ]),
  )
})

test("imports account backup JSON from the preview field and replaces account storage", async ({
  context,
  extensionId,
  page,
}) => {
  const serviceWorker = await getServiceWorker(context)
  await seedStoredAccounts(serviceWorker, [
    createStoredAccount({
      id: "old-account",
      site_name: "Old Account",
      site_url: "https://old.example.com",
      account_info: {
        id: 201,
        username: "old-user",
        access_token: "old-token",
      },
    }),
  ])

  const backup = buildAccountBackup([
    createStoredAccount({
      id: "imported-account",
      site_name: "Imported Account",
      site_url: "https://imported.example.com",
      account_info: {
        id: 301,
        username: "imported-user",
        access_token: "imported-token",
      },
    }),
  ])

  await page.goto(
    `chrome-extension://${extensionId}/${OPTIONS_PAGE_PATH}#${MENU_ITEM_IDS.IMPORT_EXPORT}`,
  )
  await waitForExtensionRoot(page)

  await page.locator("#import-data-preview").fill(JSON.stringify(backup))

  await expect(page.getByText("Data format is correct")).toBeVisible()
  await expect(page.getByText("Contains account data")).toBeVisible()

  await page
    .locator("#import-section")
    .getByRole("button", { name: "Import" })
    .click()

  await expect
    .poll(async () => {
      const config = await readStoredAccountConfig(serviceWorker)
      return {
        accountIds: config.accounts.map((account) => account.id),
        pinnedAccountIds: config.pinnedAccountIds,
        orderedAccountIds: config.orderedAccountIds,
      }
    })
    .toEqual({
      accountIds: ["imported-account"],
      pinnedAccountIds: ["imported-account"],
      orderedAccountIds: ["imported-account"],
    })

  await page.goto(
    `chrome-extension://${extensionId}/${OPTIONS_PAGE_PATH}#${MENU_ITEM_IDS.ACCOUNT}`,
  )
  await waitForExtensionRoot(page)

  await expect(
    page.getByRole("button", { name: "Imported Account" }),
  ).toBeVisible()
  await expect(page.getByRole("button", { name: "Old Account" })).toHaveCount(0)
})

test("imports account backup JSON from a selected file and restores popup accounts", async ({
  context,
  extensionId,
  page,
}) => {
  const serviceWorker = await getServiceWorker(context)
  const backup = buildAccountBackup([
    createStoredAccount({
      id: "file-import-account",
      site_name: "File Import Account",
      site_url: "https://file-import.example.com",
      account_info: {
        id: 401,
        username: "file-import-user",
        access_token: "file-import-token",
      },
    }),
  ])

  await page.goto(
    `chrome-extension://${extensionId}/${OPTIONS_PAGE_PATH}#${MENU_ITEM_IDS.IMPORT_EXPORT}`,
  )
  await waitForExtensionRoot(page)

  await page.locator("#import-backup-file").setInputFiles({
    name: "all-api-hub-file-import-backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(backup), "utf8"),
  })

  await expect(page.locator("#import-data-preview")).toHaveValue(
    JSON.stringify(backup),
  )
  await expect(page.getByText("Data format is correct")).toBeVisible()
  await expect(page.getByText("Contains account data")).toBeVisible()

  await page
    .locator("#import-section")
    .getByRole("button", { name: "Import" })
    .click()

  await expect
    .poll(async () => {
      const config = await readStoredAccountConfig(serviceWorker)
      return config.accounts.map((account) => account.id)
    })
    .toEqual(["file-import-account"])

  await page.goto(`chrome-extension://${extensionId}/popup.html`)
  await waitForExtensionRoot(page)

  await expect(page.getByTestId("popup-view-accounts")).toBeVisible()
  await expect(
    page.getByRole("button", { name: "File Import Account" }),
  ).toBeVisible()
  await expect(page.getByText("file-import-user")).toBeVisible()
})

test("imports API credential profiles from backup JSON and restores the popup tab", async ({
  context,
  extensionId,
  page,
}) => {
  const serviceWorker = await getServiceWorker(context)
  const now = Date.parse("2026-03-30T13:00:00.000Z")
  const importedProfile = createStoredApiCredentialProfile({
    id: "imported-profile",
    name: "Imported Profile",
    baseUrl: "https://imported-profile.example.com",
    apiKey: "sk-imported-profile",
    createdAt: now,
    updatedAt: now,
  })
  const backup = {
    version: "2.0",
    timestamp: now,
    apiCredentialProfiles: {
      version: API_CREDENTIAL_PROFILES_CONFIG_VERSION,
      profiles: [importedProfile],
      lastUpdated: now,
    },
  }

  await page.goto(
    `chrome-extension://${extensionId}/${OPTIONS_PAGE_PATH}#${MENU_ITEM_IDS.IMPORT_EXPORT}`,
  )
  await waitForExtensionRoot(page)

  await page.locator("#import-data-preview").fill(JSON.stringify(backup))

  await expect(page.getByText("Data format is correct")).toBeVisible()
  await expect(page.getByText("Contains API credential profiles")).toBeVisible()

  await page
    .locator("#import-section")
    .getByRole("button", { name: "Import" })
    .click()

  await expect
    .poll(async () => {
      const config = await readStoredApiCredentialProfiles(serviceWorker)
      return config.profiles.map((profile) => ({
        id: profile.id,
        name: profile.name,
        baseUrl: profile.baseUrl,
      }))
    })
    .toEqual([
      {
        id: "imported-profile",
        name: "Imported Profile",
        baseUrl: "https://imported-profile.example.com",
      },
    ])

  await page.goto(`chrome-extension://${extensionId}/${POPUP_PAGE_PATH}`)
  await waitForExtensionRoot(page)

  await page.getByRole("tab", { name: "API Credentials" }).click()
  await expect(
    page.getByTestId("api-credential-profiles-popup-view"),
  ).toBeVisible()
  await expect(
    page.getByRole("heading", { name: "Imported Profile" }),
  ).toBeVisible()
})

test("imports preference backup JSON and applies settings after reload", async ({
  context,
  extensionId,
  page,
}) => {
  const serviceWorker = await getServiceWorker(context)
  await seedUserPreferences(serviceWorker, {
    currencyType: "USD",
    actionClickBehavior: "popup",
    themeMode: "system",
  })

  const backup = {
    version: "2.0",
    type: "preferences",
    timestamp: Date.parse("2026-03-30T12:30:00.000Z"),
    preferences: {
      ...(await readStoredPreferences(serviceWorker)),
      currencyType: "CNY",
      actionClickBehavior: "sidepanel",
      themeMode: "dark",
    },
  }

  await page.goto(
    `chrome-extension://${extensionId}/${OPTIONS_PAGE_PATH}#${MENU_ITEM_IDS.IMPORT_EXPORT}`,
  )
  await waitForExtensionRoot(page)

  await page.locator("#import-data-preview").fill(JSON.stringify(backup))

  await expect(page.getByText("Data format is correct")).toBeVisible()
  await expect(page.getByText("Contains user settings")).toBeVisible()

  await page
    .locator("#import-section")
    .getByRole("button", { name: "Import" })
    .click()

  await expect
    .poll(() => readStoredPreferences(serviceWorker))
    .toMatchObject({
      currencyType: "CNY",
      actionClickBehavior: "sidepanel",
      themeMode: "dark",
    })

  await page.goto(
    `chrome-extension://${extensionId}/${OPTIONS_PAGE_PATH}#${MENU_ITEM_IDS.BASIC}`,
  )
  await waitForExtensionRoot(page)

  await expect(page.getByRole("button", { name: "CNY (¥)" })).toHaveAttribute(
    "aria-pressed",
    "true",
  )
  await expect(
    page.getByRole("button", { name: /Switch to Dark theme/i }),
  ).toHaveAttribute("aria-pressed", "true")
  await expect(
    page.getByRole("button", { name: "Open side panel" }),
  ).toHaveAttribute("aria-pressed", "true")
})
