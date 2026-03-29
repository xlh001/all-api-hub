import { describe, expect, it } from "vitest"

import {
  MANAGED_SITE_CHANNEL_KEY_MATCH_REASONS,
  MANAGED_SITE_CHANNEL_MATCH_LEVELS,
  MANAGED_SITE_CHANNEL_MATCH_REASONS,
  MANAGED_SITE_CHANNEL_MODEL_SIMILARITY_THRESHOLD,
  MANAGED_SITE_CHANNEL_MODELS_MATCH_REASONS,
} from "~/services/managedSites/channelMatch"
import {
  findBestManagedSiteChannelMatch,
  findManagedSiteChannelByComparableInputs,
  findManagedSiteChannelsByBaseUrl,
  findManagedSiteChannelsByBaseUrlAndModels,
  inspectManagedSiteChannelKeyMatch,
  inspectManagedSiteChannelModelsMatch,
} from "~/services/managedSites/utils/channelMatching"
import { buildManagedSiteChannel } from "~~/tests/test-utils/factories"

describe("channelMatching", () => {
  it("normalizes OpenAI-family base URLs before filtering the URL bucket", () => {
    const matchingChannel = buildManagedSiteChannel({
      id: 0,
      base_url: "https://api.example.com/v1/",
    })

    const result = findManagedSiteChannelsByBaseUrl({
      channels: [
        matchingChannel,
        buildManagedSiteChannel({
          id: 101,
          base_url: "https://other.example.com",
        }),
      ],
      accountBaseUrl: "https://api.example.com",
    })

    expect(result).toEqual([matchingChannel])
  })

  it("dedupes stored channel models before comparing comparable inputs", () => {
    const channels = [
      buildManagedSiteChannel({
        id: 1,
        base_url: "https://api.example.com",
        models: "gpt-4,gpt-4",
      }),
    ]

    const result = findManagedSiteChannelsByBaseUrlAndModels({
      channels,
      accountBaseUrl: "https://api.example.com",
      models: ["gpt-4"],
    })

    expect(result).toEqual(channels)
  })

  it("finds comparable channels by split key candidates and treats keyless lookups as URL+models matches", () => {
    const firstComparableChannel = buildManagedSiteChannel({
      id: 1_1,
      base_url: "https://api.example.com",
      models: "gpt-4",
      key: "",
    })
    const keyedComparableChannel = buildManagedSiteChannel({
      id: 1_2,
      base_url: "https://api.example.com",
      models: "gpt-4",
      key: "first-key,\nsecond-key",
    })

    expect(
      findManagedSiteChannelByComparableInputs({
        channels: [firstComparableChannel, keyedComparableChannel],
        accountBaseUrl: "https://api.example.com",
        models: ["gpt-4"],
      }),
    ).toBe(firstComparableChannel)

    expect(
      findManagedSiteChannelByComparableInputs({
        channels: [firstComparableChannel, keyedComparableChannel],
        accountBaseUrl: "https://api.example.com",
        models: ["gpt-4"],
        key: "second-key",
      }),
    ).toBe(keyedComparableChannel)
  })

  it("reports key comparison as unavailable when no key is provided", () => {
    const result = inspectManagedSiteChannelKeyMatch({
      channels: [],
      accountBaseUrl: "https://api.example.com",
      key: "   ",
    })

    expect(result).toEqual({
      comparable: false,
      matched: false,
      reason: MANAGED_SITE_CHANNEL_KEY_MATCH_REASONS.NO_KEY_PROVIDED,
      channel: null,
    })
  })

  it("reuses an exact channel shortcut for key and models assessments", () => {
    const exactChannel = buildManagedSiteChannel({
      id: 1_3,
      base_url: "https://api.example.com",
      models: "gpt-4",
      key: "exact-key",
    })

    expect(
      inspectManagedSiteChannelKeyMatch({
        channels: [],
        accountBaseUrl: "https://api.example.com",
        key: "exact-key",
        exactChannel,
      }),
    ).toEqual({
      comparable: true,
      matched: true,
      reason: MANAGED_SITE_CHANNEL_KEY_MATCH_REASONS.MATCHED,
      channel: exactChannel,
    })

    expect(
      inspectManagedSiteChannelModelsMatch({
        channels: [],
        accountBaseUrl: "https://api.example.com",
        models: ["gpt-4"],
        exactChannel,
      }),
    ).toEqual({
      comparable: true,
      matched: true,
      reason: MANAGED_SITE_CHANNEL_MODELS_MATCH_REASONS.EXACT,
      channel: exactChannel,
      similarityScore: 1,
    })
  })

  it("distinguishes missing comparable keys from comparable key mismatches", () => {
    const urlOnlyChannel = buildManagedSiteChannel({
      id: 1_4,
      base_url: "https://api.example.com",
      models: "gpt-4",
      key: "",
    })
    const keyedChannel = buildManagedSiteChannel({
      id: 1_5,
      base_url: "https://api.example.com",
      models: "gpt-4",
      key: "existing-key",
    })

    expect(
      inspectManagedSiteChannelKeyMatch({
        channels: [urlOnlyChannel],
        accountBaseUrl: "https://api.example.com",
        key: "wanted-key",
      }),
    ).toEqual({
      comparable: false,
      matched: false,
      reason: MANAGED_SITE_CHANNEL_KEY_MATCH_REASONS.COMPARISON_UNAVAILABLE,
      channel: null,
    })

    expect(
      inspectManagedSiteChannelKeyMatch({
        channels: [keyedChannel],
        accountBaseUrl: "https://api.example.com",
        key: "wanted-key",
      }),
    ).toEqual({
      comparable: true,
      matched: false,
      reason: MANAGED_SITE_CHANNEL_KEY_MATCH_REASONS.NO_MATCH,
      channel: null,
    })
  })

  it("treats missing model filters and missing URL buckets as non-comparable model assessments", () => {
    expect(
      inspectManagedSiteChannelModelsMatch({
        channels: [],
        accountBaseUrl: "https://api.example.com",
        models: [],
      }),
    ).toEqual({
      comparable: false,
      matched: false,
      reason: MANAGED_SITE_CHANNEL_MODELS_MATCH_REASONS.NO_MODELS_PROVIDED,
      channel: null,
    })

    expect(
      inspectManagedSiteChannelModelsMatch({
        channels: [
          buildManagedSiteChannel({
            id: 1_6,
            base_url: "https://different.example.com",
            models: "gpt-4",
          }),
        ],
        accountBaseUrl: "https://api.example.com",
        models: ["gpt-4"],
      }),
    ).toEqual({
      comparable: false,
      matched: false,
      reason: MANAGED_SITE_CHANNEL_MODELS_MATCH_REASONS.COMPARISON_UNAVAILABLE,
      channel: null,
    })
  })

  it("reports URL-only fallback as a non-match for model assessment", () => {
    const result = inspectManagedSiteChannelModelsMatch({
      channels: [
        buildManagedSiteChannel({
          id: 1_7,
          base_url: "https://api.example.com",
          models: "",
        }),
      ],
      accountBaseUrl: "https://api.example.com",
      models: ["gpt-4"],
    })

    expect(result).toEqual({
      comparable: true,
      matched: false,
      reason: MANAGED_SITE_CHANNEL_MODELS_MATCH_REASONS.NO_MATCH,
      channel: null,
    })
  })

  it("ranks an exact model-set match as secondary when the URL bucket matches", () => {
    const channel = buildManagedSiteChannel({
      id: 2,
      base_url: "https://api.example.com",
      models: "gpt-4,gpt-4o-mini",
    })

    const result = findBestManagedSiteChannelMatch({
      channels: [channel],
      accountBaseUrl: "https://api.example.com",
      models: ["gpt-4", "gpt-4o-mini"],
    })

    expect(result).toEqual({
      level: MANAGED_SITE_CHANNEL_MATCH_LEVELS.SECONDARY,
      reason: MANAGED_SITE_CHANNEL_MATCH_REASONS.URL_MODELS_EXACT,
      channel,
      similarityScore: 1,
    })
  })

  it("prefers model containment over weaker similarity within the same URL bucket", () => {
    const containedChannel = buildManagedSiteChannel({
      id: 3,
      base_url: "https://api.example.com",
      models: "gpt-4,gpt-4o-mini,gpt-4.1",
    })
    const similarChannel = buildManagedSiteChannel({
      id: 4,
      base_url: "https://api.example.com",
      models: "gpt-4,gpt-4.1",
    })

    const result = findBestManagedSiteChannelMatch({
      channels: [similarChannel, containedChannel],
      accountBaseUrl: "https://api.example.com",
      models: ["gpt-4", "gpt-4o-mini"],
    })

    expect(result.level).toBe(MANAGED_SITE_CHANNEL_MATCH_LEVELS.SECONDARY)
    expect(result.reason).toBe(
      MANAGED_SITE_CHANNEL_MATCH_REASONS.URL_MODELS_CONTAINED,
    )
    expect(result.channel?.id).toBe(containedChannel.id)
  })

  it("falls back to a similarity-based secondary match when equality and containment fail", () => {
    const similarChannel = buildManagedSiteChannel({
      id: 5,
      base_url: "https://api.example.com",
      models: "gpt-4,gpt-4o,claude-3",
    })

    const result = findBestManagedSiteChannelMatch({
      channels: [similarChannel],
      accountBaseUrl: "https://api.example.com",
      models: ["gpt-4", "gpt-4o", "gemini-2.0"],
    })

    expect(result.level).toBe(MANAGED_SITE_CHANNEL_MATCH_LEVELS.SECONDARY)
    expect(result.reason).toBe(
      MANAGED_SITE_CHANNEL_MATCH_REASONS.URL_MODELS_SIMILAR,
    )
    expect(result.channel?.id).toBe(similarChannel.id)
    expect(result.similarityScore).toBeCloseTo(0.5)
  })

  it("keeps a similarity score exactly at the configured threshold as a secondary match", () => {
    const thresholdChannel = buildManagedSiteChannel({
      id: 5_1,
      base_url: "https://api.example.com",
      models: "gpt-4,gpt-4o,claude-3",
    })

    const result = findBestManagedSiteChannelMatch({
      channels: [thresholdChannel],
      accountBaseUrl: "https://api.example.com",
      models: ["gpt-4", "gpt-4o", "gemini-2.0"],
    })

    expect(result.level).toBe(MANAGED_SITE_CHANNEL_MATCH_LEVELS.SECONDARY)
    expect(result.reason).toBe(
      MANAGED_SITE_CHANNEL_MATCH_REASONS.URL_MODELS_SIMILAR,
    )
    expect(result.channel?.id).toBe(thresholdChannel.id)
    expect(result.similarityScore).toBe(
      MANAGED_SITE_CHANNEL_MODEL_SIMILARITY_THRESHOLD,
    )
  })

  it("keeps similarity scores below the configured threshold in fuzzy URL-only fallback", () => {
    const belowThresholdChannel = buildManagedSiteChannel({
      id: 5_2,
      base_url: "https://api.example.com",
      models: "gpt-4,gpt-4o,claude-3,deepseek-r1",
    })

    const result = findBestManagedSiteChannelMatch({
      channels: [belowThresholdChannel],
      accountBaseUrl: "https://api.example.com",
      models: ["gpt-4", "gpt-4o", "gemini-2.0"],
    })

    expect(result.level).toBe(MANAGED_SITE_CHANNEL_MATCH_LEVELS.FUZZY)
    expect(result.reason).toBe(MANAGED_SITE_CHANNEL_MATCH_REASONS.URL_ONLY)
    expect(result.channel?.id).toBe(belowThresholdChannel.id)
  })

  it("breaks similar-match ties by choosing the closer model-count candidate", () => {
    const closerSimilarChannel = buildManagedSiteChannel({
      id: 5_3,
      base_url: "https://api.example.com",
      models: "gpt-4,gpt-4o,claude-3",
    })
    const widerSimilarChannel = buildManagedSiteChannel({
      id: 5_4,
      base_url: "https://api.example.com",
      models: "gpt-4,gpt-4o,claude-3,deepseek-r1,gemini-1.5",
    })

    const result = findBestManagedSiteChannelMatch({
      channels: [widerSimilarChannel, closerSimilarChannel],
      accountBaseUrl: "https://api.example.com",
      models: ["gpt-4", "gpt-4o", "gemini-2.0"],
    })

    expect(result.level).toBe(MANAGED_SITE_CHANNEL_MATCH_LEVELS.SECONDARY)
    expect(result.reason).toBe(
      MANAGED_SITE_CHANNEL_MATCH_REASONS.URL_MODELS_SIMILAR,
    )
    expect(result.channel?.id).toBe(closerSimilarChannel.id)
    expect(result.similarityScore).toBe(
      MANAGED_SITE_CHANNEL_MODEL_SIMILARITY_THRESHOLD,
    )
  })

  it("keeps the first ranked candidate when similarity ties are otherwise identical", () => {
    const firstChannel = buildManagedSiteChannel({
      id: 5_5,
      base_url: "https://api.example.com",
      models: "gpt-4,gpt-4o,claude-3",
    })
    const secondChannel = buildManagedSiteChannel({
      id: 5_6,
      base_url: "https://api.example.com",
      models: "gpt-4,gpt-4o,claude-3",
    })

    const result = findBestManagedSiteChannelMatch({
      channels: [firstChannel, secondChannel],
      accountBaseUrl: "https://api.example.com",
      models: ["gpt-4", "gpt-4o", "gemini-2.0"],
    })

    expect(result.channel?.id).toBe(firstChannel.id)
  })

  it("falls back to a fuzzy URL-only match when no ranked model match exists", () => {
    const fuzzyChannel = buildManagedSiteChannel({
      id: 6,
      base_url: "https://api.example.com",
      models: "claude-3",
    })

    const result = findBestManagedSiteChannelMatch({
      channels: [fuzzyChannel],
      accountBaseUrl: "https://api.example.com",
      models: ["gpt-4"],
    })

    expect(result).toEqual({
      level: MANAGED_SITE_CHANNEL_MATCH_LEVELS.FUZZY,
      reason: MANAGED_SITE_CHANNEL_MATCH_REASONS.URL_ONLY,
      channel: fuzzyChannel,
    })
  })

  it("returns unresolved when no normalized URL bucket exists", () => {
    const result = findBestManagedSiteChannelMatch({
      channels: [
        buildManagedSiteChannel({
          id: 7,
          base_url: "https://different.example.com",
          models: "gpt-4",
        }),
      ],
      accountBaseUrl: "https://api.example.com/v1/openai",
      models: ["gpt-4"],
    })

    expect(result).toEqual({
      level: MANAGED_SITE_CHANNEL_MATCH_LEVELS.NONE,
      reason: MANAGED_SITE_CHANNEL_MATCH_REASONS.UNRESOLVED,
      channel: null,
    })
  })
})
