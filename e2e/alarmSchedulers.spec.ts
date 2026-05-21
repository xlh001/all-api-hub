import type { Page, Worker } from "@playwright/test"

import { OPTIONS_PAGE_PATH } from "~/constants/extensionPages"
import { RuntimeActionIds } from "~/constants/runtimeActions"
import { SITE_TYPES } from "~/constants/siteType"
import { DAILY_BALANCE_HISTORY_ALARM_NAME } from "~/services/history/dailyBalanceHistory/constants"
import { USAGE_HISTORY_ALARM_NAME } from "~/services/history/usageHistory/constants"
import { DEFAULT_PREFERENCES } from "~/services/preferences/userPreferences"
import { SITE_ANNOUNCEMENTS_ALARM_NAME } from "~/services/siteAnnouncements/constants"
import { AUTO_CHECKIN_SCHEDULE_MODE } from "~/types/autoCheckin"
import { USAGE_HISTORY_SCHEDULE_MODE } from "~/types/usageHistory"
import { WEBDAV_SYNC_STRATEGIES } from "~/types/webdav"
import { expect, test } from "~~/e2e/fixtures/extensionTest"
import {
  forceExtensionLanguage,
  installExtensionPageGuards,
  seedUserPreferences,
  stubLlmMetadataIndex,
} from "~~/e2e/utils/commonUserFlows"
import {
  expectPermissionOnboardingHidden,
  getServiceWorker,
} from "~~/e2e/utils/extensionState"
import { waitForExtensionRoot } from "~~/e2e/utils/lazyLoading"

const AUTO_CHECKIN_LEGACY_ALARM_NAME = "autoCheckin"
const AUTO_CHECKIN_DAILY_ALARM_NAME = "autoCheckinDaily"
const AUTO_CHECKIN_RETRY_ALARM_NAME = "autoCheckinRetry"
const MANAGED_SITE_MODEL_SYNC_ALARM_NAME = "managedSiteModelSync"
const RELEASE_UPDATE_ALARM_NAME = "releaseUpdateDailyCheck"
const WEBDAV_AUTO_SYNC_ALARM_NAME = "webdavAutoSync"
const WEBDAV_BEST_EFFORT_UPLOAD_ALARM_NAME = "webdavAutoSyncBestEffortUpload"

const EXPECTED_ENABLED_ALARMS = [
  AUTO_CHECKIN_DAILY_ALARM_NAME,
  DAILY_BALANCE_HISTORY_ALARM_NAME,
  MANAGED_SITE_MODEL_SYNC_ALARM_NAME,
  RELEASE_UPDATE_ALARM_NAME,
  SITE_ANNOUNCEMENTS_ALARM_NAME,
  USAGE_HISTORY_ALARM_NAME,
  WEBDAV_AUTO_SYNC_ALARM_NAME,
] as const

const CONFIGURABLE_ALARMS = [
  AUTO_CHECKIN_LEGACY_ALARM_NAME,
  AUTO_CHECKIN_DAILY_ALARM_NAME,
  AUTO_CHECKIN_RETRY_ALARM_NAME,
  DAILY_BALANCE_HISTORY_ALARM_NAME,
  MANAGED_SITE_MODEL_SYNC_ALARM_NAME,
  SITE_ANNOUNCEMENTS_ALARM_NAME,
  USAGE_HISTORY_ALARM_NAME,
  WEBDAV_AUTO_SYNC_ALARM_NAME,
  WEBDAV_BEST_EFFORT_UPLOAD_ALARM_NAME,
] as const

type AlarmSnapshot = {
  name: string
  scheduledTime?: number
  periodInMinutes?: number
} | null

async function openExtensionPage(page: Page, extensionId: string) {
  installExtensionPageGuards(page)
  await forceExtensionLanguage(page, "en")
  await page.goto(`chrome-extension://${extensionId}/${OPTIONS_PAGE_PATH}`)
  await waitForExtensionRoot(page)
  await expectPermissionOnboardingHidden(page)
}

async function sendRuntimeActionFromPage<TResponse>(
  page: Page,
  message: Record<string, unknown>,
): Promise<TResponse> {
  return await page.evaluate(async (payload) => {
    const chromeApi = (globalThis as any).chrome
    return await chromeApi.runtime.sendMessage(payload)
  }, message)
}

async function getAlarm(
  serviceWorker: Worker,
  alarmName: string,
): Promise<AlarmSnapshot> {
  return await serviceWorker.evaluate(async (name) => {
    const chromeApi = (globalThis as any).chrome
    const alarm = await chromeApi.alarms.get(name)
    return alarm
      ? {
          name: alarm.name,
          scheduledTime: alarm.scheduledTime,
          periodInMinutes: alarm.periodInMinutes,
        }
      : null
  }, alarmName)
}

