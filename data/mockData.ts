import type { SiteAccount } from "../types";

// 模拟的账号数据，符合新的数据结构
export const mockSiteAccounts: SiteAccount[] = [
  {
    id: "account_1720796732000_abc123def",
    emoji: "",
    site_name: "OpenAI API",
    site_url: "https://api.openai.com",
    health_status: "healthy",
    exchange_rate: 7.2, // 7.2人民币充值1美元
    account_info: {
      access_token: "sk-xxxxxxxxxxxxxxxxxxxx",
      username: "user@email.com",
      quota: 12.34,
      today_prompt_tokens: 45200,
      today_completion_tokens: 32100,
      today_quota_consumption: 5.67,
      today_requests_count: 127
    },
    last_sync_time: Date.now() - 300000, // 5分钟前
    updated_at: Date.now() - 300000,
    created_at: Date.now() - 86400000 * 7 // 7天前创建
  },
  {
    id: "account_1720796732001_def456ghi",
    emoji: "",
    site_name: "Claude API",
    site_url: "https://api.anthropic.com",
    health_status: "healthy",
    exchange_rate: 6.8, // 6.8人民币充值1美元
    account_info: {
      access_token: "sk-ant-xxxxxxxxxxxxxxxxxxxx",
      username: "myaccount",
      quota: 45.67,
      today_prompt_tokens: 56300,
      today_completion_tokens: 41200,
      today_quota_consumption: 0.00,
      today_requests_count: 0
    },
    last_sync_time: Date.now() - 600000, // 10分钟前
    updated_at: Date.now() - 600000,
    created_at: Date.now() - 86400000 * 5 // 5天前创建
  },
  {
    id: "account_1720796732002_ghi789jkl",
    emoji: "",
    site_name: "好用 API",
    site_url: "https://api.anthropic.com",
    health_status: "warning",
    exchange_rate: 0.5, // 0.5人民币充值1美元（特别优惠）
    account_info: {
      access_token: "sk-ant-yyyyyyyyyyyyyyyy",
      username: "anthropic_user",
      quota: 0.00,
      today_prompt_tokens: 12300,
      today_completion_tokens: 89400,
      today_quota_consumption: 12.34,
      today_requests_count: 89
    },
    last_sync_time: Date.now() - 1200000, // 20分钟前
    updated_at: Date.now() - 1200000,
    created_at: Date.now() - 86400000 * 3 // 3天前创建
  },
  {
    id: "account_1720796732003_jkl012mno",
    emoji: "",
    site_name: "Cohere API",
    site_url: "https://api.cohere.ai",
    health_status: "error",
    exchange_rate: 8.0, // 8人民币充值1美元
    account_info: {
      access_token: "co-xxxxxxxxxxxxxxxxxxxx",
      username: "cohere_user",
      quota: 0.00,
      today_prompt_tokens: 0,
      today_completion_tokens: 0,
      today_quota_consumption: 0.00,
      today_requests_count: 0
    },
    last_sync_time: Date.now() - 1800000, // 30分钟前
    updated_at: Date.now() - 1800000,
    created_at: Date.now() - 86400000 * 2 // 2天前创建
  },
  {
    id: "account_1720796732004_mno345pqr",
    emoji: "",
    site_name: "Replicate API",
    site_url: "https://api.replicate.com",
    health_status: "unknown",
    exchange_rate: 7.5, // 7.5人民币充值1美元
    account_info: {
      access_token: "r8-xxxxxxxxxxxxxxxxxxxx",
      username: "replicate_user",
      quota: 0.00,
      today_prompt_tokens: 0,
      today_completion_tokens: 0,
      today_quota_consumption: 0.00,
      today_requests_count: 0
    },
    last_sync_time: Date.now() - 3600000, // 1小时前
    updated_at: Date.now() - 3600000,
    created_at: Date.now() - 86400000 * 1 // 1天前创建
  }
];

// 辅助函数：将新数据格式转换为当前 UI 需要的格式
export function convertToLegacyFormat(accounts: SiteAccount[]) {
  return {
    totalConsumption: {
      USD: parseFloat(accounts.reduce((sum, acc) => sum + (acc.account_info.today_quota_consumption / 500000), 0).toFixed(2)),
      CNY: parseFloat(accounts.reduce((sum, acc) => sum + ((acc.account_info.today_quota_consumption / 500000) * acc.exchange_rate), 0).toFixed(2))
    },
    todayTokens: {
      upload: accounts.reduce((sum, acc) => sum + acc.account_info.today_prompt_tokens, 0),
      download: accounts.reduce((sum, acc) => sum + acc.account_info.today_completion_tokens, 0)
    },
    todayRequests: accounts.reduce((sum, acc) => sum + acc.account_info.today_requests_count, 0),
    sites: accounts.map(account => ({
      id: parseInt(account.id.split('_')[1]) || Math.random(), // 兼容旧的数字 ID
      icon: account.emoji,
      name: account.site_name,
      username: account.account_info.username,
      balance: {
        USD: parseFloat((account.account_info.quota / 500000).toFixed(2)),
        CNY: parseFloat(((account.account_info.quota / 500000) * account.exchange_rate).toFixed(2))
      },
      todayConsumption: {
        USD: parseFloat((account.account_info.today_quota_consumption / 500000).toFixed(2)),
        CNY: parseFloat(((account.account_info.today_quota_consumption / 500000) * account.exchange_rate).toFixed(2))
      },
      todayTokens: {
        upload: account.account_info.today_prompt_tokens,
        download: account.account_info.today_completion_tokens
      },
      healthStatus: account.health_status
    }))
  };
}