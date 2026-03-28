import { describe, expect, it, vi } from "vitest"

import { VELOERA } from "~/constants/siteType"
import { getApiService } from "~/services/apiService"
import { ModelSyncService } from "~/services/models/modelSync/modelSyncService"
import type { ChannelModelFilterRule } from "~/types/channelModelFilters"

const listAllChannelsMock = vi.fn()
const fetchChannelModelsMock = vi.fn()
const updateChannelModelsMock = vi.fn()
const updateChannelModelMappingMock = vi.fn()

vi.mock("~/services/apiService", () => ({
  getApiService: vi.fn(() => ({
    listAllChannels: listAllChannelsMock,
    fetchChannelModels: fetchChannelModelsMock,
    updateChannelModels: updateChannelModelsMock,
    updateChannelModelMapping: updateChannelModelMappingMock,
  })),
}))

describe("ModelSyncService - allowed model filtering", () => {
  const createService = (allowed?: string[]) =>
    new ModelSyncService(
      "https://example.com",
      "dummy-token",
      "1",
      undefined,
      allowed,
    )

  const callFilter = (service: ModelSyncService, models: string[]) =>
    (service as any).filterAllowedModels(models) as string[]

  it("returns trimmed unique models when no allow-list exists", () => {
    const service = createService()

    const result = callFilter(service, [
      "  gpt-4o  ",
      "gpt-4o",
      "claude-3",
      "  ",
    ])

    expect(result).toEqual(["gpt-4o", "claude-3"])
  })

  it("filters models using the configured allow-list", () => {
    const service = createService(["gpt-4o", "claude-3"])

    const result = callFilter(service, [
      " gpt-4o  ",
      "gpt-4o-mini",
      "claude-3",
      "unknown-model",
    ])

    expect(result).toEqual(["gpt-4o", "claude-3"])
  })

  it("deduplicates after filtering", () => {
    const service = createService(["gpt-4o"])

    const result = callFilter(service, ["gpt-4o", " gpt-4o  ", "gpt-4o"])

    expect(result).toEqual(["gpt-4o"])
  })
})

describe("ModelSyncService - siteType routing", () => {
  it("forwards ManagedSiteType hint to apiService listAllChannels", async () => {
    listAllChannelsMock.mockResolvedValue({
      items: [],
      total: 0,
      type_counts: {},
    })

    const service = new ModelSyncService(
      "https://example.com",
      "token",
      "1",
      undefined,
      undefined,
      undefined,
      undefined,
      VELOERA,
    )

    await service.listChannels()

    expect(getApiService).toHaveBeenCalledWith(VELOERA)
    expect(listAllChannelsMock).toHaveBeenCalled()
  })
})

describe("ModelSyncService - global and channel filters", () => {
  const baseModels = ["gpt-4o", "gpt-4o-mini", "claude-3", "local-debug-model"]

  const makeRule = (
    partial: Partial<ChannelModelFilterRule>,
  ): ChannelModelFilterRule => ({
    id: partial.id ?? "id",
    name: partial.name ?? "rule",
    pattern: partial.pattern ?? "",
    isRegex: partial.isRegex ?? false,
    action: partial.action ?? "include",
    enabled: partial.enabled ?? true,
    createdAt: partial.createdAt ?? Date.now(),
    updatedAt: partial.updatedAt ?? Date.now(),
    description: partial.description,
  })

  const callApplyFilters = (
    rules: ChannelModelFilterRule[] | null | undefined,
    models: string[],
  ): string[] => {
    const service = new ModelSyncService("https://example.com", "token")
    return (service as any).applyFilters(rules, models)
  }

  it("returns normalized models when no filters are provided", () => {
    const result = callApplyFilters(undefined, [" gpt-4o ", "gpt-4o", ""])
    expect(result).toEqual(["gpt-4o"])
  })

  it("applies include-then-exclude logic correctly", () => {
    const rules: ChannelModelFilterRule[] = [
      makeRule({
        id: "include-openai",
        name: "Include GPT-4 family",
        pattern: "gpt-4o",
        isRegex: false,
        action: "include",
      }),
      makeRule({
        id: "exclude-mini",
        name: "Exclude mini",
        pattern: "mini",
        isRegex: false,
        action: "exclude",
      }),
    ]

    const result = callApplyFilters(rules, baseModels)
    expect(result).toEqual(["gpt-4o"])
  })

  it("supports regex patterns in filters", () => {
    const rules: ChannelModelFilterRule[] = [
      makeRule({
        id: "include-gpt",
        name: "Include GPT*",
        pattern: "^gpt-",
        isRegex: true,
        action: "include",
      }),
    ]

    const result = callApplyFilters(rules, baseModels)
    expect(result.sort()).toEqual(["gpt-4o", "gpt-4o-mini"].sort())
  })

  it("returns an empty result when regex filters are invalid", () => {
    const rules: ChannelModelFilterRule[] = [
      makeRule({
        id: "broken",
        pattern: "[",
        isRegex: true,
        action: "include",
      }),
    ]

    const result = callApplyFilters(rules, baseModels)
    expect(result).toEqual([])
  })
})