async function getAlarmsByName(serviceWorker: Worker) {
  return await serviceWorker.evaluate(async () => {
    const chromeApi = (globalThis as any).chrome
    const alarms = await chromeApi.alarms.getAll()
    return Object.fromEntries(
      alarms.map(
        (alarm: {
          name: string
          scheduledTime?: number
          periodInMinutes?: number
        }) => [
          alarm.name,
          {
            name: alarm.name,
            scheduledTime: alarm.scheduledTime,
            periodInMinutes: alarm.periodInMinutes,
          },
        ],
      ),
    ) as Record<string, NonNullable<AlarmSnapshot>>
  })
}

async function clearAlarms(
  serviceWorker: Worker,
  alarmNames: readonly string[],
) {
  await serviceWorker.evaluate(
    async (names) => {
      const chromeApi = (globalThis as any).chrome
      await Promise.all(
        names.map((name: string) => chromeApi.alarms.clear(name)),
      )
    },
    [...alarmNames],
  )
}

async function createStaleAlarms(
  serviceWorker: Worker,
  alarmNames: readonly string[],
) {
  await serviceWorker.evaluate(
    async (names) => {
      const chromeApi = (globalThis as any).chrome
      await Promise.all(
        names.map((name: string) =>
          chromeApi.alarms.create(name, {
            delayInMinutes: 1,
            periodInMinutes: 1,
          }),
        ),
      )
    },
    [...alarmNames],
  )
}

async function enableAlarmBackedFeatures(page: Page, serviceWorker: Worker) {
  await seedUserPreferences(serviceWorker, {
    webdav: {
      ...DEFAULT_PREFERENCES.webdav,
      autoSync: true,
      url: "https://webdav-alarm.example.com/remote.php/dav/files/e2e",
      username: "e2e-webdav-user",
      password: "e2e-webdav-password",
      syncInterval: 120,
      syncStrategy: WEBDAV_SYNC_STRATEGIES.MERGE,
      syncData: {
        accounts: true,
        bookmarks: false,
        apiCredentialProfiles: false,
        preferences: false,
      },
    },
    newApi: {
      ...DEFAULT_PREFERENCES.newApi,
      baseUrl: "https://managed-alarm.example.com",
      adminToken: "managed-alarm-token",
      userId: "1",
    },
    managedSiteType: SITE_TYPES.NEW_API,
  })

  const responses = [
    await sendRuntimeActionFromPage<{ success: boolean }>(page, {
      action: RuntimeActionIds.UsageHistoryUpdateSettings,
      settings: {
        enabled: true,
        scheduleMode: USAGE_HISTORY_SCHEDULE_MODE.ALARM,
        syncIntervalMinutes: 17,
      },
    }),
    await sendRuntimeActionFromPage<{ success: boolean }>(page, {
      action: RuntimeActionIds.BalanceHistoryUpdateSettings,
      settings: {
        enabled: true,
        endOfDayCapture: { enabled: true },
        retentionDays: 365,
      },
    }),
    await sendRuntimeActionFromPage<{ success: boolean }>(page, {
      action: RuntimeActionIds.WebdavAutoSyncUpdateSettings,
      settings: {
        autoSync: true,
        syncInterval: 120,
        syncStrategy: WEBDAV_SYNC_STRATEGIES.MERGE,
      },
    }),
    await sendRuntimeActionFromPage<{ success: boolean }>(page, {
      action: RuntimeActionIds.ModelSyncUpdateSettings,
      settings: {
        enableSync: true,
        intervalMs: 5 * 60 * 1000,
      },
    }),
    await sendRuntimeActionFromPage<{ success: boolean }>(page, {
      action: RuntimeActionIds.AutoCheckinUpdateSettings,
      settings: {
        globalEnabled: true,
        pretriggerDailyOnUiOpen: false,
        notifyUiOnCompletion: true,
        windowStart: "00:00",
        windowEnd: "23:59",
        scheduleMode: AUTO_CHECKIN_SCHEDULE_MODE.DETERMINISTIC,
        deterministicTime: "23:58",
        retryStrategy: {
          enabled: false,
          intervalMinutes: 30,
          maxAttemptsPerDay: 1,
        },
      },
    }),
    await sendRuntimeActionFromPage<{ success: boolean }>(page, {
      action: RuntimeActionIds.SiteAnnouncementsUpdatePreferences,
      settings: {
        enabled: true,
        notificationEnabled: false,
        intervalMinutes: 15,
      },
    }),
  ]

  expect(responses).toEqual(
    responses.map(() => expect.objectContaining({ success: true })),
  )
}

