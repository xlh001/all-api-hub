/**
 * Centralized Channel Default Values and Constants
 * Eliminates magic strings and provides type-safe defaults
 */

import {
  ChannelType,
  type ChannelDefaults,
  type ChannelTypeConfig,
  type ChannelMode
} from "~/types/newapi"

export const DEFAULT_CHANNEL_MODE: ChannelMode = "single"
export const DEFAULT_CHANNEL_STATUS = 1

/**
 * Default field values for all channels
 */
export const DEFAULT_CHANNEL_FIELDS: ChannelDefaults = {
  mode: DEFAULT_CHANNEL_MODE,
  status: DEFAULT_CHANNEL_STATUS,
  priority: 0,
  weight: 0,
  groups: ["default"],
  models: [],
  type: ChannelType.OpenAI
}

/**
 * Channel type display names
 */
export const CHANNEL_TYPE_NAMES: Record<ChannelType, string> = {
  [ChannelType.OpenAI]: "OpenAI",
  [ChannelType.Anthropic]: "Anthropic / Claude",
  [ChannelType.GoogleGemini]: "Google Gemini",
  [ChannelType.Azure]: "Azure OpenAI",
  [ChannelType.Cohere]: "Cohere",
  [ChannelType.BaiChuan]: "BaiChuan",
  [ChannelType.ZhipuAI]: "ZhipuAI / GLM",
  [ChannelType.AlibabaQwen]: "Alibaba Qwen",
  [ChannelType.Xunfei]: "Xunfei Spark",
  [ChannelType.DeepSeek]: "DeepSeek",
  [ChannelType.Moonshot]: "Moonshot / Kimi",
  [ChannelType.Ollama]: "Ollama",
  [ChannelType.VertexAI]: "Vertex AI",
  [ChannelType.AWS]: "AWS Bedrock",
  [ChannelType.Cloudflare]: "Cloudflare",
  [ChannelType.Groq]: "Groq",
  [ChannelType.Midjourney]: "Midjourney",
  [ChannelType.Suno]: "Suno",
  [ChannelType.Custom]: "Custom"
}

/**
 * Type-specific configurations
 */
