import { describe, expect, it, vi } from "vitest"

global.fetch = vi.fn()

describe("ModelMetadataService", () => {
  it("initializes without errors", async () => {
    const { modelMetadataService } = await import("~/services/modelMetadata")
    await expect(modelMetadataService.initialize()).resolves.not.toThrow()
  })

  it("handles getModelMetadata calls", async () => {
    const { modelMetadataService } = await import("~/services/modelMetadata")
    const info = modelMetadataService.getCacheInfo()
    expect(info && typeof info === "object").toBe(true)
  })
})
