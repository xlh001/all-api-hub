import type { BrowserContext } from "@playwright/test"

import { OPTIONS_PAGE_PATH } from "~/constants/extensionPages"
import { MENU_ITEM_IDS } from "~/constants/optionsMenuIds"
import type { ModelPricing } from "~/services/apiService/common/type"
import { expect, test } from "~~/e2e/fixtures/extensionTest"
import {
  createStoredAccount,
  forceExtensionLanguage,
  installExtensionPageGuards,
  seedStoredAccounts,
  stubLlmMetadataIndex,
  stubNewApiSiteRoutes,
} from "~~/e2e/utils/commonUserFlows"
import {
  expectPermissionOnboardingHidden,
  getServiceWorker,
} from "~~/e2e/utils/extensionState"
import { waitForExtensionRoot } from "~~/e2e/utils/lazyLoading"

const MODEL_LIST_BASE_URL = "https://models.example.com"

const PRICING_MODELS: ModelPricing[] = [
  {
    model_name: "gpt-4o-mini",
    model_description: "Fast everyday chat model",
    quota_type: 0,
    model_ratio: 1,
    model_price: 0,
    owner_by: "openai",
    completion_ratio: 1,
    enable_groups: ["default", "vip"],
    supported_endpoint_types: ["chat_completions"],
  },
  {
    model_name: "claude-3-5-sonnet",
    model_description: "Reasoning and writing model",
    quota_type: 0,
    model_ratio: 2,
    model_price: 0,
    owner_by: "anthropic",
    completion_ratio: 1,
    enable_groups: ["default"],
    supported_endpoint_types: ["chat_completions"],
  },
  {
    model_name: "gemini-1.5-flash",
    model_description: "Lightweight multimodal model",
    quota_type: 0,
    model_ratio: 0.5,
    model_price: 0,
    owner_by: "google",
    completion_ratio: 1,
    enable_groups: ["vip"],
    supported_endpoint_types: ["chat_completions"],
  },
]

async function seedModelListAccount(context: BrowserContext) {
  const serviceWorker = await getServiceWorker(context)

  await seedStoredAccounts(serviceWorker, [
    createStoredAccount({
      id: "model-list-account",
      site_name: "Model Catalog Account",
      site_url: MODEL_LIST_BASE_URL,
      account_info: {
        id: 51,
        username: "model-user",
        access_token: "model-token",
      },
    }),
  ])

  await stubNewApiSiteRoutes(context, {
    baseUrl: MODEL_LIST_BASE_URL,
    models: PRICING_MODELS.map((model) => model.model_name),
    pricingModels: PRICING_MODELS,
    groups: {
      default: { desc: "Default", ratio: 1 },
      vip: { desc: "VIP", ratio: 1.5 },
    },
  })
}

test.beforeEach(async ({ context, page }) => {
  installExtensionPageGuards(page)
  await forceExtensionLanguage(page, "en")
  await stubLlmMetadataIndex(context)
})

test("loads account-backed models, filters them, and exposes common model actions", async ({
  context,
  extensionId,
  page,
}) => {
  await seedModelListAccount(context)

  await page.goto(
    `chrome-extension://${extensionId}/${OPTIONS_PAGE_PATH}#${MENU_ITEM_IDS.MODELS}?accountId=model-list-account`,
  )
  await waitForExtensionRoot(page)
  await expectPermissionOnboardingHidden(page)

  await expect(page.getByRole("heading", { name: "Model List" })).toBeVisible()
  await expect(page.getByRole("combobox").first()).toContainText(
    "Model Catalog Account",
  )
  await expect(page.getByText("gpt-4o-mini")).toBeVisible()
  await expect(page.getByText("claude-3-5-sonnet")).toBeVisible()
  await expect(page.getByText("gemini-1.5-flash")).toBeVisible()
  await expect(page.getByText("Total 3 models")).toBeVisible()
  await expect(page.getByText("Showing 3 models")).toBeVisible()

  await page
    .getByPlaceholder("Enter model name or description...")
    .fill("sonnet")

  await expect(page.getByText("claude-3-5-sonnet")).toBeVisible()
  await expect(page.getByText("gpt-4o-mini")).toHaveCount(0)
  await expect(page.getByText("gemini-1.5-flash")).toHaveCount(0)
  await expect(page.getByText("Showing 1 model")).toBeVisible()

  await page.getByRole("button", { name: "Copy All Model Names" }).click()
  await expect(page.getByText("Model names copied")).toBeVisible()

  await page.getByPlaceholder("Enter model name or description...").fill("")
  await expect(page.getByText("gpt-4o-mini")).toBeVisible()

  await page.getByRole("tab", { name: /OpenAI \(1\)/ }).click()
  await expect(page.getByText("gpt-4o-mini")).toBeVisible()
  await expect(page.getByText("claude-3-5-sonnet")).toHaveCount(0)

  await page.getByRole("tab", { name: /All Providers \(3\)/ }).click()
  await page.getByRole("button", { name: "Key for this model" }).first().click()

  const dialog = page.getByRole("dialog").filter({ hasText: "Key for model" })
  await expect(dialog).toContainText("Account: Model Catalog Account")
  await expect(dialog).toContainText("Model: gpt-4o-mini")
})

test("shows an empty model result when account-backed search has no matches", async ({
  context,
  extensionId,
  page,
}) => {
  await seedModelListAccount(context)

  await page.goto(
    `chrome-extension://${extensionId}/${OPTIONS_PAGE_PATH}#${MENU_ITEM_IDS.MODELS}?accountId=model-list-account`,
  )
  await waitForExtensionRoot(page)
  await expectPermissionOnboardingHidden(page)

  await expect(page.getByText("gpt-4o-mini")).toBeVisible()

  await page
    .getByPlaceholder("Enter model name or description...")
    .fill("not-a-real-model")

  await expect(page.getByText("No matching models found")).toBeVisible()
  await expect(page.getByText("Showing 0 models")).toBeVisible()
  await expect(page.getByRole("button", { name: "Batch test" })).toBeDisabled()
})
