import { MODEL_ALIASES, normalizeModelName, stripVendorPrefix } from "~/utils/modelName"

const SPECIAL_PREFIXES = [
  "BigModel/",
  "BigModel_",
  "Pro/",
  "Pro_",
  "VIP/",
  "VIP_",
  "Internal/",
  "Internal_",
  "Sandbox/",
  "Sandbox_"
]

const OWNER_MODEL_REGEX =
  /^[A-Za-z0-9][A-Za-z0-9_.-]{0,62}\/[A-Za-z0-9][A-Za-z0-9_.-:]{0,62}$/

const DATE_SUFFIX_COMPACT_REGEX = /(?:[-_]?)(?:19|20)\d{6,8}$/i
const DATE_SUFFIX_SEPARATOR_REGEX =
  /[-_](?:19|20)\d{2}(?:[-_]\d{2}){1,2}$/i

interface ModelMetadataEntry {
  standardName: string
  vendorName: string
}

const MODEL_VENDOR_OVERRIDES: Record<
  string,
  { vendor: string; standardName?: string; aliases?: string[] }
> = {
  "gpt-4o": { vendor: "OpenAI", standardName: "GPT-4o" },
  "gpt-4o-mini": { vendor: "OpenAI", standardName: "GPT-4o-mini" },
  "o4-mini": { vendor: "OpenAI", standardName: "o4-mini" },
  o3: { vendor: "OpenAI", standardName: "o3" },
  "gpt-4-turbo": { vendor: "OpenAI", standardName: "GPT-4 Turbo" },
  "gpt-3.5-turbo": { vendor: "OpenAI", standardName: "GPT-3.5 Turbo" },
  "claude-3-7-sonnet": {
    vendor: "Anthropic",
    standardName: "Claude 3.7 Sonnet"
  },
  "claude-3-5-sonnet": {
    vendor: "Anthropic",
    standardName: "Claude 3.5 Sonnet"
  },
  "claude-3-5-haiku": {
    vendor: "Anthropic",
    standardName: "Claude 3.5 Haiku"
  },
  "claude-4.5-haiku": {
    vendor: "Anthropic",
    standardName: "Claude 4.5 Haiku"
  },
  "claude-4.5-sonnet": {
    vendor: "Anthropic",
    standardName: "Claude 4.5 Sonnet"
  },
  "claude-4.1-opus": {
    vendor: "Anthropic",
    standardName: "Claude 4.1 Opus"
  },
  "gemini-1.5-pro": {
    vendor: "Google",
    standardName: "Gemini 1.5 Pro"
  },
  "gemini-1.5-flash": {
    vendor: "Google",
    standardName: "Gemini 1.5 Flash"
  },
  "gemini-2.0-flash": {
    vendor: "Google",
    standardName: "Gemini 2.0 Flash"
  },
  "gemini-2.5-pro": {
    vendor: "Google",
    standardName: "Gemini 2.5 Pro"
  },
  "gemini-2.5-flash": {
    vendor: "Google",
    standardName: "Gemini 2.5 Flash"
  },
  "llama-3.1-8b": {
    vendor: "Meta",
    standardName: "Llama 3.1 8B"
  },
  "llama-3.1-70b": {
    vendor: "Meta",
    standardName: "Llama 3.1 70B"
  },
  "llama-3.3-70b": {
    vendor: "Meta",
    standardName: "Llama 3.3 70B"
  },
  "mistral-large": { vendor: "Mistral", standardName: "Mistral Large" },
  "mistral-small": { vendor: "Mistral", standardName: "Mistral Small" },
  "mistral-medium": { vendor: "Mistral", standardName: "Mistral Medium" },
  "deepseek-chat": { vendor: "DeepSeek", standardName: "DeepSeek Chat" },
  "deepseek-r1": { vendor: "DeepSeek", standardName: "DeepSeek R1" },
  "deepseek-v3.1": {
    vendor: "deepseek-ai",
    standardName: "deepseek-ai/DeepSeek-V3.1",
    aliases: ["deepseek-v31", "DeepSeek-V3.1"]
  },
  "deepseek-reasoner": {
    vendor: "DeepSeek",
    standardName: "DeepSeek Reasoner"
  },
  "qwen2.5-7b": { vendor: "Qwen", standardName: "Qwen2.5 7B" },
  "qwen2.5-72b": { vendor: "Qwen", standardName: "Qwen2.5 72B" },
  "gpt-o3": { vendor: "OpenAI", standardName: "GPT-o3" },
  "gpt-5": { vendor: "OpenAI", standardName: "GPT-5" }
}

type MetadataMap = Map<string, ModelMetadataEntry>

const MODEL_METADATA_MAP: MetadataMap = new Map()

