import { describe, expect, it } from "vitest"

import {
  extractApiCheckCredentialsFromText,
  normalizeApiCheckBaseUrl,
  normalizeGoogleFamilyBaseUrl,
  normalizeOpenAiFamilyBaseUrl,
} from "~/services/verification/webAiApiCheck/extractCredentials"

describe("webAiApiCheck extractCredentials", () => {
  it("normalizes loose base urls by trimming wrappers, adding https, and dropping query fragments", () => {
    expect(
      normalizeApiCheckBaseUrl(
        "  ('proxy.example.com/api/v1/models?x=1#hash'), ",
      ),
    ).toBe("https://proxy.example.com/api/v1/models")
  })

  it("strips provider-specific version segments while preserving deployment subpaths", () => {
    expect(
      normalizeOpenAiFamilyBaseUrl(
        "https://proxy.example.com/gateway/api/v1/chat/completions",
      ),
    ).toBe("https://proxy.example.com/gateway/api")

    expect(
      normalizeOpenAiFamilyBaseUrl("https://proxy.example.com/gateway/api"),
    ).toBe("https://proxy.example.com/gateway/api")

    expect(
      normalizeGoogleFamilyBaseUrl(
        "https://proxy.example.com/gateway/api/v1beta/models",
      ),
    ).toBe("https://proxy.example.com/gateway/api")

    expect(normalizeOpenAiFamilyBaseUrl("not a valid url")).toBeNull()
  })

  it("returns an empty extraction result for blank text", () => {
    expect(extractApiCheckCredentialsFromText("   ")).toEqual({
      baseUrlCandidates: [],
      apiKeyCandidates: [],
      baseUrl: null,
      apiKey: null,
    })
  })

  it("prioritizes labeled urls, deduplicates generic repeats, and captures multiple provider keys", () => {
    const text = `
      endpoint=https://proxy.example.com/api/v1/chat/completions
      curl https://proxy.example.com/api/v1/chat/completions
      Authorization: Bearer sk-abcdefghijklmno
      google_key=AIzaabcdefghijklmno12345
    `

    expect(extractApiCheckCredentialsFromText(text)).toEqual({
      baseUrlCandidates: [
        "https://proxy.example.com/api",
        "https://proxy.example.com/api/v1/chat/completions",
      ],
      apiKeyCandidates: ["sk-abcdefghijklmno", "AIzaabcdefghijklmno12345"],
      baseUrl: "https://proxy.example.com/api",
      apiKey: "sk-abcdefghijklmno",
    })
  })

  it("adds a google-normalized candidate when v1beta urls are extracted from labeled config", () => {
    const text = `
      proxy_url=https://proxy.example.com/api/v1beta/models
      https://proxy.example.com/api/v1beta/models
    `

    expect(extractApiCheckCredentialsFromText(text)).toEqual({
      baseUrlCandidates: [
        "https://proxy.example.com/api",
        "https://proxy.example.com/api/v1beta/models",
      ],
      apiKeyCandidates: [],
      baseUrl: "https://proxy.example.com/api",
      apiKey: null,
    })
  })

  it("ignores invalid labeled values and falls back to plain provider token matches", () => {
    const text = `
      baseURL=[]
      Authorization: Bearer []
      secret=[]
      plain sk-zyxwvutsrqponmlk
      extra AIza1234567890abcdefghij
    `

    expect(extractApiCheckCredentialsFromText(text)).toEqual({
      baseUrlCandidates: [],
      apiKeyCandidates: ["sk-zyxwvutsrqponmlk", "AIza1234567890abcdefghij"],
      baseUrl: null,
      apiKey: "sk-zyxwvutsrqponmlk",
    })
  })
})
