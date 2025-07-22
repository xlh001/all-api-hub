import { accountStorage, AccountStorageUtils } from "../services/accountStorage";

/**
 * 账号存储系统使用示例
 */
export class AccountStorageExample {
  /**
   * 添加新账号示例
   */
  static async addNewAccount() {
    try {
      const newAccountData = {
        emoji: AccountStorageUtils.getRandomEmoji(),
        site_name: "测试 API 站点",
        site_url: "https://api.test.com",
        health_status: "healthy" as const,
        exchange_rate: 7.2,
        account_info: {
          access_token: "sk-test-xxxxxxxxxxxxxxxxxxxx",
          username: "test_user@example.com",
          quota: 100.0,
          today_prompt_tokens: 0,
          today_completion_tokens: 0,
          today_quota_consumption: 0,
          today_requests_count: 0
        },
        last_sync_time: Date.now()
      };

      const accountId = await accountStorage.addAccount(newAccountData);
      console.log(`新账号已添加，ID: ${accountId}`);
      return accountId;
    } catch (error) {
      console.error('添加账号失败:', error);
      throw error;
    }
  }

  /**
   * 更新账号统计信息示例
   */
  static async updateAccountStats(accountId: string) {
    try {
      const updates = {
        account_info: {
          access_token: "保持原有token",
          username: "保持原有用户名",
          quota: 95.50, // 更新余额
          today_prompt_tokens: 1500,
          today_completion_tokens: 2300,
          today_quota_consumption: 4.50,
          today_requests_count: 15
        },
        last_sync_time: Date.now()
      };

      const success = await accountStorage.updateAccount(accountId, updates);
      console.log(`账号统计更新${success ? '成功' : '失败'}`);
      return success;
    } catch (error) {
      console.error('更新账号统计失败:', error);
      throw error;
    }
  }

  /**
   * 获取并显示所有账号信息示例
   */
  static async displayAllAccounts() {
    try {
      const accounts = await accountStorage.getAllAccounts();
      console.log(`当前共有 ${accounts.length} 个账号:`);
      
      accounts.forEach((account, index) => {
        console.log(`\n${index + 1}. ${account.emoji} ${account.site_name}`);
        console.log(`   用户名: ${account.account_info.username}`);
        console.log(`   余额: ${AccountStorageUtils.formatBalance(account.account_info.quota, 'USD')}`);
        console.log(`   今日消耗: ${AccountStorageUtils.formatBalance(account.account_info.today_quota_consumption, 'USD')}`);
        console.log(`   今日请求: ${account.account_info.today_requests_count} 次`);
        console.log(`   最后同步: ${new Date(account.last_sync_time).toLocaleString()}`);
      });

      return accounts;
    } catch (error) {
      console.error('获取账号信息失败:', error);
      throw error;
    }
  }

  /**
   * 获取统计信息示例
   */
  static async displayStats() {
    try {
      const stats = await accountStorage.getAccountStats();
      
      console.log('\n=== 总体统计 ===');
      console.log(`总余额: ${AccountStorageUtils.formatBalance(stats.total_quota, 'USD')}`);
      console.log(`今日总消耗: ${AccountStorageUtils.formatBalance(stats.today_total_consumption, 'USD')}`);
      console.log(`今日总请求: ${stats.today_total_requests} 次`);
      console.log(`今日 Prompt Tokens: ${AccountStorageUtils.formatTokenCount(stats.today_total_prompt_tokens)}`);
      console.log(`今日 Completion Tokens: ${AccountStorageUtils.formatTokenCount(stats.today_total_completion_tokens)}`);

      return stats;
    } catch (error) {
      console.error('获取统计信息失败:', error);
      throw error;
    }
  }

  /**
   * 数据转换示例（兼容现有 UI）
   */
  static async convertForUI() {
    try {
      const accounts = await accountStorage.getAllAccounts();
      const displayData = accountStorage.convertToDisplayData(accounts);
      
      console.log('\n=== 转换为 UI 数据格式 ===');
      console.log(JSON.stringify(displayData, null, 2));

      return displayData;
    } catch (error) {
      console.error('数据转换失败:', error);
      throw error;
    }
  }

  /**
   * 数据导出/导入示例
   */
  static async exportImportExample() {
    try {
      // 导出数据
      const exportedData = await accountStorage.exportData();
      console.log('数据已导出');
      
      // 模拟导入相同数据
      const importSuccess = await accountStorage.importData(exportedData);
      console.log(`数据导入${importSuccess ? '成功' : '失败'}`);

      return { exportedData, importSuccess };
    } catch (error) {
      console.error('导出/导入失败:', error);
      throw error;
    }
  }

  /**
   * 数据验证示例
   */
  static validateAccountData() {
    const validAccount = {
      emoji: "🤖",
      site_name: "有效站点",
      site_url: "https://api.valid.com",
      health_status: "healthy" as const,
      exchange_rate: 7.2,
      account_info: {
        access_token: "sk-valid-token",
        username: "valid_user",
        quota: 100,
        today_prompt_tokens: 0,
        today_completion_tokens: 0,
        today_quota_consumption: 0,
        today_requests_count: 0
      }
    };

    const invalidAccount = {
      emoji: "🤖",
      site_name: "", // 空的站点名称
      site_url: "invalid-url", // 不是有效URL
      health_status: undefined as any, // 缺少健康状态
      exchange_rate: -1, // 无效的充值比例
      account_info: {
        access_token: "", // 空的token
        username: "",
        quota: 100,
        today_prompt_tokens: 0,
        today_completion_tokens: 0,
        today_quota_consumption: 0,
        today_requests_count: 0
      }
    };

    console.log('\n=== 数据验证示例 ===');
    console.log('有效账号验证结果:', AccountStorageUtils.validateAccount(validAccount));
    console.log('无效账号验证结果:', AccountStorageUtils.validateAccount(invalidAccount));
  }

  /**
   * 运行所有示例
   */
  static async runAllExamples() {
    console.log('=== 账号存储系统示例 ===\n');
    
    try {
      // 数据验证示例
      this.validateAccountData();
      
      // 添加账号
      const accountId = await this.addNewAccount();
      
      // 显示所有账号
      await this.displayAllAccounts();
      
      // 更新账号统计
      await this.updateAccountStats(accountId);
      
      // 显示统计信息
      await this.displayStats();
      
      // 数据转换示例
      await this.convertForUI();
      
      // 导出/导入示例
      await this.exportImportExample();
      
      console.log('\n=== 所有示例运行完成 ===');
    } catch (error) {
      console.error('示例运行失败:', error);
    }
  }
}

// 如果直接运行此文件，执行所有示例
if (typeof window !== 'undefined') {
  // 浏览器环境
  (window as any).AccountStorageExample = AccountStorageExample;
}