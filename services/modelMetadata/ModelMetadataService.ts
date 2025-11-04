import { Storage } from "@plasmohq/storage"

import { normalizeModelName, stripVendorPrefix } from "~/utils/modelName"

import {
  CACHE_STORAGE_KEY,
  MODEL_METADATA_REFRESH_INTERVAL,
  MODEL_METADATA_URL
} from "./constants"
import type { ModelMetadata, ModelMetadataCache, VendorRule } from "./types"

const PROVIDER_DISPLAY_NAMES: Record<string, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  google: "Google",
  deepseek: "DeepSeek",
  "deepseek-ai": "deepseek-ai",
  mistral: "Mistral",
  meta: "Meta",
  qwen: "Qwen",
  moonshot: "Moonshot",
  zhipu: "ZhipuAI",
  cohere: "Cohere",
  baidu: "Baidu",
  tencent: "Tencent",
  yi: "Yi",
  baichuan: "Baichuan",
  xai: "xAI",
  alibaba: "阿里巴巴",
  "alibaba-cn": "通义千问",
  doubao: "豆包"
}

const DATE_SUFFIX_REGEX = /-\d{8}$/

class ModelMetadataService {
  private storage: Storage
  private cache: ModelMetadataCache | null = null
  private vendorRules: VendorRule[] = []
  private metadataMap: Map<string, ModelMetadata> = new Map()
  private initPromise: Promise<void> | null = null

  constructor() {
    this.storage = new Storage()
  }

  async initialize(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise
    }

