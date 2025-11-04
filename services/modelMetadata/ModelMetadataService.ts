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
  baichuan: "Baichuan"
}

const DATE_SUFFIX_REGEX = /[-_]?\d{8}$/

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

      if (!Array.isArray(data)) {
        throw new Error("Invalid metadata format: expected array")
      }

      const models: ModelMetadata[] = data.map((item: any) => ({
        id: item.id || "",
        name: item.name || item.id || "",
        provider_id: item.provider_id || "",
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
    const lower = modelId.toLowerCase()

    const parts = lower.split(/[-_./]/)
    for (const part of parts) {
      if (part.length >= 3 && !/^\d+$/.test(part)) {
        keywords.push(part)
      }
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
        .sort((a, b) => b.length - a.length)
        .slice(0, 10)
        .join("|")

      try {
        const pattern = new RegExp(`(${patternStr})`, "i")
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
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  private initializeFallback(): void {
    console.warn("[ModelMetadata] Using fallback minimal data")
    this.cache = {
      models: [],
      lastUpdated: Date.now(),
      version: "1.0-fallback"
    }
    this.vendorRules = []
    this.metadataMap.clear()
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

    if (!DATE_SUFFIX_REGEX.test(modelName)) {
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
    }

    return null
  }

  private isFuzzyMatch(input: string, candidate: string): boolean {
    if (input === candidate) return true

    const inputKeywords = input.split(/[-_.]/).filter((k) => k.length > 0)
    const candidateKeywords = candidate
      .split(/[-_.]/)
      .filter((k) => k.length > 0)

    if (inputKeywords.length < 2 || candidateKeywords.length < 2) {
      return false
    }

    let matchCount = 0
    for (const inputKw of inputKeywords) {
      for (const candKw of candidateKeywords) {
        if (
          inputKw === candKw ||
          inputKw.includes(candKw) ||
          candKw.includes(inputKw)
        ) {
          matchCount++
          break
        }
      }
    }

    return matchCount >= Math.min(inputKeywords.length, candidateKeywords.length) * 0.6
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
