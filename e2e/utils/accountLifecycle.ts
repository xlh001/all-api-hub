import type { Locator, Page } from "@playwright/test"

import { OPTIONS_PAGE_PATH } from "~/constants/extensionPages"
import { MENU_ITEM_IDS } from "~/constants/optionsMenuIds"
import { ACCOUNT_MANAGEMENT_TEST_IDS } from "~/features/AccountManagement/testIds"
import {
  getKeyManagementTokenRowTestId,
  KEY_MANAGEMENT_TEST_IDS,
} from "~/features/KeyManagement/testIds"
import { expect } from "~~/e2e/fixtures/extensionTest"
import { waitForExtensionPage } from "~~/e2e/utils/commonUserFlows"
import {
  expectPermissionOnboardingHidden,
  getServiceWorker,
} from "~~/e2e/utils/extensionState"
import { waitForExtensionRoot } from "~~/e2e/utils/lazyLoading"
import {
  autoDetectAccountFromAddDialog,
  expectAccountListItemVisible,
  expectAccountListItemVisibleBySite,
  openAccountManagementPage,
  waitForSavedAccount,
  type AccountAddDialog,
} from "~~/e2e/utils/realSite/accountAdd"

type ServiceWorker = Awaited<ReturnType<typeof getServiceWorker>>

type AccountTokenIdentity = {
  id: string | number
  name: string
}

type SavedAccountUiResult = {
  siteType: string
  baseUrl: string
}

export async function saveAutoDetectedAccountFromApp(params: {
  page: Page
  extensionId: string
  serviceWorker?: ServiceWorker
  baseUrl: string
  siteType: string
  expectedSiteType?: string
  prepareDetectedDialog?: (dialog: AccountAddDialog) => Promise<void>
}): Promise<SavedAccountUiResult> {
  await openAccountManagementPage({
    page: params.page,
    extensionId: params.extensionId,
  })

  const dialog = await autoDetectAccountFromAddDialog(
    params.page,
    params.baseUrl,
  )

  if (params.expectedSiteType) {
    await expect(dialog.siteTypeTrigger).toHaveAttribute(
      "data-site-type",
      params.expectedSiteType,
      { timeout: 60_000 },
    )
  }

  await params.prepareDetectedDialog?.(dialog)

  await expect(dialog.confirmAddButton).toBeEnabled({ timeout: 60_000 })
  await dialog.confirmAddButton.click()
  await expect(dialog.dialog).toBeHidden({ timeout: 60_000 })

  await expectAccountListItemVisibleBySite(params.page, {
    siteType: params.siteType,
    baseUrl: params.baseUrl,
  })

  if (!params.serviceWorker) {
    return {
      siteType: params.siteType,
      baseUrl: params.baseUrl,
    }
  }

  const savedAccount = await waitForSavedAccount({
    serviceWorker: params.serviceWorker,
    siteType: params.siteType,
    baseUrl: params.baseUrl,
  })

  expect(savedAccount.site_type).toBe(params.siteType)
  expect(savedAccount.site_url).toBe(params.baseUrl)
  expect(String(savedAccount.account_info.id)).not.toBe("")
  expect(savedAccount.account_info.username.trim()).not.toBe("")

  await expectAccountListItemVisible(params.page, savedAccount.id)

  return {
    siteType: savedAccount.site_type,
    baseUrl: savedAccount.site_url,
  }
}

export async function openKeyManagementPage(params: {
  page: Page
  extensionId: string
  accountId: string
}): Promise<Page> {
  const url = new URL(
    `chrome-extension://${params.extensionId}/${OPTIONS_PAGE_PATH}`,
  )
  url.searchParams.set("accountId", params.accountId)
  url.hash = MENU_ITEM_IDS.KEYS

  await params.page.goto(url.toString())
  await waitForExtensionRoot(params.page)
  await expectPermissionOnboardingHidden(params.page)
  return params.page
}

export async function openKeyManagementPageFromAccountRow(params: {
  page: Page
  extensionId: string
  accountId?: string
  siteType?: string
  baseUrl?: string
}): Promise<Page> {
  const row =
    params.accountId !== undefined
      ? await expectAccountListItemVisible(params.page, params.accountId)
      : await expectAccountListItemVisibleBySite(params.page, {
          siteType: params.siteType ?? "",
          baseUrl: params.baseUrl ?? "",
        })

  await row.hover()
  const keyManagementPagePromise = waitForExtensionPage(params.page.context(), {
    extensionId: params.extensionId,
    path: OPTIONS_PAGE_PATH,
    hash: `#${MENU_ITEM_IDS.KEYS}`,
  })
  await row
    .getByTestId(ACCOUNT_MANAGEMENT_TEST_IDS.rowMoreActionsButton)
    .click()
  await params.page
    .getByTestId(ACCOUNT_MANAGEMENT_TEST_IDS.rowKeyManagementMenuItem)
    .click()

  const keyManagementPage = await keyManagementPagePromise
  await keyManagementPage.waitForLoadState("domcontentloaded")
  await waitForExtensionRoot(keyManagementPage)
  await expectPermissionOnboardingHidden(keyManagementPage)
  return keyManagementPage
}

