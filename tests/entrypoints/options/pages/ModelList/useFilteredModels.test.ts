import { describe, expect, it } from "vitest"

import { useFilteredModels } from "~/features/ModelList/hooks/useFilteredModels"
import {
  createAccountSource,
  createAllAccountsSource,
  createProfileSource,
} from "~/features/ModelList/modelManagementSources"
import type { PricingResponse } from "~/services/apiService/common/type"
import { API_TYPES } from "~/services/verification/aiApiVerification"
import { AuthTypeEnum, SiteHealthStatus, type DisplaySiteData } from "~/types"
import { renderHook, waitFor } from "~~/tests/test-utils/render"

const createDisplayAccount = (
  overrides: Partial<DisplaySiteData>,
): DisplaySiteData => ({
  id: "account",
  name: "Account",
  username: "user",
  balance: { USD: 0, CNY: 0 },
  todayConsumption: { USD: 0, CNY: 0 },
  todayIncome: { USD: 0, CNY: 0 },
  todayTokens: { upload: 0, download: 0 },
  health: { status: SiteHealthStatus.Healthy },
  siteType: "default",
  baseUrl: "https://example.com",
  token: "token",
  userId: 1,
  authType: AuthTypeEnum.AccessToken,
  checkIn: { enableDetection: false },
  ...overrides,
})

const createPricingModel = (
  overrides: Partial<PricingResponse["data"][number]>,
): PricingResponse["data"][number] => ({
  model_name: "gpt-4o-mini",
  quota_type: 0,
  model_ratio: 0,
  model_price: 0,
  completion_ratio: 1,
  enable_groups: [],
  supported_endpoint_types: [],
  ...overrides,
})

const createPricingResponse = (
  models: Array<string | Partial<PricingResponse["data"][number]>>,
  overrides: Partial<PricingResponse> = {},
): PricingResponse => ({
  data: models.map((model) =>
    typeof model === "string"
      ? createPricingModel({ model_name: model })
      : createPricingModel(model),
  ),
  group_ratio: {},
  success: true,
  usable_group: {},
  ...overrides,
})

