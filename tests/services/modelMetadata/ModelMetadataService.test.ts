import { beforeEach, describe, expect, it, vi } from "vitest"

describe("ModelMetadataService", () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        models: [{ id: "gpt-4", name: "GPT-4", providerId: "openai" }]
      })
    })
  })

  it("initializes without errors", async () => {
    const { modelMetadataService } = await import("~/services/modelMetadata")
    await expect(modelMetadataService.initialize()).resolves.not.toThrow()
  })

  it("handles getCacheInfo calls", async () => {
    const { modelMetadataService } = await import("~/services/modelMetadata")
    const info = modelMetadataService.getCacheInfo()
    expect(info).toBeDefined()
    expect(typeof info).toBe("object")
  })
})
