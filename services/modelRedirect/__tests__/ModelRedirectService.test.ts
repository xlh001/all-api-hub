/**
 * Unit tests for ModelRedirectService
 */

import { describe, it, expect, beforeEach } from "vitest"

import {
  DEFAULT_MODEL_REDIRECT_PREFERENCES,
  type ChannelCandidate,
  type ModelRedirectPreferences
} from "~/types"
import { createModelRedirectService } from "../ModelRedirectService"

describe("ModelRedirectService", () => {
  let preferences: ModelRedirectPreferences

  beforeEach(() => {
    preferences = {
      ...DEFAULT_MODEL_REDIRECT_PREFERENCES,
      enabled: true,
      standardModels: ["gpt-4o"],
      dev: { useMockData: true }
    }
  })

  describe("ranking logic", () => {
    it("should rank by priority first (L1)", async () => {
      const service = createModelRedirectService(preferences)

      // Create mock candidates with different priorities
      const candidates: ChannelCandidate[] = [
        {
          channelId: 1,
          channelName: "Low Priority",
          model: "gpt-4o",
          priority: 1,
          weight: 5,
          weightLevel: 5,
          usedQuota: 0,
          status: 1
        },
        {
          channelId: 2,
          channelName: "High Priority",
          model: "gpt-4o",
          priority: 10,
          weight: 5,
          weightLevel: 5,
          usedQuota: 0,
          status: 1
        }
      ]

      const ranked = (service as any).rankCandidates(candidates)

      expect(ranked[0].channelId).toBe(2) // High priority wins
      expect(ranked[1].channelId).toBe(1)
    })

    it("should use weight level when priority is near-equal (L2)", async () => {
      const service = createModelRedirectService({
        ...preferences,
        scoring: {
          ...preferences.scoring,
          epsilonP: 1
        }
      })

      const candidates: ChannelCandidate[] = [
        {
          channelId: 1,
          channelName: "Low Weight",
          model: "gpt-4o",
          priority: 10,
          weight: 2,
          weightLevel: 2,
          usedQuota: 0,
          status: 1
        },
        {
          channelId: 2,
          channelName: "High Weight",
          model: "gpt-4o",
          priority: 10,
          weight: 5,
          weightLevel: 5,
          usedQuota: 0,
          status: 1
        }
      ]

      const ranked = (service as any).rankCandidates(candidates)

      expect(ranked[0].channelId).toBe(2) // High weight wins
      expect(ranked[1].channelId).toBe(1)
    })

    it("should use used quota adjustment when priority and weight are equal (L3)", async () => {
      const service = createModelRedirectService(preferences)

      const candidates: ChannelCandidate[] = [
        {
          channelId: 1,
          channelName: "High Usage",
          model: "gpt-4o",
          priority: 10,
          weight: 5,
          weightLevel: 5,
          usedQuota: 100000,
          status: 1
        },
        {
          channelId: 2,
          channelName: "Low Usage",
          model: "gpt-4o",
          priority: 10,
          weight: 5,
          weightLevel: 5,
          usedQuota: 1000,
          status: 1
        }
      ]

      const ranked = (service as any).rankCandidates(candidates)

      expect(ranked[0].channelId).toBe(2) // Low usage wins
      expect(ranked[1].channelId).toBe(1)
    })

    it("should not let used quota override higher layers", async () => {
      const service = createModelRedirectService(preferences)

      const candidates: ChannelCandidate[] = [
        {
          channelId: 1,
          channelName: "High Priority, High Usage",
          model: "gpt-4o",
          priority: 10,
          weight: 5,
          weightLevel: 5,
          usedQuota: 500000, // Very high
          status: 1
        },
        {
          channelId: 2,
          channelName: "Low Priority, Low Usage",
          model: "gpt-4o",
          priority: 1,
          weight: 5,
          weightLevel: 5,
          usedQuota: 0, // Zero usage
          status: 1
        }
      ]

      const ranked = (service as any).rankCandidates(candidates)

      // High priority should still win despite high usage
      expect(ranked[0].channelId).toBe(1)
      expect(ranked[1].channelId).toBe(2)
    })

    it("should respect epsilon threshold for priority", async () => {
      const service = createModelRedirectService({
        ...preferences,
        scoring: {
          ...preferences.scoring,
          epsilonP: 2 // Allow priority differences up to 2
        }
      })

      const candidates: ChannelCandidate[] = [
        {
          channelId: 1,
          channelName: "Priority 10, Weight 3",
          model: "gpt-4o",
          priority: 10,
          weight: 3,
          weightLevel: 3,
          usedQuota: 0,
          status: 1
        },
        {
          channelId: 2,
          channelName: "Priority 11, Weight 5",
          model: "gpt-4o",
          priority: 11, // Within epsilon (11 - 10 = 1 <= 2)
          weight: 5,
          weightLevel: 5,
          usedQuota: 0,
          status: 1
        }
      ]

      const ranked = (service as any).rankCandidates(candidates)

      // Weight should decide since priorities are within epsilon
      expect(ranked[0].channelId).toBe(2)
      expect(ranked[1].channelId).toBe(1)
    })

    it("should handle tie-breakers with date tokens", async () => {
      const service = createModelRedirectService(preferences)

      const candidates: ChannelCandidate[] = [
        {
          channelId: 1,
          channelName: "Older Model",
          model: "gpt-4o-20240101",
          priority: 10,
          weight: 5,
          weightLevel: 5,
          usedQuota: 0,
          status: 1,
          dateToken: "20240101"
        },
        {
          channelId: 2,
          channelName: "Newer Model",
          model: "gpt-4o-20240701",
          priority: 10,
          weight: 5,
          weightLevel: 5,
          usedQuota: 0,
          status: 1,
          dateToken: "20240701"
        }
      ]

      const ranked = (service as any).rankCandidates(candidates)

      // Newer date should win
      expect(ranked[0].channelId).toBe(2)
      expect(ranked[1].channelId).toBe(1)
    })
  })

  describe("standard model suggestions", () => {
    it("should return preset models plus configured models", () => {
      const service = createModelRedirectService({
        ...preferences,
        standardModels: ["custom-model-1"]
      })

      const suggestions = service.getStandardModelSuggestions()

      expect(suggestions).toContain("gpt-4o")
      expect(suggestions).toContain("claude-3-7-sonnet")
      expect(suggestions).toContain("custom-model-1")
    })
  })
})