export const CHANNEL_TYPE_CONFIGS: Record<ChannelType, ChannelTypeConfig> = {
  [ChannelType.OpenAI]: {
    type: ChannelType.OpenAI,
    baseUrlPlaceholder: "https://api.openai.com",
    keyPlaceholder: "sk-...",
    supportsModelsAutoFetch: true,
    requiresBaseUrl: false
  },
  [ChannelType.Anthropic]: {
    type: ChannelType.Anthropic,
    baseUrlPlaceholder: "https://api.anthropic.com",
    keyPlaceholder: "sk-ant-...",
    supportsModelsAutoFetch: true,
    requiresBaseUrl: false
  },
  [ChannelType.GoogleGemini]: {
    type: ChannelType.GoogleGemini,
    baseUrlPlaceholder: "https://generativelanguage.googleapis.com",
    keyPlaceholder: "AI...",
    supportsModelsAutoFetch: true,
    requiresBaseUrl: false
  },
  [ChannelType.Azure]: {
    type: ChannelType.Azure,
    baseUrlPlaceholder: "https://your-resource.openai.azure.com",
    keyPlaceholder: "API Key",
    supportsModelsAutoFetch: false,
    requiresBaseUrl: true
  },
  [ChannelType.Cohere]: {
    type: ChannelType.Cohere,
    baseUrlPlaceholder: "https://api.cohere.ai",
    keyPlaceholder: "API Key",
    supportsModelsAutoFetch: true,
    requiresBaseUrl: false
  },
  [ChannelType.BaiChuan]: {
    type: ChannelType.BaiChuan,
    baseUrlPlaceholder: "https://api.baichuan-ai.com",
    keyPlaceholder: "API Key",
    supportsModelsAutoFetch: true,
    requiresBaseUrl: false
  },
  [ChannelType.ZhipuAI]: {
    type: ChannelType.ZhipuAI,
    baseUrlPlaceholder: "https://open.bigmodel.cn",
    keyPlaceholder: "API Key",
    supportsModelsAutoFetch: true,
    requiresBaseUrl: false
  },
  [ChannelType.AlibabaQwen]: {
    type: ChannelType.AlibabaQwen,
    baseUrlPlaceholder: "https://dashscope.aliyuncs.com",
    keyPlaceholder: "API Key",
    supportsModelsAutoFetch: true,
    requiresBaseUrl: false
  },
  [ChannelType.Xunfei]: {
    type: ChannelType.Xunfei,
    baseUrlPlaceholder: "https://spark-api.xf-yun.com",
    keyPlaceholder: "API Key",
    supportsModelsAutoFetch: false,
    requiresBaseUrl: false
  },
  [ChannelType.DeepSeek]: {
    type: ChannelType.DeepSeek,
    baseUrlPlaceholder: "https://api.deepseek.com",
    keyPlaceholder: "sk-...",
    supportsModelsAutoFetch: true,
    requiresBaseUrl: false
  },
  [ChannelType.Moonshot]: {
    type: ChannelType.Moonshot,
    baseUrlPlaceholder: "https://api.moonshot.cn",
    keyPlaceholder: "sk-...",
    supportsModelsAutoFetch: true,
    requiresBaseUrl: false
  },
  [ChannelType.Ollama]: {
    type: ChannelType.Ollama,
    baseUrlPlaceholder: "http://localhost:11434",
    keyPlaceholder: "ollama",
    supportsModelsAutoFetch: true,
    requiresBaseUrl: true
  },
  [ChannelType.VertexAI]: {
    type: ChannelType.VertexAI,
    baseUrlPlaceholder: "https://REGION-aiplatform.googleapis.com",
    keyPlaceholder: "API Key",
    supportsModelsAutoFetch: true,
    requiresBaseUrl: true
  },
  [ChannelType.AWS]: {
    type: ChannelType.AWS,
    baseUrlPlaceholder: "AWS Region",
    keyPlaceholder: "Access Key",
    supportsModelsAutoFetch: false,
    requiresBaseUrl: true
  },
  [ChannelType.Cloudflare]: {
    type: ChannelType.Cloudflare,
    baseUrlPlaceholder: "https://api.cloudflare.com",
    keyPlaceholder: "API Token",
    supportsModelsAutoFetch: true,
    requiresBaseUrl: false
  },
  [ChannelType.Groq]: {
    type: ChannelType.Groq,
    baseUrlPlaceholder: "https://api.groq.com",
    keyPlaceholder: "gsk_...",
    supportsModelsAutoFetch: true,
    requiresBaseUrl: false
  },
  [ChannelType.Midjourney]: {
    type: ChannelType.Midjourney,
    baseUrlPlaceholder: "https://api.midjourney.com",
    keyPlaceholder: "API Key",
    supportsModelsAutoFetch: false,
    requiresBaseUrl: false
  },
  [ChannelType.Suno]: {
    type: ChannelType.Suno,
    baseUrlPlaceholder: "https://api.suno.ai",
    keyPlaceholder: "API Key",
    supportsModelsAutoFetch: false,
    requiresBaseUrl: false
  },
  [ChannelType.Custom]: {
    type: ChannelType.Custom,
    baseUrlPlaceholder: "https://your-api.example.com",
    keyPlaceholder: "API Key",
    supportsModelsAutoFetch: false,
    requiresBaseUrl: true
  }
}

/**
 * Channel status constants
 */
export const CHANNEL_STATUS = {
  ENABLED: 1,
  DISABLED: 2
} as const

/**
 * Channel mode constants
 */
export const CHANNEL_MODE = {
  SINGLE: "single",
  BATCH: "batch"
} as const

/**
 * Get type configuration for a specific channel type
 */
export function getChannelTypeConfig(type: ChannelType): ChannelTypeConfig {
  return CHANNEL_TYPE_CONFIGS[type] || CHANNEL_TYPE_CONFIGS[ChannelType.OpenAI]
}

/**
 * Get display name for a channel type
 */
export function getChannelTypeName(type: ChannelType): string {
  return CHANNEL_TYPE_NAMES[type] || "Unknown"
}

/**
 * Get all available channel types as options
 */
export function getChannelTypeOptions(): Array<{ value: ChannelType; label: string }> {
  return Object.entries(CHANNEL_TYPE_NAMES).map(([value, label]) => ({
    value: parseInt(value) as ChannelType,
    label
  }))
}
