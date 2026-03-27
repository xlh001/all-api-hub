import { POPUP_PAGE_PATH } from "~/constants/extensionPages"
import { expect, test } from "~~/e2e/fixtures/extensionTest"
import {
  createStoredApiCredentialProfile,
  forceExtensionLanguage,
  installExtensionPageGuards,
  seedApiCredentialProfiles,
  stubLlmMetadataIndex,
} from "~~/e2e/utils/commonUserFlows"
import { getServiceWorker } from "~~/e2e/utils/extensionState"
import { waitForExtensionRoot } from "~~/e2e/utils/lazyLoading"

test.beforeEach(async ({ context, page }) => {
  installExtensionPageGuards(page)
  await forceExtensionLanguage(page, "en")
  await stubLlmMetadataIndex(context)

  await context.route("https://api.example.com/v1/models", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        message: "ok",
        data: [{ id: "gpt-4o-mini" }, { id: "gpt-4.1-mini" }],
      }),
    }),
  )
})

test("creates an API credential profile from the popup tab", async ({
  extensionId,
  page,
}) => {
  await page.goto(`chrome-extension://${extensionId}/${POPUP_PAGE_PATH}`)
  await waitForExtensionRoot(page)

  await page.getByRole("tab", { name: "API Credentials" }).click()
  await expect(
    page.getByTestId("api-credential-profiles-popup-view"),
  ).toBeVisible()

  await page
    .getByTestId("popup-view-apiCredentialProfiles")
    .getByRole("button", { name: "Add profile" })
    .first()
    .click()

  await page.locator("#api-credential-profile-name").fill("Popup Profile")
  await page
    .locator("#api-credential-profile-baseUrl")
    .fill("https://api.example.com/v1")
  await page.locator("#api-credential-profile-apiKey").fill("sk-popup-profile")
  await page.getByRole("button", { name: "Save" }).click()

  await expect(
    page.getByRole("heading", { name: "Popup Profile" }),
  ).toBeVisible()
})

test("verifies a stored popup API credential profile against mocked endpoints", async ({
  context,
  extensionId,
  page,
}) => {
  const serviceWorker = await getServiceWorker(context)
  await seedApiCredentialProfiles(serviceWorker, [
    createStoredApiCredentialProfile({
      name: "Stored Profile",
      baseUrl: "https://api.example.com",
      apiKey: "sk-stored-profile",
    }),
  ])

  await page.goto(`chrome-extension://${extensionId}/${POPUP_PAGE_PATH}`)
  await waitForExtensionRoot(page)

  await page.getByRole("tab", { name: "API Credentials" }).click()
  await expect(
    page.getByTestId("api-credential-profiles-popup-view"),
  ).toBeVisible()

  await page.getByRole("button", { name: "Verify API" }).click()

  const modelsProbe = page.getByTestId("profile-verify-probe-models")
  await expect(page.getByTestId("profile-verify-model-id")).toBeVisible()

  await modelsProbe.getByRole("button", { name: "Run" }).click()

  await expect(modelsProbe).toContainText("Pass")
  await expect(modelsProbe).toContainText("Fetched 2 models.")
})
