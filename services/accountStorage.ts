import { Storage } from "@plasmohq/storage";
import type { 
  SiteAccount, 
  StorageConfig, 
  AccountStats, 
  DisplaySiteData,
  CurrencyType,
  SiteHealthStatus 
} from "../types";

// 存储键名常量
const STORAGE_KEYS = {
  ACCOUNTS: 'site_accounts',
  CONFIG: 'storage_config'
} as const;

// 默认配置
const DEFAULT_CONFIG: StorageConfig = {
  accounts: [],
  last_updated: Date.now()
};

class AccountStorageService {
  private storage: Storage;

  constructor() {
    this.storage = new Storage({
      area: "local"
    });
  }

  /**
   * 获取所有账号信息
   */
  async getAllAccounts(): Promise<SiteAccount[]> {
    try {
      const config = await this.getStorageConfig();
      return config.accounts;
    } catch (error) {
      console.error('获取账号信息失败:', error);
      return [];
    }
  }

  /**
   * 根据 ID 获取单个账号信息
   */
  async getAccountById(id: string): Promise<SiteAccount | null> {
    try {
      const accounts = await this.getAllAccounts();
      return accounts.find(account => account.id === id) || null;
    } catch (error) {
      console.error('获取账号信息失败:', error);
      return null;
    }
  }

