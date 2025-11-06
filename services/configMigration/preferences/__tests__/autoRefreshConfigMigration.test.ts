import { describe, it, expect } from "vitest"
import { migrateAutoRefreshConfig } from "../autoRefreshConfigMigration"
import type { UserPreferences } from "../../../userPreferences"

describe("autoRefreshConfigMigration", () => {
  it("should migrate flat auto-refresh fields to nested structure", () => {
    const oldPrefs: UserPreferences = {
      activeTab: "consumption",
      currencyType: "USD",
      sortField: "balance",
      sortOrder: "desc",
      autoRefresh: true,
      refreshInterval: 300,
      minRefreshInterval: 45,
      refreshOnOpen: false,
      showHealthStatus: true,
      webdav: {
        url: "",
        username: "",
        password: "",
        autoSync: false,
        syncInterval: 3600,
        syncStrategy: "merge"
      },
      lastUpdated: Date.now(),
      newApiBaseUrl: "",
      newApiAdminToken: "",
      newApiUserId: "",
      newApiModelSync: {
        enabled: false,
        interval: 86400000,
        concurrency: 2,
        maxRetries: 2,
        rateLimit: { requestsPerMinute: 20, burst: 5 }
      },
      autoCheckin: { globalEnabled: false, windowStart: "09:00", windowEnd: "18:00" },
      themeMode: "system",
      language: "en",
      preferencesVersion: 3
    }

    const migratedPrefs = migrateAutoRefreshConfig(oldPrefs)

    expect(migratedPrefs.accountAutoRefresh).toBeDefined()
    expect(migratedPrefs.accountAutoRefresh.enabled).toBe(true)
    expect(migratedPrefs.accountAutoRefresh.interval).toBe(300)
    expect(migratedPrefs.accountAutoRefresh.minInterval).toBe(45)
    expect(migratedPrefs.accountAutoRefresh.refreshOnOpen).toBe(false)

    // Check backward compatibility fields
    expect(migratedPrefs.autoRefresh).toBe(true)
    expect(migratedPrefs.refreshInterval).toBe(300)
    expect(migratedPrefs.minRefreshInterval).toBe(45)
    expect(migratedPrefs.refreshOnOpen).toBe(false)
  })

  it("should prioritize old fields over new ones during migration", () => {
    const mixedPrefs: UserPreferences = {
      activeTab: "consumption",
      currencyType: "USD",
      sortField: "balance",
      sortOrder: "desc",
      autoRefresh: false,
      refreshInterval: 180,
      minRefreshInterval: 30,
      refreshOnOpen: true,
      accountAutoRefresh: {
        enabled: true,
        interval: 360,
        minInterval: 60,
        refreshOnOpen: false
      },
      showHealthStatus: true,
      webdav: {
        url: "",
        username: "",
        password: "",
        autoSync: false,
        syncInterval: 3600,
        syncStrategy: "merge"
      },
      lastUpdated: Date.now(),
      newApiBaseUrl: "",
      newApiAdminToken: "",
      newApiUserId: "",
      newApiModelSync: {
        enabled: false,
        interval: 86400000,
        concurrency: 2,
        maxRetries: 2,
        rateLimit: { requestsPerMinute: 20, burst: 5 }
      },
      autoCheckin: { globalEnabled: false, windowStart: "09:00", windowEnd: "18:00" },
      themeMode: "system",
      language: "en",
      preferencesVersion: 3
    }

    const migratedPrefs = migrateAutoRefreshConfig(mixedPrefs)

    // Old fields should take priority
    expect(migratedPrefs.accountAutoRefresh.enabled).toBe(false)
    expect(migratedPrefs.accountAutoRefresh.interval).toBe(180)
    expect(migratedPrefs.accountAutoRefresh.minInterval).toBe(30)
    expect(migratedPrefs.accountAutoRefresh.refreshOnOpen).toBe(true)
  })

  it("should use defaults when no old or new fields exist", () => {
    const emptyPrefs: Partial<UserPreferences> = {
      activeTab: "consumption",
      currencyType: "USD",
      sortField: "balance",
      sortOrder: "desc",
      showHealthStatus: true,
      webdav: {
        url: "",
        username: "",
        password: "",
        autoSync: false,
        syncInterval: 3600,
        syncStrategy: "merge"
      },
      lastUpdated: Date.now(),
      newApiBaseUrl: "",
      newApiAdminToken: "",
      newApiUserId: "",
      newApiModelSync: {
        enabled: false,
        interval: 86400000,
        concurrency: 2,
        maxRetries: 2,
        rateLimit: { requestsPerMinute: 20, burst: 5 }
      },
      autoCheckin: { globalEnabled: false, windowStart: "09:00", windowEnd: "18:00" },
      themeMode: "system",
      language: "en",
      preferencesVersion: 3
    } as UserPreferences

    const migratedPrefs = migrateAutoRefreshConfig(emptyPrefs)

    // Should use defaults
    expect(migratedPrefs.accountAutoRefresh.enabled).toBe(true)
    expect(migratedPrefs.accountAutoRefresh.interval).toBe(360)
    expect(migratedPrefs.accountAutoRefresh.minInterval).toBe(60)
    expect(migratedPrefs.accountAutoRefresh.refreshOnOpen).toBe(true)
  })

  it("should not migrate if already using new structure", () => {
    const newPrefs: UserPreferences = {
      activeTab: "consumption",
      currencyType: "USD",
      sortField: "balance",
      sortOrder: "desc",
      accountAutoRefresh: {
        enabled: true,
        interval: 360,
        minInterval: 60,
        refreshOnOpen: true
      },
      showHealthStatus: true,
      webdav: {
        url: "",
        username: "",
        password: "",
        autoSync: false,
        syncInterval: 3600,
        syncStrategy: "merge"
      },
      lastUpdated: Date.now(),
      newApiBaseUrl: "",
      newApiAdminToken: "",
      newApiUserId: "",
      newApiModelSync: {
        enabled: false,
        interval: 86400000,
        concurrency: 2,
        maxRetries: 2,
        rateLimit: { requestsPerMinute: 20, burst: 5 }
      },
      autoCheckin: { globalEnabled: false, windowStart: "09:00", windowEnd: "18:00" },
      themeMode: "system",
      language: "en",
      preferencesVersion: 3
    }

    const migratedPrefs = migrateAutoRefreshConfig(newPrefs)

    // Should remain the same
    expect(migratedPrefs.accountAutoRefresh.enabled).toBe(true)
    expect(migratedPrefs.accountAutoRefresh.interval).toBe(360)
    expect(migratedPrefs.accountAutoRefresh.minInterval).toBe(60)
    expect(migratedPrefs.accountAutoRefresh.refreshOnOpen).toBe(true)
  })
})
