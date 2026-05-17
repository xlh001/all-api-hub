import { OPTIONS_PAGE_PATH } from "~/constants/extensionPages"
import { MENU_ITEM_IDS } from "~/constants/optionsMenuIds"
import { KEY_MANAGEMENT_TEST_IDS } from "~/features/KeyManagement/testIds"
import { MODEL_LIST_TEST_IDS } from "~/features/ModelList/testIds"
import type { ModelPricing } from "~/services/apiService/common/type"
import { expect, test } from "~~/e2e/fixtures/extensionTest"
import {
  createStoredAccount,
  forceExtensionLanguage,
  installExtensionPageGuards,
  seedStoredAccounts,
  stubLlmMetadataIndex,
  stubNewApiSiteRoutes,
  waitForExtensionPage,
} from "~~/e2e/utils/commonUserFlows"
import {
  expectPermissionOnboardingHidden,
  getServiceWorker,
} from "~~/e2e/utils/extensionState"
import { waitForExtensionRoot } from "~~/e2e/utils/lazyLoading"

const MODEL_KEY_BASE_URL = "https://model-key.example.com"
const MODEL_KEY_ACCOUNT_ID = "model-key-account"
const MODEL_ID = "gpt-model-key-mini"
const CREATED_KEY_NAME = `model ${MODEL_ID}`

const MODEL_KEY_PRICING: ModelPricing[] = [
  {
    model_name: MODEL_ID,
    model_description: "E2E model that should produce a scoped key",
    quota_type: 0,
    model_ratio: 1,
    model_price: 0,
    owner_by: "openai",
    completion_ratio: 1,
    enable_groups: ["vip"],
    supported_endpoint_types: ["chat_completions"],
  },
]

test.beforeEach(async ({ context, page }) => {
  installExtensionPageGuards(page)
  await forceExtensionLanguage(page, "en")
  await stubLlmMetadataIndex(context)
})

test("creates a model-scoped key from Model List and continues in Key Management", async ({
  context,
  extensionId,
  page,
}) => {
  const serviceWorker = await getServiceWorker(context)
  await seedStoredAccounts(serviceWorker, [
    createStoredAccount({
      id: MODEL_KEY_ACCOUNT_ID,
      site_name: "Model Key Account",
      site_url: MODEL_KEY_BASE_URL,
      account_info: {
        id: 301,
        username: "model-key-user",
        access_token: "model-key-token",
      },
    }),
  ])
  await stubNewApiSiteRoutes(context, {
    baseUrl: MODEL_KEY_BASE_URL,
    models: [MODEL_ID],
    pricingModels: MODEL_KEY_PRICING,
    groups: {
      default: { desc: "Default", ratio: 1 },
      vip: { desc: "VIP", ratio: 2 },
    },
  })

  await page.goto(
    `chrome-extension://${extensionId}/${OPTIONS_PAGE_PATH}#${MENU_ITEM_IDS.MODELS}?accountId=${MODEL_KEY_ACCOUNT_ID}`,
  )
  await waitForExtensionRoot(page)
  await expectPermissionOnboardingHidden(page)

  await expect(page.getByRole("heading", { name: "Model List" })).toBeVisible()
  await expect(page.getByRole("heading", { name: MODEL_ID })).toBeVisible()

  await page.getByTestId(MODEL_LIST_TEST_IDS.modelKeyDialogButton).click()

  const keyDialog = page.getByTestId(MODEL_LIST_TEST_IDS.modelKeyDialog)
  await expect(
    keyDialog.getByText(`No compatible keys for ${MODEL_ID}`),
  ).toBeVisible()
  await expect(keyDialog.getByText("vip")).toBeVisible()

  await keyDialog.getByTestId(MODEL_LIST_TEST_IDS.createCustomKeyButton).click()

  const addKeyDialog = page.getByTestId(KEY_MANAGEMENT_TEST_IDS.addTokenDialog)
  await expect(addKeyDialog.locator("#tokenName")).toHaveValue(CREATED_KEY_NAME)
  await expect(addKeyDialog.getByText("Model Limits")).toBeVisible()
  await expect(addKeyDialog.getByText(MODEL_ID)).toBeVisible()
  await expect(addKeyDialog.getByText("vip - VIP")).toBeVisible()

  await addKeyDialog
    .getByTestId(KEY_MANAGEMENT_TEST_IDS.addTokenSubmitButton)
    .click()

  await expect(addKeyDialog).toHaveCount(0)
  await expect(keyDialog.getByText(CREATED_KEY_NAME)).toBeVisible()
  await expect(
    keyDialog.getByText(`No compatible keys for ${MODEL_ID}`),
  ).toHaveCount(0)

  const keysPagePromise = waitForExtensionPage(context, {
    extensionId,
    path: OPTIONS_PAGE_PATH,
    hash: `#${MENU_ITEM_IDS.KEYS}`,
    searchParams: { accountId: MODEL_KEY_ACCOUNT_ID },
  })

  await keyDialog
    .getByTestId(MODEL_LIST_TEST_IDS.openKeyManagementButton)
    .click()

  const keysPage = await keysPagePromise
  installExtensionPageGuards(keysPage)
  await forceExtensionLanguage(keysPage, "en")
  await waitForExtensionRoot(keysPage)
  await expectPermissionOnboardingHidden(keysPage)

  const targetUrl = new URL(keysPage.url())
  expect(targetUrl.hash).toBe(`#${MENU_ITEM_IDS.KEYS}`)
  expect(targetUrl.searchParams.get("accountId")).toBe(MODEL_KEY_ACCOUNT_ID)

  await expect(
    keysPage.getByRole("heading", { name: CREATED_KEY_NAME }),
  ).toBeVisible()
  await expect(keysPage.getByText("Group:")).toBeVisible()
  await expect(keysPage.getByText("vip", { exact: true })).toBeVisible()
})