  /**
   * 添加新账号
   */
  async addAccount(accountData: Omit<SiteAccount, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const accounts = await this.getAllAccounts();
      const now = Date.now();
      
      const newAccount: SiteAccount = {
        ...accountData,
        id: this.generateId(),
        created_at: now,
        updated_at: now
      };

      accounts.push(newAccount);
      await this.saveAccounts(accounts);
      
      return newAccount.id;
    } catch (error) {
      console.error('添加账号失败:', error);
      throw error;
    }
  }

  /**
   * 更新账号信息
   */
  async updateAccount(id: string, updates: Partial<Omit<SiteAccount, 'id' | 'created_at'>>): Promise<boolean> {
    try {
      const accounts = await this.getAllAccounts();
      const index = accounts.findIndex(account => account.id === id);
      
      if (index === -1) {
        throw new Error(`账号 ${id} 不存在`);
      }

      accounts[index] = {
        ...accounts[index],
        ...updates,
        updated_at: Date.now()
      };

      await this.saveAccounts(accounts);
      return true;
    } catch (error) {
      console.error('更新账号失败:', error);
      return false;
    }
  }

  /**
   * 删除账号
   */
  async deleteAccount(id: string): Promise<boolean> {
    try {
      const accounts = await this.getAllAccounts();
      const filteredAccounts = accounts.filter(account => account.id !== id);
      
      if (filteredAccounts.length === accounts.length) {
        throw new Error(`账号 ${id} 不存在`);
      }

      await this.saveAccounts(filteredAccounts);
      return true;
    } catch (error) {
      console.error('删除账号失败:', error);
      return false;
    }
  }

  /**
   * 更新账号同步时间
   */
  async updateSyncTime(id: string): Promise<boolean> {
    return this.updateAccount(id, { 
      last_sync_time: Date.now(),
      updated_at: Date.now()
    });
  }

  /**
   * 计算账号统计信息
   */
  async getAccountStats(): Promise<AccountStats> {
    try {
      const accounts = await this.getAllAccounts();
      
      return accounts.reduce((stats, account) => ({
        total_quota: stats.total_quota + account.account_info.quota,
        today_total_consumption: stats.today_total_consumption + account.account_info.today_quota_consumption,
        today_total_requests: stats.today_total_requests + account.account_info.today_requests_count,
        today_total_prompt_tokens: stats.today_total_prompt_tokens + account.account_info.today_prompt_tokens,
        today_total_completion_tokens: stats.today_total_completion_tokens + account.account_info.today_completion_tokens,
      }), {
        total_quota: 0,
        today_total_consumption: 0,
        today_total_requests: 0,
        today_total_prompt_tokens: 0,
        today_total_completion_tokens: 0,
      });
    } catch (error) {
      console.error('计算统计信息失败:', error);
      return {
        total_quota: 0,
        today_total_consumption: 0,
        today_total_requests: 0,
        today_total_prompt_tokens: 0,
        today_total_completion_tokens: 0,
      };
    }
  }

  /**
   * 转换为展示用的数据格式 (兼容当前 UI)
   */
  convertToDisplayData(accounts: SiteAccount[]): DisplaySiteData[] {
    return accounts.map(account => ({
      id: account.id,
      icon: account.emoji,
      name: account.site_name,
      username: account.account_info.username,
      balance: {
        USD: parseFloat(account.account_info.quota.toFixed(2)),
        CNY: parseFloat((account.account_info.quota * account.exchange_rate).toFixed(2))
      },
      todayConsumption: {
        USD: parseFloat(account.account_info.today_quota_consumption.toFixed(2)),
        CNY: parseFloat((account.account_info.today_quota_consumption * account.exchange_rate).toFixed(2))
      },
      todayTokens: {
        upload: account.account_info.today_prompt_tokens,
        download: account.account_info.today_completion_tokens
      },
      healthStatus: account.health_status
    }));
  }

  /**
   * 清空所有数据
   */
  async clearAllData(): Promise<boolean> {
    try {
      await this.storage.remove(STORAGE_KEYS.ACCOUNTS);
      await this.storage.remove(STORAGE_KEYS.CONFIG);
      return true;
    } catch (error) {
      console.error('清空数据失败:', error);
      return false;
    }
  }

  /**
   * 导出数据
   */
  async exportData(): Promise<StorageConfig> {
    return this.getStorageConfig();
  }

  /**
   * 导入数据
   */
  async importData(data: StorageConfig): Promise<boolean> {
    try {
      await this.storage.set(STORAGE_KEYS.CONFIG, {
        ...data,
        last_updated: Date.now()
      });
      return true;
    } catch (error) {
      console.error('导入数据失败:', error);
      return false;
    }
  }

  // 私有方法

  /**
   * 获取存储配置
   */
  private async getStorageConfig(): Promise<StorageConfig> {
    try {
      const config = await this.storage.get(STORAGE_KEYS.CONFIG) as StorageConfig;
      return config || DEFAULT_CONFIG;
    } catch (error) {
      console.error('获取存储配置失败:', error);
      return DEFAULT_CONFIG;
    }
  }

  /**
   * 保存账号数据
   */
  private async saveAccounts(accounts: SiteAccount[]): Promise<void> {
    const config: StorageConfig = {
      accounts,
      last_updated: Date.now()
    };
    
    await this.storage.set(STORAGE_KEYS.CONFIG, config);
  }

  /**
   * 生成唯一 ID
   */
  private generateId(): string {
    return `account_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }
}

// 创建单例实例
export const accountStorage = new AccountStorageService();

// 工具函数
export const AccountStorageUtils = {
  /**
   * 格式化余额显示
   */
  formatBalance(amount: number, currency: CurrencyType): string {
    const symbol = currency === 'USD' ? '$' : '¥';
    return `${symbol}${amount.toFixed(2)}`;
  },

  /**
   * 格式化 token 数量
   */
  formatTokenCount(count: number): string {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  },

  /**
   * 验证账号数据
   */
  validateAccount(account: Partial<SiteAccount>): string[] {
    const errors: string[] = [];

    if (!account.site_name?.trim()) {
      errors.push('站点名称不能为空');
    }

    if (!account.site_url?.trim()) {
      errors.push('站点 URL 不能为空');
    }

    if (!account.account_info?.access_token?.trim()) {
      errors.push('访问令牌不能为空');
    }

    if (!account.account_info?.username?.trim()) {
      errors.push('用户名不能为空');
    }

    if (!account.health_status) {
      errors.push('站点健康状态不能为空');
    }

    if (!account.exchange_rate || account.exchange_rate <= 0) {
      errors.push('充值比例必须为正数');
    }

    return errors;
  },

  /**
   * 生成默认 emoji
   */
  getRandomEmoji(): string {
    const emojis = ['🤖', '🌟', '🔥', '🚀', '⚡', '💡', '🎯', '🌈', '🦙', '🎨'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  },

  /**
   * 获取健康状态的显示文本和样式
   */
  getHealthStatusInfo(status: SiteHealthStatus): { text: string; color: string; bgColor: string } {
    switch (status) {
      case 'healthy':
        return { text: '正常', color: 'text-green-600', bgColor: 'bg-green-50' };
      case 'warning':
        return { text: '警告', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
      case 'error':
        return { text: '错误', color: 'text-red-600', bgColor: 'bg-red-50' };
      case 'unknown':
      default:
        return { text: '未知', color: 'text-gray-500', bgColor: 'bg-gray-50' };
    }
  }
};