    this.initPromise = this._initialize()
    return this.initPromise
  }

  private async _initialize(): Promise<void> {
    try {
      const cached = await this.storage.get<ModelMetadataCache>(
        CACHE_STORAGE_KEY
      )

      if (
        cached &&
        cached.models &&
        Date.now() - cached.lastUpdated < MODEL_METADATA_REFRESH_INTERVAL
      ) {
        this.cache = cached
        this.buildMapsFromCache()
        console.log("[ModelMetadata] Loaded from cache", {
          models: cached.models.length,
          lastUpdated: new Date(cached.lastUpdated)
        })
      } else {
        await this.refreshMetadata()
      }
    } catch (error) {
      console.error("[ModelMetadata] Failed to initialize:", error)
      this.initializeFallback()
    }
  }

  async refreshMetadata(): Promise<void> {
    try {
      console.log("[ModelMetadata] Fetching from", MODEL_METADATA_URL)
      const response = await fetch(MODEL_METADATA_URL)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data || typeof data !== "object") {
        throw new Error("Invalid metadata format: expected object")
      }

      const modelsArray = data.models || data
      if (!Array.isArray(modelsArray)) {
        throw new Error("Invalid metadata format: models should be array")
      }

      const models: ModelMetadata[] = modelsArray.map((item: any) => ({
        id: item.id || "",
        name: item.name || item.id || "",
        provider_id: item.providerId || item.provider_id || "",
        aliases: Array.isArray(item.aliases) ? item.aliases : []
      }))

      this.cache = {
        models,
        lastUpdated: Date.now(),
        version: "1.0"
      }

      await this.storage.set(CACHE_STORAGE_KEY, this.cache)
      this.buildMapsFromCache()

      console.log("[ModelMetadata] Refreshed successfully", {
        models: models.length
      })
    } catch (error) {
      console.error("[ModelMetadata] Failed to refresh metadata:", error)
      if (!this.cache) {
        this.initializeFallback()
      }
    }
  }

  private buildMapsFromCache(): void {
    if (!this.cache) return

    this.metadataMap.clear()
    const providerPatterns: Map<string, Set<string>> = new Map()

    for (const model of this.cache.models) {
      const normalized = normalizeModelName(stripVendorPrefix(model.id))
      if (normalized) {
        this.metadataMap.set(normalized, model)
      }

      if (model.aliases) {
        for (const alias of model.aliases) {
          const aliasNormalized = normalizeModelName(stripVendorPrefix(alias))
          if (aliasNormalized) {
            this.metadataMap.set(aliasNormalized, model)
          }
        }
      }

      if (model.provider_id) {
        if (!providerPatterns.has(model.provider_id)) {
          providerPatterns.set(model.provider_id, new Set())
        }
        const keywords = this.extractKeywords(model.id)
        keywords.forEach((kw) => providerPatterns.get(model.provider_id)!.add(kw))
      }
    }

    this.vendorRules = this.buildVendorRules(providerPatterns)
  }

  private extractKeywords(modelId: string): string[] {
    const keywords: string[] = []
    const lower = modelId.toLowerCase().trim()

    const parts = lower.split("-")
    if (parts.length > 0) {
      const prefix = parts[0].trim()
      if (prefix) {
        keywords.push(prefix)
      }
    }

    if (!lower.includes("-") && lower.length <= 15) {
      keywords.push(lower)
    }

    return [...new Set(keywords)]
  }

  private buildVendorRules(
    providerPatterns: Map<string, Set<string>>
  ): VendorRule[] {
    const rules: VendorRule[] = []

    for (const [providerID, keywords] of providerPatterns) {
      if (keywords.size === 0) continue

      const displayName =
        PROVIDER_DISPLAY_NAMES[providerID] ||
        this.capitalizeFirst(providerID)

      const patternStr = Array.from(keywords)
        .map((keyword) => keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|")

      try {
        const pattern = new RegExp(`^(${patternStr})`, "i")
        rules.push({ providerID, displayName, pattern })
      } catch (error) {
        console.warn(
          `[ModelMetadata] Failed to build pattern for ${providerID}:`,
          error
        )
      }
    }

    return rules
  }

  private capitalizeFirst(str: string): string {
    if (!str) return ""
    const parts = str.replace(/-/g, " ").split(/\s+/)
    return parts
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  }

  private initializeFallback(): void {
    console.warn("[ModelMetadata] Using fallback default data")

    const defaultMetadata: ModelMetadata[] = [
      { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet", provider_id: "anthropic" },
      { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku", provider_id: "anthropic" },
      { id: "claude-3-opus-20240229", name: "Claude 3 Opus", provider_id: "anthropic" },
      { id: "claude-sonnet-4-5-20250929", name: "Claude 4.5 Sonnet", provider_id: "anthropic" },
      { id: "claude-haiku-4-5-20251001", name: "Claude 4.5 Haiku", provider_id: "anthropic" },
      { id: "gpt-4o", name: "GPT-4o", provider_id: "openai" },
      { id: "gpt-4o-mini", name: "GPT-4o mini", provider_id: "openai" },
      { id: "gpt-4-turbo", name: "GPT-4 Turbo", provider_id: "openai" },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider_id: "openai" },
      { id: "gemini-2.0-flash-exp", name: "Gemini 2.0 Flash", provider_id: "google" },
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", provider_id: "google" },
      { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", provider_id: "google" },
      { id: "deepseek-chat", name: "DeepSeek Chat", provider_id: "deepseek" },
      { id: "deepseek-reasoner", name: "DeepSeek Reasoner", provider_id: "deepseek" }
    ]

    const defaultRules: VendorRule[] = [
      { providerID: "anthropic", displayName: "Anthropic", pattern: /^claude/i },
      { providerID: "openai", displayName: "OpenAI", pattern: /^(gpt|chatgpt|o1|o3)/i },
      { providerID: "google", displayName: "Google", pattern: /^gemini/i },
      { providerID: "alibaba", displayName: "阿里巴巴", pattern: /^qwen/i },
      { providerID: "alibaba-cn", displayName: "通义千问", pattern: /^(qwen|tongyi)/i },
      { providerID: "deepseek", displayName: "DeepSeek", pattern: /^deepseek/i },
      { providerID: "moonshot", displayName: "Moonshot", pattern: /^moonshot/i },
      { providerID: "zhipu", displayName: "智谱", pattern: /^(glm|bigmodel)/i },
      { providerID: "mistral", displayName: "MistralAI", pattern: /^mistral/i },
      { providerID: "xai", displayName: "xAI", pattern: /^grok/i },
      { providerID: "meta", displayName: "Meta", pattern: /^llama/i }
    ]

    this.cache = {
      models: defaultMetadata,
      lastUpdated: Date.now(),
      version: "1.0-fallback"
    }

    this.metadataMap.clear()
    for (const model of defaultMetadata) {
      const normalized = normalizeModelName(stripVendorPrefix(model.id))
      if (normalized) {
        this.metadataMap.set(normalized, model)
      }
    }

    this.vendorRules = defaultRules
  }

  findStandardModelName(
    modelName: string
  ): { standardName: string; vendorName: string } | null {
    if (!this.cache) return null

    const cleaned = normalizeModelName(stripVendorPrefix(modelName))
    if (!cleaned) return null

    const metadata = this.metadataMap.get(cleaned)
    if (metadata) {
      const vendorName =
        PROVIDER_DISPLAY_NAMES[metadata.provider_id] ||
        this.capitalizeFirst(metadata.provider_id)
      return {
        standardName: metadata.id,
        vendorName
      }
    }

    if (DATE_SUFFIX_REGEX.test(modelName)) {
      return null
    }

    for (const [key, metadata] of this.metadataMap) {
      if (this.isFuzzyMatch(cleaned, key)) {
        const vendorName =
          PROVIDER_DISPLAY_NAMES[metadata.provider_id] ||
          this.capitalizeFirst(metadata.provider_id)
        return {
          standardName: metadata.id,
          vendorName
        }
      }
    }

    return null
  }

  private isFuzzyMatch(input: string, candidate: string): boolean {
    const dateSuffixRegex = /-\d{8}$/
    const cleanedInput = input.replace(dateSuffixRegex, "")
    const cleanedCandidate = candidate.replace(dateSuffixRegex, "")

    if (cleanedInput === cleanedCandidate) return true

    const inputParts = cleanedInput.split("-")
    const candidateParts = cleanedCandidate.split("-")

    if (inputParts.length === 0 || candidateParts.length === 0) {
      return false
    }

    if (inputParts[0] !== candidateParts[0]) {
      return false
    }

    const isVersionNumber = (value: string) => /^\d+(\.\d+)?$/.test(value)

    const toKeywordSet = (parts: string[]) => {
      const set = new Set<string>()
      for (const part of parts) {
        if (!isVersionNumber(part)) {
          set.add(part)
        }
      }
      return set
    }

    const inputKeywords = toKeywordSet(inputParts)
    const candidateKeywords = toKeywordSet(candidateParts)

    if (inputKeywords.size === 0 || candidateKeywords.size === 0) {
      return false
    }

    for (const keyword of inputKeywords) {
      if (!candidateKeywords.has(keyword)) {
        return false
      }
    }

    let shared = 0
    for (const keyword of candidateKeywords) {
      if (inputKeywords.has(keyword)) {
        shared++
      }
    }

    return shared >= Math.min(inputKeywords.size, candidateKeywords.size, 2)
  }

  findVendorByPattern(modelName: string): string | null {
    for (const rule of this.vendorRules) {
      if (rule.pattern.test(modelName)) {
        return rule.displayName
      }
    }
    return null
  }

  getVendorRules(): VendorRule[] {
    return [...this.vendorRules]
  }

  getCacheInfo(): {
    isLoaded: boolean
    modelCount: number
    lastUpdated: number | null
  } {
    return {
      isLoaded: !!this.cache,
      modelCount: this.cache?.models.length || 0,
      lastUpdated: this.cache?.lastUpdated || null
    }
  }

  async clearCache(): Promise<void> {
    await this.storage.remove(CACHE_STORAGE_KEY)
    this.cache = null
    this.metadataMap.clear()
    this.vendorRules = []
  }
}

export const modelMetadataService = new ModelMetadataService()