async function disableConfigurableAlarmFeatures(page: Page) {
  const responses = [
    await sendRuntimeActionFromPage<{ success: boolean }>(page, {
      action: RuntimeActionIds.UsageHistoryUpdateSettings,
      settings: {
        enabled: false,
        scheduleMode: USAGE_HISTORY_SCHEDULE_MODE.AFTER_REFRESH,
      },
    }),
    await sendRuntimeActionFromPage<{ success: boolean }>(page, {
      action: RuntimeActionIds.BalanceHistoryUpdateSettings,
      settings: {
        enabled: false,
        endOfDayCapture: { enabled: false },
      },
    }),
    await sendRuntimeActionFromPage<{ success: boolean }>(page, {
      action: RuntimeActionIds.WebdavAutoSyncUpdateSettings,
      settings: {
        autoSync: false,
      },
    }),
    await sendRuntimeActionFromPage<{ success: boolean }>(page, {
      action: RuntimeActionIds.ModelSyncUpdateSettings,
      settings: {
        enableSync: false,
      },
    }),
    await sendRuntimeActionFromPage<{ success: boolean }>(page, {
      action: RuntimeActionIds.AutoCheckinUpdateSettings,
      settings: {
        globalEnabled: false,
      },
    }),
    await sendRuntimeActionFromPage<{ success: boolean }>(page, {
      action: RuntimeActionIds.SiteAnnouncementsUpdatePreferences,
      settings: {
        enabled: false,
      },
    }),
  ]

  expect(responses).toEqual(
    responses.map(() => expect.objectContaining({ success: true })),
  )
}

test.beforeEach(async ({ context, page }) => {
  installExtensionPageGuards(page)
  await forceExtensionLanguage(page, "en")
  await stubLlmMetadataIndex(context)
})

test("reconciles every enabled background scheduler into production MV3 alarms without schedule drift", async ({
  context,
  extensionId,
  page,
}) => {
  const serviceWorker = await getServiceWorker(context)
  await clearAlarms(serviceWorker, CONFIGURABLE_ALARMS)
  await openExtensionPage(page, extensionId)
  await enableAlarmBackedFeatures(page, serviceWorker)

  await expect
    .poll(() => getAlarmsByName(serviceWorker), {
      message: "enabled alarm-backed features should create their MV3 alarms",
    })
    .toEqual(
      expect.objectContaining({
        [AUTO_CHECKIN_DAILY_ALARM_NAME]: expect.objectContaining({
          name: AUTO_CHECKIN_DAILY_ALARM_NAME,
        }),
        [DAILY_BALANCE_HISTORY_ALARM_NAME]: expect.objectContaining({
          name: DAILY_BALANCE_HISTORY_ALARM_NAME,
        }),
        [MANAGED_SITE_MODEL_SYNC_ALARM_NAME]: expect.objectContaining({
          name: MANAGED_SITE_MODEL_SYNC_ALARM_NAME,
          periodInMinutes: 5,
        }),
        [RELEASE_UPDATE_ALARM_NAME]: expect.objectContaining({
          name: RELEASE_UPDATE_ALARM_NAME,
          periodInMinutes: 24 * 60,
        }),
        [SITE_ANNOUNCEMENTS_ALARM_NAME]: expect.objectContaining({
          name: SITE_ANNOUNCEMENTS_ALARM_NAME,
          periodInMinutes: 15,
        }),
        [USAGE_HISTORY_ALARM_NAME]: expect.objectContaining({
          name: USAGE_HISTORY_ALARM_NAME,
          periodInMinutes: 17,
        }),
        [WEBDAV_AUTO_SYNC_ALARM_NAME]: expect.objectContaining({
          name: WEBDAV_AUTO_SYNC_ALARM_NAME,
          periodInMinutes: 2,
        }),
      }),
    )

  const beforeReconcile = await getAlarmsByName(serviceWorker)

  await enableAlarmBackedFeatures(page, serviceWorker)

  await expect
    .poll(() => getAlarmsByName(serviceWorker), {
      message:
        "repeated scheduler reconciliation should preserve matching alarms",
    })
    .toEqual(
      expect.objectContaining(
        Object.fromEntries(
          EXPECTED_ENABLED_ALARMS.map((name) => [
            name,
            expect.objectContaining({
              name,
              scheduledTime: beforeReconcile[name].scheduledTime,
              periodInMinutes: beforeReconcile[name].periodInMinutes,
            }),
          ]),
        ),
      ),
    )
})

test("clears scheduler-owned MV3 alarms when features are disabled", async ({
  context,
  extensionId,
  page,
}) => {
  const serviceWorker = await getServiceWorker(context)
  await openExtensionPage(page, extensionId)
  await createStaleAlarms(serviceWorker, CONFIGURABLE_ALARMS)

  await expect
    .poll(() => getAlarmsByName(serviceWorker), {
      message: "test setup should create stale scheduler-owned alarms",
    })
    .toEqual(
      expect.objectContaining(
        Object.fromEntries(
          CONFIGURABLE_ALARMS.map((name) => [
            name,
            expect.objectContaining({ name }),
          ]),
        ),
      ),
    )

  await disableConfigurableAlarmFeatures(page)

  for (const alarmName of CONFIGURABLE_ALARMS) {
    await expect
      .poll(() => getAlarm(serviceWorker, alarmName), {
        message: `${alarmName} should be cleared by its owning scheduler`,
      })
      .toBeNull()
  }
})
