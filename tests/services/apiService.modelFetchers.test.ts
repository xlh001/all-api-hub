import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  fetchApi: vi.fn(),
  anthropicLogger: {
    error: vi.fn(),
  },
  googleLogger: {
    error: vi.fn(),
  },
}))

vi.mock("~/services/apiService/common/utils", () => ({
  fetchApi: mocks.fetchApi,
}))

vi.mock("~/utils/core/logger", () => ({
  createLogger: (scope: string) =>
    scope === "ApiService.Anthropic"
      ? mocks.anthropicLogger
      : mocks.googleLogger,
}))

describe("apiService model fetchers", () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  describe("fetchAnthropicModelIds", () => {
    it("paginates, de-duplicates ids, and stops when pagination metadata ends", async () => {
      mocks.fetchApi
        .mockResolvedValueOnce({
          data: [{ id: "claude-3-5-sonnet" }, { id: "claude-3-5-sonnet" }],
          has_more: true,
          last_id: "cursor-1",
        })
        .mockResolvedValueOnce({
          data: [{ id: "claude-3-7-sonnet" }, { id: 123 }, {}],
          has_more: false,
          last_id: "cursor-2",
        })

      const { fetchAnthropicModelIds } = await import(
        "~/services/apiService/anthropic"
      )

      await expect(
        fetchAnthropicModelIds({
          baseUrl: "https://api.anthropic.com",
          apiKey: "sk-anthropic",
        }),
      ).resolves.toEqual(["claude-3-5-sonnet", "claude-3-7-sonnet"])

      expect(mocks.fetchApi).toHaveBeenNthCalledWith(
        1,
        {
          baseUrl: "https://api.anthropic.com",
          auth: { authType: "none" },
        },
        expect.objectContaining({
          endpoint: "/v1/models?limit=200",
          options: {
            headers: {
              "x-api-key": "sk-anthropic",
              "anthropic-version": "2023-06-01",
            },
          },
        }),
        true,
      )
      expect(mocks.fetchApi).toHaveBeenNthCalledWith(
        2,
        expect.anything(),
        expect.objectContaining({
          endpoint: "/v1/models?limit=200&after_id=cursor-1",
        }),
        true,
      )
    })

    it("stops when the next cursor repeats to avoid an infinite loop", async () => {
      mocks.fetchApi.mockResolvedValueOnce({
        data: [{ id: "claude-3-opus" }],
        has_more: true,
        last_id: "",
      })

      const { fetchAnthropicModelIds } = await import(
        "~/services/apiService/anthropic"
      )

      await expect(
        fetchAnthropicModelIds({
          baseUrl: "https://api.anthropic.com",
          apiKey: "sk-anthropic",
        }),
      ).resolves.toEqual(["claude-3-opus"])

      expect(mocks.fetchApi).toHaveBeenCalledTimes(1)
    })

    it("logs and rethrows API failures", async () => {
      const failure = new Error("anthropic down")
      mocks.fetchApi.mockRejectedValueOnce(failure)

      const { fetchAnthropicModelIds } = await import(
        "~/services/apiService/anthropic"
      )

      await expect(
        fetchAnthropicModelIds({
          baseUrl: "https://api.anthropic.com",
          apiKey: "sk-anthropic",
        }),
      ).rejects.toThrow("anthropic down")

      expect(mocks.anthropicLogger.error).toHaveBeenCalledWith(
        "Failed to fetch anthropic model list",
        expect.objectContaining({
          endpoint: "/v1/models?limit=200",
          error: failure,
        }),
      )
    })

    it("caps anthropic pagination once the model limit is reached", async () => {
      mocks.fetchApi.mockResolvedValueOnce({
        data: Array.from({ length: 2000 }, (_, index) => ({
          id: `claude-${index}`,
        })),
        has_more: true,
        last_id: "cursor-2000",
      })

      const { fetchAnthropicModelIds } = await import(
        "~/services/apiService/anthropic"
      )

      const result = await fetchAnthropicModelIds({
        baseUrl: "https://api.anthropic.com",
        apiKey: "sk-anthropic",
      })

      expect(result).toHaveLength(2000)
      expect(result[0]).toBe("claude-0")
      expect(result[1999]).toBe("claude-1999")
      expect(mocks.fetchApi).toHaveBeenCalledTimes(1)
    })
  })

  describe("fetchGoogleModelIds", () => {
    it("normalizes models/* names, de-duplicates results, and follows page tokens", async () => {
      mocks.fetchApi
        .mockResolvedValueOnce({
          models: [
            { name: "models/gemini-2.5-pro" },
            { name: "models/gemini-2.5-pro" },
            { name: "gemini-1.5-flash" },
          ],
          nextPageToken: "page-2",
        })
        .mockResolvedValueOnce({
          models: [{ name: "models/gemini-2.5-flash" }, { name: null }],
          nextPageToken: "",
        })

      const { fetchGoogleModelIds } = await import(
        "~/services/apiService/google"
      )

      await expect(
        fetchGoogleModelIds({
          baseUrl: "https://generativelanguage.googleapis.com",
          apiKey: "AIza-secret",
        }),
      ).resolves.toEqual([
        "gemini-2.5-pro",
        "gemini-1.5-flash",
        "gemini-2.5-flash",
      ])

      expect(mocks.fetchApi).toHaveBeenNthCalledWith(
        1,
        {
          baseUrl: "https://generativelanguage.googleapis.com",
          auth: { authType: "none" },
        },
        expect.objectContaining({
          endpoint: "/v1beta/models",
          options: {
            headers: {
              "x-goog-api-key": "AIza-secret",
            },
          },
        }),
        true,
      )
      expect(mocks.fetchApi).toHaveBeenNthCalledWith(
        2,
        expect.anything(),
        expect.objectContaining({
          endpoint: "/v1beta/models?pageToken=page-2",
        }),
        true,
      )
    })

    it("stops when the next page token repeats", async () => {
      mocks.fetchApi
        .mockResolvedValueOnce({
          models: [{ name: "models/gemini-2.0-flash" }],
          nextPageToken: "same-token",
        })
        .mockResolvedValueOnce({
          models: [{ name: "models/gemini-2.0-flash" }],
          nextPageToken: "same-token",
        })

      const { fetchGoogleModelIds } = await import(
        "~/services/apiService/google"
      )

      await expect(
        fetchGoogleModelIds({
          baseUrl: "https://generativelanguage.googleapis.com",
          apiKey: "AIza-secret",
        }),
      ).resolves.toEqual(["gemini-2.0-flash"])

      expect(mocks.fetchApi).toHaveBeenCalledTimes(2)
    })

    it("logs and rethrows Google API failures", async () => {
      const failure = new Error("google down")
      mocks.fetchApi.mockRejectedValueOnce(failure)

      const { fetchGoogleModelIds } = await import(
        "~/services/apiService/google"
      )

      await expect(
        fetchGoogleModelIds({
          baseUrl: "https://generativelanguage.googleapis.com",
          apiKey: "AIza-secret",
        }),
      ).rejects.toThrow("google down")

      expect(mocks.googleLogger.error).toHaveBeenCalledWith(
        "Failed to fetch google model list",
        expect.objectContaining({
          endpoint: "/v1beta/models",
          error: failure,
        }),
      )
    })

    it("caps Google pagination once the model limit is reached", async () => {
      mocks.fetchApi.mockResolvedValueOnce({
        models: Array.from({ length: 2000 }, (_, index) => ({
          name: `models/gemini-${index}`,
        })),
        nextPageToken: "page-2",
      })

      const { fetchGoogleModelIds } = await import(
        "~/services/apiService/google"
      )

      const result = await fetchGoogleModelIds({
        baseUrl: "https://generativelanguage.googleapis.com",
        apiKey: "AIza-secret",
      })

      expect(result).toHaveLength(2000)
      expect(result[0]).toBe("gemini-0")
      expect(result[1999]).toBe("gemini-1999")
      expect(mocks.fetchApi).toHaveBeenCalledTimes(1)
    })
  })
})