export async function createTokenFromKeyManagementPage(params: {
  page: Page
  tokenName: string
}) {
  await submitCreateTokenForm(params)
  await closeOneTimeKeyDialogIfPresent(params.page)

  await expect(
    params.page.getByRole("heading", { name: params.tokenName }),
  ).toBeVisible({ timeout: 60_000 })
}

async function submitCreateTokenForm(params: {
  page: Page
  tokenName: string
}) {
  await params.page.getByRole("button", { name: "Add API Key" }).click()
  await expect(params.page.locator("#tokenName")).toBeVisible({
    timeout: 30_000,
  })
  await params.page.locator("#tokenName").fill(params.tokenName)
  await params.page
    .getByTestId(KEY_MANAGEMENT_TEST_IDS.addTokenSubmitButton)
    .click()
}

async function closeOneTimeKeyDialogIfPresent(page: Page) {
  await page
    .getByTestId(KEY_MANAGEMENT_TEST_IDS.oneTimeKeyCloseButton)
    .click({ timeout: 5_000 })
    .catch(() => undefined)
}

async function closeAddTokenDialogIfPresent(page: Page) {
  const dialog = page.getByTestId(KEY_MANAGEMENT_TEST_IDS.addTokenDialog)

  if (!(await dialog.isVisible().catch(() => false))) {
    return
  }

  await dialog.getByRole("button", { name: "Cancel" }).click()
  await expect(dialog).toBeHidden({ timeout: 30_000 })
}

async function closeTokenCreationDialogsIfPresent(page: Page) {
  await closeOneTimeKeyDialogIfPresent(page)
  await closeAddTokenDialogIfPresent(page)
}

async function expectTokenVisibleInKeyManagementPage(params: {
  page: Page
  tokenName: string
}): Promise<Locator> {
  const heading = params.page.getByRole("heading", { name: params.tokenName })
  await expect(heading).toBeVisible({ timeout: 60_000 })
  return heading.locator("xpath=ancestor::*[@data-testid][1]")
}

export async function deleteTokenFromKeyManagementPage(params: {
  page: Page
  token: AccountTokenIdentity | string
}) {
  await closeTokenCreationDialogsIfPresent(params.page)

  const row =
    typeof params.token === "string"
      ? await expectTokenVisibleInKeyManagementPage({
          page: params.page,
          tokenName: params.token,
        })
      : params.page.getByTestId(getKeyManagementTokenRowTestId(params.token.id))
  await expect(row).toBeVisible({ timeout: 60_000 })

  params.page.once("dialog", (dialog) => {
    void dialog.accept()
  })
  await row.getByRole("button", { name: "Delete Key" }).click()
  await expect(row).toHaveCount(0, { timeout: 60_000 })
}

export async function createAndVerifyTokenFromApp(params: {
  page: Page
  extensionId: string
  accountId?: string
  siteType?: string
  baseUrl?: string
  tokenName: string
  openFromAccountRow?: boolean
}) {
  let keyManagementPage = params.page

  if (params.openFromAccountRow) {
    keyManagementPage = await openKeyManagementPageFromAccountRow({
      page: params.page,
      extensionId: params.extensionId,
      accountId: params.accountId,
      siteType: params.siteType,
      baseUrl: params.baseUrl,
    })
  } else {
    if (!params.accountId) {
      throw new Error(
        "accountId is required when opening Key Management by URL.",
      )
    }

    keyManagementPage = await openKeyManagementPage({
      page: params.page,
      extensionId: params.extensionId,
      accountId: params.accountId,
    })
  }
  await submitCreateTokenForm({
    page: keyManagementPage,
    tokenName: params.tokenName,
  })

  await closeTokenCreationDialogsIfPresent(keyManagementPage)
  const row = await expectTokenVisibleInKeyManagementPage({
    page: keyManagementPage,
    tokenName: params.tokenName,
  })

  return {
    page: keyManagementPage,
    row,
  }
}
