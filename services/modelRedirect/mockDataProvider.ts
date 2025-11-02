/**
 * Mock Data Provider for Model Redirect Testing
 * Provides stable, predictable channel data for development and testing
 */

import { CHANNEL_STATUS } from "~/types/newapi"
import type { MockChannelData, MockDataProviderResponse } from "~/types"

/**
 * Mock channels with various configurations for testing
 */
const MOCK_CHANNELS: MockChannelData[] = [
  // OpenAI channels
  {
    id: 1,
    name: "OpenAI Official | Priority 10",
    models: "gpt-4o,gpt-4o-mini,o3,gpt-4-turbo",
    priority: 10,
    weight: 5,
    status: CHANNEL_STATUS.Enable,
    base_url: "https://api.openai.com/v1",
    type: 1,
    key: "sk-test-1",
    groups: "default"
  },
  {
    id: 2,
    name: "OpenAI Reseller | Priority 5",
    models: "gpt-4o-mini,gpt-3.5-turbo",
    priority: 5,
    weight: 3,
    status: CHANNEL_STATUS.Enable,
    base_url: "https://reseller1.example.com/v1",
    type: 1,
    key: "sk-test-2",
    groups: "default"
  },
  {
    id: 3,
    name: "OpenAI Backup | Low Priority",
    models: "gpt-4o,gpt-4o-mini-2024-07-18",
    priority: 1,
    weight: 2,
    status: CHANNEL_STATUS.Enable,
    base_url: "https://backup.example.com/v1",
    type: 1,
    key: "sk-test-3",
    groups: "default"
  },

  // Anthropic channels
  {
    id: 4,
    name: "Anthropic Official | High Priority",
    models:
      "claude-3-7-sonnet,claude-3-5-sonnet-20241022,claude-3-5-haiku-20241022",
    priority: 10,
    weight: 5,
    status: CHANNEL_STATUS.Enable,
    base_url: "https://api.anthropic.com/v1",
    type: 8,
    key: "sk-ant-test-1",
    groups: "default"
  },
  {
    id: 5,
    name: "Anthropic Reseller | Medium Priority",
    models: "claude-3-5-sonnet-20240620,claude-3-5-haiku",
    priority: 5,
    weight: 3,
    status: CHANNEL_STATUS.Enable,
    base_url: "https://anthropic-reseller.example.com/v1",
    type: 8,
    key: "sk-ant-test-2",
    groups: "default"
  },

  // Google channels
  {
    id: 6,
    name: "Google AI | Gemini",
    models: "gemini-1.5-pro-002,gemini-1.5-flash-002,gemini-2.0-flash",
    priority: 10,
    weight: 5,
    status: CHANNEL_STATUS.Enable,
    base_url: "https://generativelanguage.googleapis.com/v1",
    type: 9,
    key: "test-api-key-1",
    groups: "default"
  },
  {
    id: 7,
    name: "Google Reseller",
    models: "gemini-1.5-pro,gemini-1.5-flash",
    priority: 3,
    weight: 2,
    status: CHANNEL_STATUS.Enable,
    base_url: "https://google-reseller.example.com/v1",
    type: 9,
    key: "test-api-key-2",
    groups: "default"
  },

  // Meta channels
  {
    id: 8,
    name: "Meta Llama | Official",
    models: "llama-3.3-70b-instruct,llama-3.1-70b-instruct,llama-3.1-8b-instruct",
    priority: 8,
    weight: 4,
    status: CHANNEL_STATUS.Enable,
    base_url: "https://api.meta.com/v1",
    type: 10,
    key: "meta-test-1",
    groups: "default"
  },

  // Mistral channels
  {
    id: 9,
    name: "Mistral AI | Official",
    models: "mistral-large-latest,mistral-small-latest",
    priority: 8,
    weight: 4,
    status: CHANNEL_STATUS.Enable,
    base_url: "https://api.mistral.ai/v1",
    type: 11,
    key: "mistral-test-1",
    groups: "default"
  },

  // DeepSeek channels
  {
    id: 10,
    name: "DeepSeek Official | High Quota",
    models: "deepseek-chat,deepseek-r1",
    priority: 10,
    weight: 5,
    status: CHANNEL_STATUS.Enable,
    base_url: "https://api.deepseek.com/v1",
    type: 12,
    key: "deepseek-test-1",
    groups: "default"
  },
  {
    id: 11,
    name: "DeepSeek Reseller | Low Quota",
    models: "deepseek-chat",
    priority: 5,
    weight: 2,
    status: CHANNEL_STATUS.Enable,
    base_url: "https://deepseek-reseller.example.com/v1",
    type: 12,
    key: "deepseek-test-2",
    groups: "default"
  },

  // Qwen channels
  {
    id: 12,
    name: "Qwen Official",
    models: "qwen2.5-72b-instruct,qwen2.5-7b-instruct",
    priority: 7,
    weight: 4,
    status: CHANNEL_STATUS.Enable,
    base_url: "https://api.qwen.com/v1",
    type: 13,
    key: "qwen-test-1",
    groups: "default"
  },

  // Disabled channel (should be excluded)
  {
    id: 13,
    name: "Disabled Channel",
    models: "gpt-4o,claude-3-7-sonnet",
    priority: 10,
    weight: 5,
    status: CHANNEL_STATUS.ManuallyDisabled,
    base_url: "https://disabled.example.com/v1",
    type: 1,
    key: "disabled-test",
    groups: "default"
  },

  // Channel with high used_quota for testing
  {
    id: 14,
    name: "OpenAI High Usage",
    models: "gpt-4o,gpt-4o-mini",
    priority: 10,
    weight: 5,
    status: CHANNEL_STATUS.Enable,
    base_url: "https://high-usage.example.com/v1",
    type: 1,
    key: "high-usage-test",
    groups: "default"
  }
]

/**
 * Mock used quota data (in cents or equivalent units)
 */
const MOCK_USED_QUOTA: Record<number, number> = {
  1: 100000, // 1000 USD worth
  2: 50000, // 500 USD worth
  3: 10000, // 100 USD worth
  4: 80000,
  5: 30000,
  6: 60000,
  7: 20000,
  8: 40000,
  9: 35000,
  10: 90000,
  11: 5000,
  12: 45000,
  13: 0, // Disabled
  14: 500000 // Very high usage - 5000 USD worth
}

/**
 * Get mock channels data
 */
export function getMockChannels(): MockChannelData[] {
  return MOCK_CHANNELS
}

/**
 * Get mock used quota for a channel
 */
export function getMockUsedQuota(channelId: number): number {
  return MOCK_USED_QUOTA[channelId] || 0
}

/**
 * Get mock data provider response
 */
export function getMockDataProviderResponse(): MockDataProviderResponse {
  return {
    channels: MOCK_CHANNELS
  }
}

/**
 * Check if mock data is available
 */
export function isMockDataAvailable(): boolean {
  return MOCK_CHANNELS.length > 0
}
