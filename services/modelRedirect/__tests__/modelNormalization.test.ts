import { beforeEach, describe, expect, it, vi } from "vitest"

import { extractActualModel, renameModel } from "../modelNormalization"

// Mock modelMetadataService
const mockMetadataMap = new Map<
  string,
  { standardName: string; vendorName: string }
>([
  ["gpt-4o", { standardName: "gpt-4o", vendorName: "OpenAI" }],
  ["claude-3-5-sonnet", { standardName: "claude-3-5-sonnet-20241022", vendorName: "Anthropic" }],
  ["deepseek-chat", { standardName: "deepseek-chat", vendorName: "DeepSeek" }],
  ["gemini-1.5-flash", { standardName: "gemini-1.5-flash", vendorName: "Google" }]
])

vi.mock("~/services/modelMetadata", () => ({
  modelMetadataService: {
    findStandardModelName: (modelName: string) => {
      const cleaned = modelName.trim().toLowerCase()
      return mockMetadataMap.get(cleaned) || null
    },
    findVendorByPattern: (modelName: string) => {
      const lower = modelName.toLowerCase()
      if (/^gpt/.test(lower)) return "OpenAI"
      if (/^claude/.test(lower)) return "Anthropic"
      if (/^deepseek/.test(lower)) return "DeepSeek"
      if (/^gemini/.test(lower)) return "Google"
      return null
    }
  }
}))

describe("extractActualModel", () => {
  it("should remove BigModel/ prefix", () => {
    expect(extractActualModel("BigModel/gpt-4o")).toBe("gpt-4o")
  })

  it("should extract model name after last slash", () => {
    expect(extractActualModel("openai/gpt-4o")).toBe("gpt-4o")
    expect(extractActualModel("provider/category/model")).toBe("model")
  })

  it("should remove colon suffix", () => {
    expect(extractActualModel("gpt-4o:free")).toBe("gpt-4o")
    expect(extractActualModel("model:extended")).toBe("model")
  })

  it("should remove date suffix", () => {
    expect(extractActualModel("claude-3-5-sonnet-20241022")).toBe("claude-3-5-sonnet")
  })

  it("should handle complex model names", () => {
    expect(extractActualModel("BigModel/deepseek/deepseek-r1:free")).toBe("deepseek-r1")
  })
})

describe("renameModel", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("includeVendor=false", () => {
    it("should return extracted model name when not in metadata", () => {
      expect(renameModel("gpt-4o", false)).toBe("gpt-4o")
      expect(renameModel("openai/gpt-4o", false)).toBe("gpt-4o")
    })

    it("should use standard name from metadata", () => {
      expect(renameModel("claude-3-5-sonnet", false)).toBe(
        "claude-3-5-sonnet-20241022"
      )
    })

    it("should handle colon suffix", () => {
      expect(renameModel("gpt-4o:free", false)).toBe("gpt-4o")
    })

    it("should resolve to metadata version when removing date suffix", () => {
      expect(renameModel("claude-3-5-sonnet-20240101", false)).toBe(
        "claude-3-5-sonnet-20241022"
      )
    })
  })

  describe("includeVendor=true", () => {
    it("should preserve standard vendor/model format", () => {
      expect(renameModel("OpenAI/gpt-4o", true)).toBe("OpenAI/gpt-4o")
      expect(renameModel("Anthropic/claude-3-5-sonnet", true)).toBe("Anthropic/claude-3-5-sonnet")
    })

    it("should not preserve BigModel/ prefix", () => {
      expect(renameModel("BigModel/gpt-4o", true)).toBe("OpenAI/gpt-4o")
    })

    it("should not preserve Pro/ prefix", () => {
      expect(renameModel("Pro/gpt-4o", true)).toBe("OpenAI/gpt-4o")
    })

    it("should add vendor prefix from metadata", () => {
      expect(renameModel("gpt-4o", true)).toBe("OpenAI/gpt-4o")
      expect(renameModel("claude-3-5-sonnet", true)).toBe(
        "Anthropic/claude-3-5-sonnet-20241022"
      )
    })

    it("should add vendor prefix from pattern matching", () => {
      expect(renameModel("unknown-gpt-model", true)).toBe("OpenAI/unknown-gpt-model")
      expect(renameModel("deepseek-custom", true)).toBe("DeepSeek/deepseek-custom")
    })
  })

  describe("edge cases", () => {
    it("should handle empty or undefined input", () => {
      expect(renameModel("", false)).toBeUndefined()
      expect(renameModel("  ", false)).toBeUndefined()
    })

    it("should handle complex pipeline", () => {
      expect(renameModel("BigModel/openai/gpt-4o:free-20240101", false)).toBe("gpt-4o")
    })
  })
})
