import { describe, expect, it, vi } from "vitest"

import { normalizeModelName, stripVendorPrefix } from "~/utils/modelName"

const metadataEntries = new Map<
  string,
  { standardName: string; vendorName: string }
>([
  ["gpt4o", { standardName: "GPT-4o", vendorName: "OpenAI" }],
  ["claude35sonnet", { standardName: "Claude 3.5 Sonnet", vendorName: "Anthropic" }],
  ["deepseekv31", { standardName: "deepseek-ai/DeepSeek-V3.1", vendorName: "deepseek-ai" }],
  ["deepseekr1", { standardName: "DeepSeek R1", vendorName: "DeepSeek" }],
  ["gemini15flash", { standardName: "Gemini 1.5 Flash", vendorName: "Google" }]
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
      if (/gemini/i.test(modelName)) return "Google"
      return null
    },
    getVendorRules: () => [],
    getCacheInfo: () => ({
      isLoaded: true,
      modelCount: metadataEntries.size,
      lastUpdated: Date.now()
    })
  }

  return {
    modelMetadataService
  }
})

import { modelMetadataService } from "~/services/modelMetadata"
import {
  modelNormalizationInternals,
  renameModel
} from "../modelNormalization"

describe("modelNormalization", () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    await modelMetadataService.initialize()
  })
  describe("renameModel", () => {
    describe("Stage 0: Fast Path", () => {
      it("should return original if !includeVendor and standard standalone", () => {
        expect(renameModel("gpt-4o", false)).toBe("gpt-4o")
        expect(renameModel("claude-3-5-sonnet", false)).toBe(
          "claude-3-5-sonnet"
        )
      })

      it("should not fast-path if model contains slash", () => {
        expect(renameModel("openai/gpt-4o", false)).toBe("GPT-4o")
      })

      it("should not fast-path if model contains colon", () => {
        expect(renameModel("gpt-4o:free", false)).toBe("GPT-4o")
      })
    })

    describe("Stage 1: Standard Format Detection", () => {
      it("should return original if includeVendor and owner/model format without special prefix", () => {
        expect(renameModel("OpenAI/GPT-4o", true)).toBe("OpenAI/GPT-4o")
      })

      it("should not fast-path with special prefixes", () => {
        expect(renameModel("BigModel/OpenAI/GPT-4o", true)).not.toBe(
          "BigModel/OpenAI/GPT-4o"
        )
      })
    })

    describe("Stage 2: Clean Special Prefixes", () => {
      it("should remove BigModel/ prefix", () => {
        expect(renameModel("BigModel/gpt-4o", false)).toBe("GPT-4o")
      })

      it("should handle models without special prefix", () => {
        expect(renameModel("gpt-4o", false)).toBe("gpt-4o")
      })
    })

    describe("Stage 3: Extract Real Model Name", () => {
      it("should extract after last slash", () => {
        expect(renameModel("openai/gpt-4o", false)).toBe("GPT-4o")
      })

      it("should handle multiple slashes", () => {
        expect(renameModel("provider/category/model-name", false)).toBe(
          "model-name"
        )
      })
    })

    describe("Stage 4: Remove Colon Suffixes", () => {
      it("should remove :free suffix", () => {
        expect(renameModel("gpt-4o:free", false)).toBe("GPT-4o")
      })

      it("should remove :extended suffix", () => {
        expect(renameModel("claude-3-5-sonnet:extended", false)).toBe(
          "Claude 3.5 Sonnet"
        )
      })

      it("should remove :preview suffix", () => {
        expect(renameModel("model:preview", false)).toBe("model")
      })
    })

    describe("Stage 5: Remove Date Suffixes", () => {
      it("should remove 8-digit date suffix", () => {
        const result = modelNormalizationInternals.removeDateSuffix(
          "model-20250101"
        )
        expect(result).toBe("model")
      })

      it("should not remove non-date numbers", () => {
        const result = modelNormalizationInternals.removeDateSuffix("gpt-4o")
        expect(result).toBe("gpt-4o")
      })
    })

    describe("Stage 6: Metadata Matching", () => {
      it("should find standard name from metadata", () => {
        expect(renameModel("gpt4o", false)).toBe("GPT-4o")
        expect(renameModel("claude35sonnet", false)).toBe("Claude 3.5 Sonnet")
      })

      it("should handle vendor/model format in standard name", () => {
        expect(renameModel("deepseek-v3.1", false)).toBe("DeepSeek-V3.1")
        expect(renameModel("deepseek-v3.1", true)).toBe(
          "deepseek-ai/DeepSeek-V3.1"
        )
      })

      it("should match aliases", () => {
        expect(renameModel("gpt-4-o", false)).toBe("GPT-4o")
        expect(renameModel("gemini15flash", false)).toBe("Gemini 1.5 Flash")
      })
    })

    describe("Stage 7: Pattern Matching Fallback", () => {
      it("should detect vendor from pattern when not in metadata", () => {
        expect(renameModel("unknown-gpt-model", true)).toBe(
          "OpenAI/unknown-gpt-model"
        )
      })

      it("should fallback without vendor when includeVendor=false", () => {
        expect(renameModel("unknown-gpt-model", false)).toBe(
          "unknown-gpt-model"
        )
      })

      it("should detect DeepSeek from pattern", () => {
        expect(renameModel("deepseek-custom-model", true)).toBe(
          "DeepSeek/deepseek-custom-model"
        )
      })
    })

    describe("Stage 8: Compose Final Result", () => {
      it("should include vendor when includeVendor=true", () => {
        expect(renameModel("gpt-4o", true)).toBe("OpenAI/GPT-4o")
        expect(renameModel("claude-3-5-sonnet", true)).toBe(
          "Anthropic/Claude 3.5 Sonnet"
        )
      })

      it("should exclude vendor when includeVendor=false", () => {
        expect(renameModel("openai/gpt-4o", false)).toBe("GPT-4o")
        expect(renameModel("anthropic/claude-3-5-sonnet", false)).toBe(
          "Claude 3.5 Sonnet"
        )
      })
    })

    describe("Complex scenarios", () => {
      it("should handle full pipeline: special prefix + slash + colon + date", () => {
        expect(
          renameModel("BigModel/openai/gpt-4o:free-20250101", false)
        ).toBe("GPT-4o")
      })

      it("should handle channel model normalization", () => {
        expect(renameModel("Pro/deepseek/deepseek-r1:extended", false)).toBe(
          "DeepSeek R1"
        )
      })

      it("should return undefined for empty string", () => {
        expect(renameModel("", false)).toBeUndefined()
      })

      it("should return undefined for whitespace-only string", () => {
        expect(renameModel("   ", false)).toBeUndefined()
      })

      it("should trim input", () => {
        expect(renameModel("  gpt-4o  ", false)).toBe("gpt-4o")
      })
    })
  })
})
