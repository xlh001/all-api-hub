import { describe, expect, it, vi } from "vitest"

import { normalizeModelName, stripVendorPrefix } from "~/utils/modelName"

const metadataEntries = new Map<
  string,
  { standardName: string; vendorName: string }
>([
  ["gpt-4o", { standardName: "GPT-4o", vendorName: "OpenAI" }],
  ["gpt4o", { standardName: "GPT-4o", vendorName: "OpenAI" }],
  ["deepseek-r1", { standardName: "DeepSeek R1", vendorName: "DeepSeek" }],
  ["deepseekr1", { standardName: "DeepSeek R1", vendorName: "DeepSeek" }],
  ["claude-3-5-sonnet", { standardName: "Claude 3.5 Sonnet", vendorName: "Anthropic" }],
  ["claude35sonnet", { standardName: "Claude 3.5 Sonnet", vendorName: "Anthropic" }],
  ["gpt-4o-mini", { standardName: "GPT-4o-mini", vendorName: "OpenAI" }],
  ["gpt4omini", { standardName: "GPT-4o-mini", vendorName: "OpenAI" }]
])

vi.mock("~/services/modelMetadata", () => {
  const modelMetadataService = {
    initialize: vi.fn().mockResolvedValue(undefined),
    findStandardModelName: (modelName: string) => {
      const normalized = normalizeModelName(stripVendorPrefix(modelName))
      return metadataEntries.get(normalized) ?? null
    },
    findVendorByPattern: (modelName: string) => {
      if (/gpt/i.test(modelName)) return "OpenAI"
      if (/claude|sonnet/i.test(modelName)) return "Anthropic"
      if (/deepseek/i.test(modelName)) return "DeepSeek"
      return null
    },
    getVendorRules: () => [],
    getCacheInfo: () => ({ isLoaded: true, modelCount: metadataEntries.size, lastUpdated: Date.now() })
  }

  return { modelMetadataService }
})

import { ModelRedirectService } from "../ModelRedirectService"

describe("ModelRedirectService.generateModelMappingForChannel", () => {
  it("should generate mapping with normalized names and deduplicate actual models", () => {
    const standardModels = ["gpt-4o", "deepseek-r1", "claude-3-5-sonnet"]
    const actualModels = [
      "openai/gpt-4o:free",
      "BigModel/deepseek/deepseek-r1:free",
      "deepseek/deepseek-r1:premium",
      "anthropic/claude-3-5-sonnet",
      "anthropic/claude-3-5-sonnet-20241022"
    ]

    const mapping = ModelRedirectService.generateModelMappingForChannel(
      standardModels,
      actualModels
    )

    expect(mapping).toEqual({
      "gpt-4o": "openai/gpt-4o:free",
      "deepseek-r1": "BigModel/deepseek/deepseek-r1:free",
      "claude-3-5-sonnet": "anthropic/claude-3-5-sonnet"
    })
  })

  it("should skip standard models already present in actual models", () => {
    const standardModels = ["gpt-4o", "gpt-4o-mini"]
    const actualModels = ["gpt-4o", "openai/gpt-4o-mini-20240718"]

    const mapping = ModelRedirectService.generateModelMappingForChannel(
      standardModels,
      actualModels
    )

    expect(mapping).toEqual({
      "gpt-4o-mini": "openai/gpt-4o-mini-20240718"
    })
  })

  it("should prevent duplicate keys when standard models normalize to same value", () => {
    const standardModels = ["gpt-4o", "GPT-4o"]
    const actualModels = ["openai/gpt-4o"]

    const mapping = ModelRedirectService.generateModelMappingForChannel(
      standardModels,
      actualModels
    )

    expect(Object.keys(mapping)).toEqual(["gpt-4o"])
    expect(mapping["gpt-4o"]).toBe("openai/gpt-4o")
  })

  it("should return empty mapping when no matches found", () => {
    const standardModels = ["gpt-4o", "claude-3-5-sonnet"]
    const actualModels = ["moonshot-v1"]

    const mapping = ModelRedirectService.generateModelMappingForChannel(
      standardModels,
      actualModels
    )

    expect(mapping).toEqual({})
  })
})