describe("ModelSyncService - channel execution", () => {
  it("skips channel updates when the normalized model set is unchanged", async () => {
    fetchChannelModelsMock.mockResolvedValueOnce([" model-b ", "model-a"])

    const service = new ModelSyncService("https://example.com", "token", "1")
    const channel = {
      id: 1,
      name: "Alpha",
      models: "model-a,model-b",
    } as any

    const result = await service.runForChannel(channel, 0)

    expect(result).toMatchObject({
      channelId: 1,
      channelName: "Alpha",
      ok: true,
      oldModels: ["model-a", "model-b"],
      newModels: ["model-b", "model-a"],
      message: "Success",
    })
    expect(updateChannelModelsMock).not.toHaveBeenCalled()
  })

  it("retries failed channel fetches and returns a terminal failure after max retries", async () => {
    vi.useFakeTimers()
    fetchChannelModelsMock.mockRejectedValue(new Error("upstream failed"))

    const service = new ModelSyncService("https://example.com", "token", "1")
    const channel = {
      id: 2,
      name: "Beta",
      models: "gpt-4o",
    } as any

    try {
      const resultPromise = service.runForChannel(channel, 1)
      await vi.runAllTimersAsync()
      const result = await resultPromise

      expect(fetchChannelModelsMock).toHaveBeenCalledTimes(2)
      expect(result).toMatchObject({
        channelId: 2,
        channelName: "Beta",
        ok: false,
        attempts: 2,
        message: "upstream failed",
      })
    } finally {
      vi.useRealTimers()
    }
  })
})

describe("ModelSyncService - batching and mapping", () => {
  it("records failures when a worker throws unexpectedly during batch execution", async () => {
    const service = new ModelSyncService("https://example.com", "token", "1")
    const runForChannelSpy = vi
      .spyOn(service, "runForChannel")
      .mockImplementation(async (channel) => {
        if (channel.id === 2) {
          throw new Error("worker exploded")
        }

        return {
          channelId: channel.id,
          channelName: channel.name,
          ok: true,
          attempts: 0,
          finishedAt: 1,
          message: "Success",
        } as any
      })

    const onProgress = vi.fn()
    const result = await service.runBatch(
      [
        { id: 1, name: "Alpha", models: "" } as any,
        { id: 2, name: "Beta", models: "" } as any,
      ],
      {
        concurrency: 5,
        maxRetries: 0,
        onProgress,
      },
    )

    expect(runForChannelSpy).toHaveBeenCalledTimes(2)
    expect(onProgress).toHaveBeenCalledTimes(2)
    expect(result.statistics).toMatchObject({
      total: 2,
      successCount: 1,
      failureCount: 1,
    })
    expect(result.items).toEqual([
      expect.objectContaining({
        channelId: 1,
        ok: true,
      }),
      expect.objectContaining({
        channelId: 2,
        ok: false,
        attempts: 1,
        message: "worker exploded",
      }),
    ])
  })

  it("merges existing channel models with mapping keys before updating model_mapping", async () => {
    const service = new ModelSyncService("https://example.com", "token", "1")

    await service.updateChannelModelMapping(
      {
        id: 3,
        name: "Gamma",
        models: "gpt-4o,claude-3",
      } as any,
      {
        "gpt-4o": "gpt-4o",
        "deepseek-chat": "deepseek-chat",
      },
    )

    expect(updateChannelModelMappingMock).toHaveBeenCalledWith(
      expect.objectContaining({
        baseUrl: "https://example.com",
        auth: expect.objectContaining({
          authType: "access_token",
          accessToken: "token",
          userId: "1",
        }),
      }),
      3,
      "gpt-4o,claude-3,deepseek-chat",
      JSON.stringify({
        "gpt-4o": "gpt-4o",
        "deepseek-chat": "deepseek-chat",
      }),
    )
  })
})
