import { describe, expect, it } from "vitest"

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
