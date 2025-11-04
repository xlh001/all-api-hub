import { describe, expect, it } from "vitest"

import {
  modelNormalizationInternals,
  renameModel
} from "../modelNormalization"

describe("modelNormalization", () => {
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
        const result = renameModel("BigModel/gpt-4o", false)
        expect(result).toBe("GPT-4o")
      })

      it("should remove Pro/ prefix", () => {
        const result = renameModel("Pro/claude-3-5-sonnet", false)
        expect(result).toBe("Claude 3.5 Sonnet")
      })

      it("should remove multiple special prefixes", () => {
        const result = renameModel("BigModel/Pro/gpt-4o", false)
        expect(result).toBe("GPT-4o")
      })

      it("should remove VIP/ prefix", () => {
        const cleaned = modelNormalizationInternals.removeSpecialPrefixes(
          "VIP/model"
        )
        expect(cleaned).toBe("model")
      })
    })

    describe("Stage 3: Extract Real Model Name", () => {
      it("should extract after last slash", () => {
        expect(renameModel("openai/gpt-4o", false)).toBe("GPT-4o")
        expect(renameModel("deepseek/deepseek-r1:free", false)).toBe(
          "DeepSeek R1"
        )
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

      it("should remove 6-digit date suffix", () => {
        const result = modelNormalizationInternals.removeDateSuffix(
          "model-202501"
        )
        expect(result).toBe("model")
      })

      it("should remove date with separators", () => {
        const result = modelNormalizationInternals.removeDateSuffix(
          "model-2025-01-15"
        )
        expect(result).toBe("model")
      })

      it("should handle date suffix with underscore", () => {
        const result =
          modelNormalizationInternals.removeDateSuffix("model_20250101")
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
        expect(renameModel("unknown-gpt-model", false)).toBe(
          "unknown-gpt-model"
        )
        expect(renameModel("unknown-gpt-model", true)).toBe(
          "OpenAI/unknown-gpt-model"
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
        expect(renameModel("BigModel/openai/gpt-4o:free-20250101", false)).toBe(
          "GPT-4o"
        )
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