for (const [canonical, info] of Object.entries(MODEL_VENDOR_OVERRIDES)) {
  const standardName = info.standardName ?? canonical
  const aliases = new Set<string>([
    canonical,
    ...(MODEL_ALIASES[canonical] ?? []),
    ...(info.aliases ?? [])
  ])

  for (const alias of aliases) {
    const normalized = normalizeModelName(stripVendorPrefix(alias))
    if (!normalized) continue
    MODEL_METADATA_MAP.set(normalized, {
      standardName,
      vendorName: info.vendor
    })
  }
}

interface VendorRule {
  vendor: string
  pattern: RegExp
}

const VENDOR_RULES: VendorRule[] = [
  { vendor: "OpenAI", pattern: /(gpt|whisper|o\d|text-embedding)/i },
  { vendor: "Anthropic", pattern: /(claude|sonnet|haiku|opus|neptune)/i },
  { vendor: "Google", pattern: /(gemini|palm)/i },
  { vendor: "DeepSeek", pattern: /(deepseek|deepseek-ai)/i },
  { vendor: "Mistral", pattern: /(mistral|mixtral|pixtral|codestral|magistral)/i },
  { vendor: "Meta", pattern: /(llama)/i },
  { vendor: "Qwen", pattern: /(qwen)/i },
  { vendor: "Moonshot", pattern: /(moonshot|kimi)/i },
  { vendor: "ZhipuAI", pattern: /(glm)/i },
  { vendor: "Cohere", pattern: /(command|cohere|c4ai)/i }
]

const isStandardStandaloneName = (model: string): boolean => {
  if (!model) return false
  return !/[/:]/.test(model)
}

const hasSpecialPrefix = (model: string): boolean => {
  const lower = model.toLowerCase()
  return SPECIAL_PREFIXES.some((prefix) => lower.startsWith(prefix.toLowerCase()))
}

const removeSpecialPrefixes = (model: string): string => {
  let cleaned = model
  let updated = true
  while (updated) {
    updated = false
    for (const prefix of SPECIAL_PREFIXES) {
      if (cleaned.toLowerCase().startsWith(prefix.toLowerCase())) {
        cleaned = cleaned.slice(prefix.length)
        updated = true
      }
    }
  }
  return cleaned
}

const removeDateSuffix = (model: string): string => {
  let result = model
  let changed = true
  while (changed) {
    changed = false
    if (DATE_SUFFIX_COMPACT_REGEX.test(result)) {
      result = result.replace(DATE_SUFFIX_COMPACT_REGEX, "")
      changed = true
    }
    if (DATE_SUFFIX_SEPARATOR_REGEX.test(result)) {
      result = result.replace(DATE_SUFFIX_SEPARATOR_REGEX, "")
      changed = true
    }
  }
  return result
}

const findStandardModelMetadata = (
  model: string
): ModelMetadataEntry | undefined => {
  const normalized = normalizeModelName(model)
  if (!normalized) return undefined
  return MODEL_METADATA_MAP.get(normalized)
}

const findVendorByPattern = (model: string): string | undefined => {
  for (const rule of VENDOR_RULES) {
    if (rule.pattern.test(model)) {
      return rule.vendor
    }
  }
  return undefined
}

export const renameModel = (
  model: string,
  includeVendor: boolean
): string | undefined => {
  if (!model) return undefined

  const trimmed = model.trim()
  if (!trimmed) return undefined

  if (!includeVendor && isStandardStandaloneName(trimmed)) {
    return trimmed
  }

  if (
    includeVendor &&
    OWNER_MODEL_REGEX.test(trimmed) &&
    !hasSpecialPrefix(trimmed)
  ) {
    return trimmed
  }

  let cleaned = removeSpecialPrefixes(trimmed)

  let actualModel = cleaned
  const lastSlashIndex = actualModel.lastIndexOf("/")
  if (lastSlashIndex !== -1) {
    actualModel = actualModel.slice(lastSlashIndex + 1)
  }

  const colonIndex = actualModel.indexOf(":")
  if (colonIndex !== -1) {
    actualModel = actualModel.slice(0, colonIndex)
  }

  actualModel = removeDateSuffix(actualModel)

  const metadata = findStandardModelMetadata(actualModel)
  let vendor = metadata?.vendorName ?? ""

  if (metadata) {
    if (metadata.standardName.includes("/")) {
      if (includeVendor) {
        return metadata.standardName
      }
      const [, modelName] = metadata.standardName.split("/")
      actualModel = modelName || actualModel
    } else {
      actualModel = metadata.standardName
    }
  }

  if (!vendor) {
    const fallbackVendor = findVendorByPattern(actualModel)
    if (fallbackVendor) {
      vendor = fallbackVendor
    }
  }

  if (includeVendor && vendor) {
    return `${vendor}/${actualModel}`
  }

  return actualModel
}

export const getModelMetadata = (model: string): ModelMetadataEntry | undefined => {
  return findStandardModelMetadata(model)
}

export const modelNormalizationInternals = {
  removeSpecialPrefixes,
  removeDateSuffix,
  findStandardModelMetadata,
  findVendorByPattern
}