describe("useFilteredModels", () => {
  it("preserves profile-backed items when an account filter is active", async () => {
    const profileSource = createProfileSource({
      id: "profile-1",
      name: "Reusable Key",
      apiType: API_TYPES.OPENAI_COMPATIBLE,
      baseUrl: "https://profile.example.com/v1",
      apiKey: "sk-secret",
      tagIds: [],
      notes: "",
      createdAt: 1,
      updatedAt: 1,
    })

    const { result } = renderHook(() =>
      useFilteredModels({
        pricingData: createPricingResponse(["gpt-4o-mini"]),
        pricingContexts: [],
        selectedSource: profileSource,
        selectedGroup: "default",
        searchTerm: "",
        selectedProvider: "all",
        accountFilterAccountId: "account-1",
      }),
    )

    await waitFor(() => expect(result.current).not.toBeNull())

    expect(result.current.filteredModels).toHaveLength(1)
    expect(result.current.filteredModels[0]?.source.kind).toBe("profile")
  })

  it("computes provider counts from the account-filtered model set", async () => {
    const accountA = createDisplayAccount({
      id: "account-a",
      name: "Account A",
      baseUrl: "https://a.example.com",
      userId: 1,
    })
    const accountB = createDisplayAccount({
      id: "account-b",
      name: "Account B",
      baseUrl: "https://b.example.com",
      userId: 2,
    })

    const { result } = renderHook(() =>
      useFilteredModels({
        pricingData: null,
        pricingContexts: [
          {
            account: accountA,
            pricing: createPricingResponse([
              "gpt-4o-mini",
              "claude-3-5-sonnet",
            ]),
          },
          {
            account: accountB,
            pricing: createPricingResponse(["gemini-1.5-pro"]),
          },
        ],
        selectedSource: createAllAccountsSource(),
        selectedGroup: "default",
        searchTerm: "",
        selectedProvider: "all",
        accountFilterAccountId: "account-a",
      }),
    )

    await waitFor(() => expect(result.current).not.toBeNull())

    expect(result.current.filteredModels).toHaveLength(2)
    expect(result.current.allProvidersFilteredCount).toBe(2)
    expect(result.current.getProviderFilteredCount("OpenAI")).toBe(1)
    expect(result.current.getProviderFilteredCount("Claude")).toBe(1)
    expect(result.current.getProviderFilteredCount("Gemini")).toBe(0)
  })

  it("applies single-account group pricing and exposes available account groups", async () => {
    const account = createDisplayAccount({
      id: "account-pricing",
      balance: { USD: 10, CNY: 70 },
    })

    const source = createAccountSource(account)

    const { result } = renderHook(() =>
      useFilteredModels({
        pricingData: createPricingResponse(
          [
            {
              model_name: "gpt-4o-mini",
              model_ratio: 1,
              completion_ratio: 1,
              enable_groups: ["vip"],
            },
            {
              model_name: "claude-3-5-sonnet",
              model_ratio: 2,
              completion_ratio: 1,
              enable_groups: ["default"],
            },
          ],
          {
            group_ratio: { vip: 2, "": 5 },
          },
        ),
        pricingContexts: [],
        selectedSource: source,
        selectedGroup: "vip",
        searchTerm: "",
        selectedProvider: "all",
      }),
    )

    await waitFor(() => expect(result.current.availableGroups).toEqual(["vip"]))

    expect(result.current.baseFilteredModels).toHaveLength(1)
    expect(result.current.filteredModels).toHaveLength(1)
    const pricedSource = result.current.filteredModels[0]?.source
    expect(pricedSource?.kind).toBe("account")
    if (!pricedSource || pricedSource.kind !== "account") {
      throw new Error("Expected an account-backed filtered model")
    }
    expect(pricedSource.account.id).toBe("account-pricing")
    expect(result.current.filteredModels[0]?.calculatedPrice).toMatchObject({
      inputUSD: 4,
      outputUSD: 4,
      inputCNY: 28,
      outputCNY: 28,
    })
  })

  it("searches model descriptions before applying provider filters", async () => {
    const account = createDisplayAccount({
      id: "account-search",
      balance: { USD: 5, CNY: 35 },
    })

    const { result } = renderHook(() =>
      useFilteredModels({
        pricingData: createPricingResponse([
          {
            model_name: "claude-3-5-sonnet",
            model_description: "Batch summarizer",
            enable_groups: ["default"],
          },
          {
            model_name: "gemini-1.5-pro",
            model_description: "Batch multimodal pipeline",
            enable_groups: ["default"],
          },
          {
            model_name: "gpt-4o-mini",
            enable_groups: ["default"],
          },
        ]),
        pricingContexts: [],
        selectedSource: createAccountSource(account),
        selectedGroup: "all",
        searchTerm: "batch",
        selectedProvider: "Claude",
      }),
    )

    await waitFor(() =>
      expect(result.current.baseFilteredModels).toHaveLength(2),
    )

    expect(
      result.current.baseFilteredModels.map((item) => item.model.model_name),
    ).toEqual(["claude-3-5-sonnet", "gemini-1.5-pro"])
    expect(
      result.current.filteredModels.map((item) => item.model.model_name),
    ).toEqual(["claude-3-5-sonnet"])
    expect(result.current.getProviderFilteredCount("Claude")).toBe(1)
    expect(result.current.getProviderFilteredCount("Gemini")).toBe(1)
  })

  it("skips malformed account pricing payloads while keeping valid account models and groups", async () => {
    const accountA = createDisplayAccount({
      id: "account-valid",
      name: "Valid Account",
      balance: { USD: 2, CNY: 14 },
    })
    const accountB = createDisplayAccount({
      id: "account-invalid",
      name: "Invalid Account",
      balance: { USD: 0, CNY: 0 },
    })

    const { result } = renderHook(() =>
      useFilteredModels({
        pricingData: null,
        pricingContexts: [
          {
            account: accountA,
            pricing: createPricingResponse([
              {
                model_name: "gemini-1.5-pro",
                enable_groups: ["default"],
              },
            ]),
          },
          {
            account: accountB,
            pricing: {
              data: null,
              success: true,
              usable_group: {},
            } as any,
          },
        ],
        selectedSource: createAllAccountsSource(),
        selectedGroup: "all",
        searchTerm: "",
        selectedProvider: "Gemini",
      }),
    )

    await waitFor(() => {
      expect(
        result.current.filteredModels.map((item) => item.model.model_name),
      ).toEqual(["gemini-1.5-pro"])
    })

    expect(result.current.availableGroups).toEqual([])
    const filteredSource = result.current.filteredModels[0]?.source
    expect(filteredSource?.kind).toBe("account")
    if (!filteredSource || filteredSource.kind !== "account") {
      throw new Error("Expected a valid account-backed filtered model")
    }
    expect(filteredSource.account.id).toBe("account-valid")
    expect(result.current.getProviderFilteredCount("Gemini")).toBe(1)
  })
})
