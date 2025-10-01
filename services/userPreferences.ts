import { Storage } from "@plasmohq/storage"

import { DATA_TYPE_BALANCE, DATA_TYPE_CONSUMPTION } from "~/constants/ui"
import type { BalanceType, CurrencyType, SortField, SortOrder } from "~/types"

// 用户偏好设置类型定义
export interface UserPreferences {
  // BalanceSection 相关配置
  activeTab: BalanceType // 金额标签页状态
  currencyType: CurrencyType // 金额单位

  // AccountList 相关配置
  sortField: SortField // 排序字段
  sortOrder: SortOrder // 排序顺序

  // 自动刷新相关配置
  autoRefresh: boolean // 是否启用定时自动刷新
  refreshInterval: number // 刷新间隔（秒）
  refreshOnOpen: boolean // 打开插件时自动刷新
  showHealthStatus: boolean // 是否显示健康状态

  // WebDAV 备份/同步配置
  webdavUrl: string // 远程备份文件完整URL（例如：https://dav.example.com/backups/all-api-hub.json）
  webdavUsername: string // 用户名
  webdavPassword: string // 密码

  // 其他配置可在此扩展
  lastUpdated: number // 最后更新时间
}

// 存储键名常量
const STORAGE_KEYS = {
  USER_PREFERENCES: "user_preferences"
} as const

// 默认配置
const DEFAULT_PREFERENCES: UserPreferences = {
  activeTab: DATA_TYPE_CONSUMPTION,
  currencyType: "USD",
  sortField: DATA_TYPE_BALANCE, // 与 UI_CONSTANTS.SORT.DEFAULT_FIELD 保持一致
  sortOrder: "desc", // 与 UI_CONSTANTS.SORT.DEFAULT_ORDER 保持一致
  autoRefresh: true, // 默认启用自动刷新
  refreshInterval: 360, // 默认360秒刷新间隔
  refreshOnOpen: true, // 默认打开插件时自动刷新
  showHealthStatus: true, // 默认显示健康状态
  webdavUrl: "",
  webdavUsername: "",
  webdavPassword: "",
  lastUpdated: Date.now()
}

class UserPreferencesService {
  private storage: Storage

  constructor() {
    this.storage = new Storage({
      area: "local"
    })
  }

  /**
   * 获取用户偏好设置
   */
  async getPreferences(): Promise<UserPreferences> {
    try {
      const preferences = (await this.storage.get(
        STORAGE_KEYS.USER_PREFERENCES
      )) as UserPreferences
      return preferences || DEFAULT_PREFERENCES
    } catch (error) {
      console.error("获取用户偏好设置失败:", error)
      return DEFAULT_PREFERENCES
    }
  }

  /**
   * 保存用户偏好设置
   */
  async savePreferences(
    preferences: Partial<UserPreferences>
  ): Promise<boolean> {
    try {
      const currentPreferences = await this.getPreferences()
      const updatedPreferences: UserPreferences = {
        ...currentPreferences,
        ...preferences,
        lastUpdated: Date.now()
      }

      await this.storage.set(STORAGE_KEYS.USER_PREFERENCES, updatedPreferences)
      console.log("[UserPreferences] 偏好设置保存成功:", updatedPreferences)
      return true
    } catch (error) {
      console.error("[UserPreferences] 保存偏好设置失败:", error)
      return false
    }
  }

  /**
   * 更新活动标签页
   */
  async updateActiveTab(activeTab: BalanceType): Promise<boolean> {
    return this.savePreferences({ activeTab })
  }

  /**
   * 更新货币类型
   */
  async updateCurrencyType(currencyType: CurrencyType): Promise<boolean> {
    return this.savePreferences({ currencyType })
  }

  /**
   * 更新排序配置
   */
  async updateSortConfig(
    sortField: SortField,
    sortOrder: SortOrder
  ): Promise<boolean> {
    return this.savePreferences({ sortField, sortOrder })
  }

  /**
   * 更新自动刷新设置
   */
  async updateAutoRefreshSettings(settings: {
    autoRefresh?: boolean
    refreshInterval?: number
    refreshOnOpen?: boolean
    showHealthStatus?: boolean
  }): Promise<boolean> {
    return this.savePreferences(settings)
  }

  /**
   * 更新自动刷新开关
   */
  async updateAutoRefresh(autoRefresh: boolean): Promise<boolean> {
    return this.savePreferences({ autoRefresh })
  }

  /**
   * 更新刷新间隔
   */
  async updateRefreshInterval(refreshInterval: number): Promise<boolean> {
    return this.savePreferences({ refreshInterval })
  }

  /**
   * 更新打开插件时自动刷新设置
   */
  async updateRefreshOnOpen(refreshOnOpen: boolean): Promise<boolean> {
    return this.savePreferences({ refreshOnOpen })
  }

  /**
   * 更新健康状态显示设置
   */
  async updateShowHealthStatus(showHealthStatus: boolean): Promise<boolean> {
    return this.savePreferences({ showHealthStatus })
  }

  /**
   * 更新 WebDAV 设置
   */
  async updateWebdavSettings(settings: {
    webdavUrl?: string
    webdavUsername?: string
    webdavPassword?: string
  }): Promise<boolean> {
    return this.savePreferences(settings)
  }

  /**
   * 重置为默认设置
   */
  async resetToDefaults(): Promise<boolean> {
    try {
      await this.storage.set(STORAGE_KEYS.USER_PREFERENCES, DEFAULT_PREFERENCES)
      console.log("[UserPreferences] 已重置为默认设置")
      return true
    } catch (error) {
      console.error("[UserPreferences] 重置设置失败:", error)
      return false
    }
  }

  /**
   * 清空偏好设置
   */
  async clearPreferences(): Promise<boolean> {
    try {
      await this.storage.remove(STORAGE_KEYS.USER_PREFERENCES)
      console.log("[UserPreferences] 偏好设置已清空")
      return true
    } catch (error) {
      console.error("[UserPreferences] 清空偏好设置失败:", error)
      return false
    }
  }

  /**
   * 导出偏好设置
   */
  async exportPreferences(): Promise<UserPreferences> {
    return this.getPreferences()
  }

  /**
   * 导入偏好设置
   */
  async importPreferences(preferences: UserPreferences): Promise<boolean> {
    try {
      await this.storage.set(STORAGE_KEYS.USER_PREFERENCES, {
        ...preferences,
        lastUpdated: Date.now()
      })
      console.log("[UserPreferences] 偏好设置导入成功")
      return true
    } catch (error) {
      console.error("[UserPreferences] 导入偏好设置失败:", error)
      return false
    }
  }
}

// 创建单例实例
export const userPreferences = new UserPreferencesService()
