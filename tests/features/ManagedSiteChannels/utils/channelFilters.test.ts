import { beforeEach, describe, expect, it, vi } from "vitest"

import { RuntimeActionIds } from "~/constants/runtimeActions"
import {
  fetchChannelFilters,
  saveChannelFilters,
} from "~/features/ManagedSiteChannels/utils/channelFilters"
import type { ChannelModelFilterRule } from "~/types/channelModelFilters"

const { mockSendRuntimeMessage, mockGetConfig, mockUpsertFilters, mockWarn } =
  vi.hoisted(() => ({
    mockSendRuntimeMessage: vi.fn(),
    mockGetConfig: vi.fn(),
    mockUpsertFilters: vi.fn(),
    mockWarn: vi.fn(),
  }))

vi.mock("~/utils/browser/browserApi", () => ({
  sendRuntimeMessage: mockSendRuntimeMessage,
}))

vi.mock("~/services/managedSites/channelConfigStorage", () => ({
  channelConfigStorage: {
    getConfig: mockGetConfig,
    upsertFilters: mockUpsertFilters,
  },
}))

vi.mock("~/utils/core/logger", () => ({
  createLogger: () => ({
    warn: mockWarn,
  }),
}))

const sampleRules: ChannelModelFilterRule[] = [
  {
    id: "rule-1",
    name: "Allow GPT",
    pattern: "gpt",
    isRegex: false,
    action: "include",
    enabled: true,
    createdAt: 100,
    updatedAt: 200,
  },
]

describe("channelFilters", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns runtime-backed filter rules when the background responds successfully", async () => {
    mockSendRuntimeMessage.mockResolvedValue({
      success: true,
      data: {
        modelFilterSettings: {
          rules: sampleRules,
        },
      },
    })

    await expect(fetchChannelFilters(9)).resolves.toEqual(sampleRules)

    expect(mockSendRuntimeMessage).toHaveBeenCalledWith({
      action: RuntimeActionIds.ChannelConfigGet,
      channelId: 9,
    })
    expect(mockGetConfig).not.toHaveBeenCalled()
  })

  it("falls back to local storage when runtime loading fails", async () => {
    mockSendRuntimeMessage.mockResolvedValue({
      success: false,
      error: "runtime unavailable",
    })
    mockGetConfig.mockResolvedValue({
      modelFilterSettings: {
        rules: sampleRules,
      },
    })

    await expect(fetchChannelFilters(11)).resolves.toEqual(sampleRules)

    expect(mockGetConfig).toHaveBeenCalledWith(11)
    expect(mockWarn).toHaveBeenCalledTimes(1)
  })

  it("saves through the runtime handler when available", async () => {
    mockSendRuntimeMessage.mockResolvedValue({ success: true })

    await expect(saveChannelFilters(15, sampleRules)).resolves.toBeUndefined()

    expect(mockSendRuntimeMessage).toHaveBeenCalledWith({
      action: RuntimeActionIds.ChannelConfigUpsertFilters,
      channelId: 15,
      filters: sampleRules,
    })
    expect(mockUpsertFilters).not.toHaveBeenCalled()
  })

  it("falls back to local persistence when runtime saving fails", async () => {
    mockSendRuntimeMessage.mockRejectedValue(new Error("no runtime"))
    mockUpsertFilters.mockResolvedValue(true)

    await expect(saveChannelFilters(19, sampleRules)).resolves.toBeUndefined()

    expect(mockUpsertFilters).toHaveBeenCalledWith(19, sampleRules)
    expect(mockWarn).toHaveBeenCalledTimes(1)
  })

  it("throws when both runtime and local persistence fail", async () => {
    mockSendRuntimeMessage.mockResolvedValue({
      success: false,
      error: "save rejected",
    })
    mockUpsertFilters.mockResolvedValue(false)

    await expect(saveChannelFilters(21, sampleRules)).rejects.toThrow(
      "Failed to persist filters locally",
    )

    expect(mockUpsertFilters).toHaveBeenCalledWith(21, sampleRules)
  })
})
