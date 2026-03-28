import { beforeEach, describe, expect, it, vi } from "vitest"

import { RuntimeActionIds } from "~/constants/runtimeActions"
import {
  channelConfigStorage,
  handleChannelConfigMessage,
} from "~/services/managedSites/channelConfigStorage"

const storageData = new Map<string, any>()

const { mockSafeRandomUUID } = vi.hoisted(() => ({
  mockSafeRandomUUID: vi.fn(() => "generated-filter-id"),
}))

vi.mock("@plasmohq/storage", () => {
  class Storage {
    async get(key: string) {
      return storageData.get(key)
    }

    async set(key: string, value: any) {
      storageData.set(key, value)
    }
  }

  return { Storage }
})

vi.mock("~/utils/core/identifier", () => ({
  safeRandomUUID: mockSafeRandomUUID,
}))

describe("channelConfigStorage", () => {
  beforeEach(() => {
    storageData.clear()
    vi.clearAllMocks()
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-03-28T05:30:00.000Z"))
  })

  it("returns a default config when a channel has no stored entry", async () => {
    const config = await channelConfigStorage.getConfig(42)

    expect(config.channelId).toBe(42)
    expect(config.modelFilterSettings.rules).toEqual([])
    expect(config.createdAt).toBe(Date.now())
    expect(config.updatedAt).toBe(Date.now())
  })

  it("saves configs with a refreshed updatedAt timestamp", async () => {
    storageData.set("channel_configs", {
      7: {
        channelId: 7,
        createdAt: 10,
        updatedAt: 10,
        modelFilterSettings: {
          rules: [],
          updatedAt: 10,
        },
      },
    })

    const ok = await channelConfigStorage.saveConfig({
      channelId: 9,
      createdAt: 100,
      updatedAt: 100,
      modelFilterSettings: {
        rules: [],
        updatedAt: 100,
      },
    })

    expect(ok).toBe(true)
    expect(storageData.get("channel_configs")).toEqual({
      7: expect.objectContaining({ channelId: 7 }),
      9: expect.objectContaining({
        channelId: 9,
        createdAt: 100,
        updatedAt: Date.now(),
      }),
    })
  })

  it("imports configs by sanitizing invalid keys, legacy filters, and malformed rules", async () => {
    const count = await channelConfigStorage.importConfigs({
      1: {
        createdAt: 5,
        filters: [
          {
            name: " Legacy Include ",
            pattern: "gpt-4o",
            isRegex: false,
            action: "include",
            enabled: true,
          },
          null,
        ],
      },
      2: {
        modelFilterSettings: {
          updatedAt: 0,
          rules: [
            {
              id: " explicit-id ",
              name: " Block Legacy ",
              description: "  trimmed description  ",
              pattern: "^claude",
              isRegex: true,
              action: "exclude",
              enabled: false,
              createdAt: 123,
              updatedAt: 456,
            },
            {
              name: " ",
              pattern: "ignored",
            },
          ],
        },
      },
      broken: {
        createdAt: 1,
      },
      "-3": {
        createdAt: 1,
      },
    })

    expect(count).toBe(2)

    const imported = await channelConfigStorage.getAllConfigs()
    expect(Object.keys(imported)).toEqual(["1", "2"])
    expect(imported[1]).toEqual(
      expect.objectContaining({
        channelId: 1,
        createdAt: 5,
        updatedAt: Date.now(),
        modelFilterSettings: {
          updatedAt: Date.now(),
          rules: [
            expect.objectContaining({
              id: "generated-filter-id",
              name: "Legacy Include",
              pattern: "gpt-4o",
              action: "include",
              enabled: true,
            }),
          ],
        },
      }),
    )
    expect(imported[2].modelFilterSettings.rules).toEqual([
      {
        id: "explicit-id",
        name: "Block Legacy",
        description: "trimmed description",
        pattern: "^claude",
        isRegex: true,
        action: "exclude",
        enabled: false,
        createdAt: 123,
        updatedAt: 456,
      },
    ])
  })

  it("upserts filters while preserving existing createdAt", async () => {
    storageData.set("channel_configs", {
      9: {
        channelId: 9,
        createdAt: 111,
        updatedAt: 222,
        modelFilterSettings: {
          rules: [],
          updatedAt: 222,
        },
      },
    })

    const ok = await channelConfigStorage.upsertFilters(9, [
      {
        id: "rule-1",
        name: "Allow GPT",
        pattern: "gpt",
        isRegex: false,
        action: "include",
        enabled: true,
        createdAt: 50,
        updatedAt: 60,
      },
    ])

    expect(ok).toBe(true)
    expect(storageData.get("channel_configs")[9]).toEqual(
      expect.objectContaining({
        channelId: 9,
        createdAt: 111,
        updatedAt: Date.now(),
        modelFilterSettings: {
          updatedAt: Date.now(),
          rules: [
            expect.objectContaining({
              id: "rule-1",
              name: "Allow GPT",
            }),
          ],
        },
      }),
    )
  })

  it("handles get and upsert runtime messages", async () => {
    const getResponse = vi.fn()
    await handleChannelConfigMessage(
      {
        action: RuntimeActionIds.ChannelConfigGet,
        channelId: 12,
      },
      getResponse,
    )

    expect(getResponse).toHaveBeenCalledWith({
      success: true,
      data: expect.objectContaining({ channelId: 12 }),
    })

    const upsertResponse = vi.fn()
    await handleChannelConfigMessage(
      {
        action: RuntimeActionIds.ChannelConfigUpsertFilters,
        channelId: 12,
        filters: [
          {
            name: " Include GPT ",
            pattern: "gpt",
            isRegex: false,
            enabled: true,
          },
        ],
      },
      upsertResponse,
    )

    expect(upsertResponse).toHaveBeenCalledWith({
      success: true,
      data: [
        expect.objectContaining({
          id: "generated-filter-id",
          name: "Include GPT",
          pattern: "gpt",
          action: "include",
          enabled: true,
        }),
      ],
    })
  })

  it("rejects invalid message payloads and unknown actions", async () => {
    const invalidIdResponse = vi.fn()
    await handleChannelConfigMessage(
      {
        action: RuntimeActionIds.ChannelConfigGet,
        channelId: 0,
      },
      invalidIdResponse,
    )
    expect(invalidIdResponse).toHaveBeenCalledWith({
      success: false,
      error: "channelId is required",
    })

    const invalidRegexResponse = vi.fn()
    await handleChannelConfigMessage(
      {
        action: RuntimeActionIds.ChannelConfigUpsertFilters,
        channelId: 12,
        filters: [
          {
            name: "Broken Regex",
            pattern: "[",
            isRegex: true,
          },
        ],
      },
      invalidRegexResponse,
    )
    expect(invalidRegexResponse).toHaveBeenCalledWith({
      success: false,
      error: expect.stringContaining("Invalid regex pattern"),
    })

    const unknownActionResponse = vi.fn()
    await handleChannelConfigMessage(
      { action: "channelConfig:unknown" },
      unknownActionResponse,
    )
    expect(unknownActionResponse).toHaveBeenCalledWith({
      success: false,
      error: "Unknown action",
    })
  })
})
