import { accountStorage } from "~/services/accountStorage"

/**
 * 存储功能测试脚本
 */
export const testStorageFunction = async () => {
  console.log("=== 开始测试存储功能 ===")

  try {
    // 测试添加账号
    const testAccount = {
      emoji: "",
      site_name: "测试站点",
      site_url: "https://test.example.com",
      health_status: "unknown" as const,
      exchange_rate: 7.2,
      account_info: {
        access_token: "sk-test-1234567890",
        username: "test@example.com",
        quota: 100.0,
        today_prompt_tokens: 0,
        today_completion_tokens: 0,
        today_quota_consumption: 0,
        today_requests_count: 0
      },
      last_sync_time: Date.now()
    }

    console.log("1. 测试添加账号...")
    const accountId = await accountStorage.addAccount(testAccount)
    console.log("账号添加成功，ID:", accountId)

    // 测试获取所有账号
    console.log("2. 测试获取所有账号...")
    const allAccounts = await accountStorage.getAllAccounts()
    console.log("获取到账号数量:", allAccounts.length)
    console.log(
      "账号列表:",
      allAccounts.map((acc) => ({
        id: acc.id,
        name: acc.site_name,
        username: acc.account_info.username
      }))
    )

    // 测试获取单个账号
    console.log("3. 测试获取单个账号...")
    const singleAccount = await accountStorage.getAccountById(accountId)
    console.log(
      "获取单个账号成功:",
      singleAccount ? singleAccount.site_name : "未找到"
    )

    // 测试数据导出
    console.log("4. 测试数据导出...")
    const exportedData = await accountStorage.exportData()
    console.log("导出数据:", {
      accountCount: exportedData.accounts.length,
      lastUpdated: new Date(exportedData.last_updated).toLocaleString()
    })

    console.log("=== 所有测试完成 ===")
    return true
  } catch (error) {
    console.error("测试失败:", error)
    return false
  }
}

// 在浏览器环境中暴露测试函数
if (typeof window !== "undefined") {
  ;(window as any).testStorageFunction = testStorageFunction
  console.log(
    "测试函数已挂载到 window.testStorageFunction，在控制台运行 testStorageFunction() 进行测试"
  )
}
