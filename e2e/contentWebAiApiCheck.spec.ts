import { OPTIONS_PAGE_PATH, POPUP_PAGE_PATH } from "~/constants/extensionPages"
import { MENU_ITEM_IDS } from "~/constants/optionsMenuIds"
import { STORAGE_KEYS } from "~/services/core/storageKeys"
import { expect, test } from "~~/e2e/fixtures/extensionTest"
import {
  forceExtensionLanguage,
  installExtensionPageGuards,
  seedUserPreferences,
  waitForExtensionPage,
} from "~~/e2e/utils/commonUserFlows"
import {
  getPlasmoStorageRawValue,
  getServiceWorker,
} from "~~/e2e/utils/extensionState"
import { waitForExtensionRoot } from "~~/e2e/utils/lazyLoading"

const TEST_PAGE_URL = "https://api-console.example.test/console"
const API_BASE_URL = "https://api-console.example.test/api"
const API_KEY = "sk-e2e-content-api-check-key"

test.beforeEach(async ({ context, page }) => {
  installExtensionPageGuards(page)
  await forceExtensionLanguage(page, "en")

  await context.route(`${TEST_PAGE_URL}`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/html",
      body: `<!doctype html>
        <html lang="en">
          <head>
            <title>API Console Fixture</title>
          </head>
          <body>
            <button id="copy-credentials">
              base_url=${API_BASE_URL}
              api_key=${API_KEY}
            </button>
          </body>
        </html>`,
    })
  })

  await context.route(`${API_BASE_URL}/v1/models`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        message: "ok",
        data: [{ id: "gpt-4o-mini" }],
      }),
    })
  })
})

test("turns selected web API credentials into a verified profile and model catalog source", async ({
  context,
  extensionId,
  page,
}) => {
  const serviceWorker = await getServiceWorker(context)
  await seedUserPreferences(serviceWorker, {
    language: "en",
    webAiApiCheck: {
      enabled: true,
      contextMenu: {
        enabled: true,
      },
      autoDetect: {
        enabled: true,
        urlWhitelist: {
          patterns: ["^https://api-console\\.example\\.test/console"],
        },
      },
    },
  })

  await page.goto(TEST_PAGE_URL)

  const selectedCredentialText = `base_url=${API_BASE_URL}\napi_key=${API_KEY}`
  await page.locator("#copy-credentials").evaluate((target, text) => {
    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(target)
    selection?.removeAllRanges()
    selection?.addRange(range)

    const clipboardData = new DataTransfer()
    clipboardData.setData("text", text)
    target.dispatchEvent(
      new ClipboardEvent("copy", {
        bubbles: true,
        cancelable: true,
        clipboardData,
      }),
    )
  }, selectedCredentialText)

  const contentHost = page.locator("all-api-hub-redemption-toast")
  await contentHost.getByRole("button", { name: "Open" }).click()

  const modal = contentHost.getByTestId("api-check-modal")
  await expect(modal).toBeVisible()
  await expect(modal.locator("input").nth(0)).toHaveValue(API_BASE_URL)

  await modal.getByRole("button", { name: "Save to API profiles" }).click()
  await expect(
    contentHost.getByText("Saved api-console.example.test to API profiles."),
  ).toBeVisible()

  const rawProfiles = await getPlasmoStorageRawValue<string>(
    serviceWorker,
    STORAGE_KEYS.API_CREDENTIAL_PROFILES,
  )
  const profileConfig = JSON.parse(rawProfiles) as {
    profiles: Array<{
      id: string
      name: string
      baseUrl: string
      apiKey: string
    }>
  }

  expect(profileConfig.profiles).toEqual([
    expect.objectContaining({
      name: "api-console.example.test",
      baseUrl: API_BASE_URL,
      apiKey: API_KEY,
    }),
  ])

  const profileId = profileConfig.profiles[0].id
  expect(profileId).toBeTruthy()

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
    popupPage.getByRole("heading", { name: "api-console.example.test" }),
  ).toBeVisible()

  await popupPage.getByRole("button", { name: "Verify API" }).click()
  const verificationDialog = popupPage
    .getByRole("heading", { name: "API Verification" })
    .locator("xpath=ancestor::*[.//button[normalize-space()='Close']][1]")
  const modelsProbe = popupPage.getByTestId("profile-verify-probe-models")
  await expect(popupPage.getByTestId("profile-verify-model-id")).toBeVisible()
  await modelsProbe.getByRole("button", { name: "Run" }).click()
  await expect(modelsProbe).toContainText("Pass")
  await expect(modelsProbe).toContainText("Fetched 1 model.")
  await verificationDialog.getByText("Close", { exact: true }).click()
  await expect(verificationDialog).toHaveCount(0)

  const modelsPagePromise = waitForExtensionPage(context, {
    extensionId,
    path: OPTIONS_PAGE_PATH,
    hash: `#${MENU_ITEM_IDS.MODELS}`,
    searchParams: { profileId },
  })

  await popupPage
    .getByRole("button", { name: "Open in Model Management" })
    .click()

  const modelsPage = await modelsPagePromise
  installExtensionPageGuards(modelsPage)
  await waitForExtensionRoot(modelsPage)

  const targetUrl = new URL(modelsPage.url())
  expect(targetUrl.hash).toBe(`#${MENU_ITEM_IDS.MODELS}`)
  expect(targetUrl.searchParams.get("profileId")).toBe(profileId)

  await expect(
    modelsPage.getByRole("heading", { name: "Model List" }),
  ).toBeVisible()
  await expect(modelsPage.getByText("gpt-4o-mini")).toBeVisible()
  await expect(
    modelsPage
      .getByText("Profile: api-console.example.test", { exact: false })
      .first(),
  ).toBeVisible()
})
