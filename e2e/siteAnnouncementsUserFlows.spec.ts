import { OPTIONS_PAGE_PATH } from "~/constants/extensionPages"
import { MENU_ITEM_IDS } from "~/constants/optionsMenuIds"
import { RuntimeActionIds } from "~/constants/runtimeActions"
import { SITE_TYPES } from "~/constants/siteType"
import { STORAGE_KEYS } from "~/services/core/storageKeys"
import { SITE_ANNOUNCEMENTS_ALARM_NAME } from "~/services/siteAnnouncements/constants"
import {
  SITE_ANNOUNCEMENT_PROVIDER_IDS,
  SITE_ANNOUNCEMENT_STATUS,
  type SiteAnnouncementStoreState,
} from "~/types/siteAnnouncements"
import { expect, test } from "~~/e2e/fixtures/extensionTest"
import {
  createStoredAccount,
  forceExtensionLanguage,
  installExtensionPageGuards,
  seedSiteAnnouncementsStore,
  seedStoredAccounts,
  seedUserPreferences,
  stubLlmMetadataIndex,
} from "~~/e2e/utils/commonUserFlows"
import {
  expectPermissionOnboardingHidden,
  getPlasmoStorageRawValue,
  getServiceWorker,
} from "~~/e2e/utils/extensionState"
import { waitForExtensionRoot } from "~~/e2e/utils/lazyLoading"

const SITE_ANNOUNCEMENTS_URL = (extensionId: string) =>
  `chrome-extension://${extensionId}/${OPTIONS_PAGE_PATH}#${MENU_ITEM_IDS.SITE_ANNOUNCEMENTS}`
const POLLING_ACCOUNT_ID = "announcement-polling-account"
const POLLING_SITE_NAME = "Announcement Polling Hub"
const POLLING_SITE_URL = "https://announcement-polling.example.com"
const POLLING_SITE_KEY = `notice:new-api:${POLLING_SITE_URL}`
const POLLING_NOTICE_TEXT =
  "Background polling notice. Scheduler fetched this through the MV3 alarm path."

async function readSiteAnnouncementsStore(
  serviceWorker: Awaited<ReturnType<typeof getServiceWorker>>,
): Promise<SiteAnnouncementStoreState | null> {
  const raw = await getPlasmoStorageRawValue<unknown>(
    serviceWorker,
    STORAGE_KEYS.SITE_ANNOUNCEMENTS_STORE,
  )

  if (typeof raw !== "string") return null

  return JSON.parse(raw) as SiteAnnouncementStoreState
}

async function getSiteAnnouncementAlarm(
  serviceWorker: Awaited<ReturnType<typeof getServiceWorker>>,
): Promise<{
  name: string
  scheduledTime?: number
  periodInMinutes?: number
} | null> {
  return await serviceWorker.evaluate(async (alarmName) => {
    const chromeApi = (globalThis as any).chrome
    const alarm = await chromeApi.alarms.get(alarmName)
    return alarm
      ? {
          name: alarm.name,
          scheduledTime: alarm.scheduledTime,
          periodInMinutes: alarm.periodInMinutes,
        }
      : null
  }, SITE_ANNOUNCEMENTS_ALARM_NAME)
}

async function scheduleSiteAnnouncementAlarmSoon(
  serviceWorker: Awaited<ReturnType<typeof getServiceWorker>>,
) {
  await serviceWorker.evaluate(async (alarmName) => {
    const chromeApi = (globalThis as any).chrome
    await chromeApi.alarms.create(alarmName, {
      when: Date.now() + 1_000,
    })
  }, SITE_ANNOUNCEMENTS_ALARM_NAME)
}

async function sendRuntimeActionFromPage<TResponse>(
  page: Parameters<typeof forceExtensionLanguage>[0],
  message: Record<string, unknown>,
): Promise<TResponse> {
  return await page.evaluate(async (payload) => {
    const chromeApi = (globalThis as any).chrome
    return await chromeApi.runtime.sendMessage(payload)
  }, message)
}

function createAnnouncementStore(): SiteAnnouncementStoreState["sites"] {
  const now = Date.now()
  const newApiSiteKey = "notice:new-api:https://announcements-a.example.com"
  const sub2apiSiteKey = "notice:sub2api:https://announcements-b.example.com"

  return {
    [newApiSiteKey]: {
      siteKey: newApiSiteKey,
      siteName: "Announcement Hub A",
      siteType: SITE_TYPES.NEW_API,
      baseUrl: "https://announcements-a.example.com",
      accountId: "announcement-account-a",
      providerId: SITE_ANNOUNCEMENT_PROVIDER_IDS.Common,
      status: SITE_ANNOUNCEMENT_STATUS.Success,
      lastCheckedAt: now,
      lastSuccessAt: now,
      records: [
        {
          id: "announcement-record-a",
          siteKey: newApiSiteKey,
          siteName: "Announcement Hub A",
          siteType: SITE_TYPES.NEW_API,
          baseUrl: "https://announcements-a.example.com",
          accountId: "announcement-account-a",
          providerId: SITE_ANNOUNCEMENT_PROVIDER_IDS.Common,
          title: "Scheduled maintenance window",
          content: "The provider will rotate billing infrastructure tonight.",
          fingerprint: "announcement-record-a-fp",
          firstSeenAt: now - 60_000,
          lastSeenAt: now,
          createdAt: now - 60_000,
          notifiedAt: now - 30_000,
          read: false,
        },
      ],
    },
    [sub2apiSiteKey]: {
      siteKey: sub2apiSiteKey,
      siteName: "Announcement Hub B",
      siteType: SITE_TYPES.SUB2API,
      baseUrl: "https://announcements-b.example.com",
      accountId: "announcement-account-b",
      providerId: SITE_ANNOUNCEMENT_PROVIDER_IDS.Sub2Api,
      status: SITE_ANNOUNCEMENT_STATUS.Success,
      lastCheckedAt: now,
      lastSuccessAt: now,
      records: [
        {
          id: "announcement-record-b",
          siteKey: sub2apiSiteKey,
          siteName: "Announcement Hub B",
          siteType: SITE_TYPES.SUB2API,
          baseUrl: "https://announcements-b.example.com",
          accountId: "announcement-account-b",
          providerId: SITE_ANNOUNCEMENT_PROVIDER_IDS.Sub2Api,
          title: "Model quota restored",
          content: "Sub2API quota has been restored for the public endpoint.",
          fingerprint: "announcement-record-b-fp",
          firstSeenAt: now - 120_000,
          lastSeenAt: now,
          createdAt: now - 120_000,
          read: true,
          readAt: now - 90_000,
        },
      ],
    },
  }
}

test.beforeEach(async ({ context, page }) => {
  installExtensionPageGuards(page)
  await forceExtensionLanguage(page, "en")
  await stubLlmMetadataIndex(context)
})

test("filters cached site announcements and marks unread items as read", async ({
  context,
  extensionId,
  page,
}) => {
  const serviceWorker = await getServiceWorker(context)
  await seedSiteAnnouncementsStore(serviceWorker, createAnnouncementStore())

  await page.goto(SITE_ANNOUNCEMENTS_URL(extensionId))
  await waitForExtensionRoot(page)
  await expectPermissionOnboardingHidden(page)

  await expect(
    page.getByRole("heading", { name: "Site Announcements" }),
  ).toBeVisible()
  await expect(page.getByText("Scheduled maintenance window")).toBeVisible()
  await expect(page.getByText("Model quota restored")).toBeVisible()
  await expect(page.getByText("Showing 2 of 2 announcements")).toBeVisible()

  await page.getByRole("combobox").nth(2).click()
  await page.getByRole("option", { name: "Unread" }).click()

  await expect(page.getByText("Scheduled maintenance window")).toBeVisible()
  await expect(page.getByText("Model quota restored")).toHaveCount(0)
  await expect(page.getByText(/Showing 1 of 2 announcement/)).toBeVisible()

  await page.getByText("Scheduled maintenance window").click()
  await expect(
    page.getByText("The provider will rotate billing infrastructure tonight."),
  ).toBeVisible()

  await page.getByRole("button", { name: "Mark read" }).click()

  await expect
    .poll(async () => {
      const store = await readSiteAnnouncementsStore(serviceWorker)
      return store?.sites[
        "notice:new-api:https://announcements-a.example.com"
      ]?.records.find((record) => record.id === "announcement-record-a")
    })
    .toMatchObject({ read: true })

  await expect(
    page.getByText("No announcements match the current filters"),
  ).toBeVisible()
})

test("polls site announcements through the MV3 alarm scheduler and stores fetched records", async ({
  context,
  extensionId,
  page,
}) => {
  const serviceWorker = await getServiceWorker(context)
  let noticeRequests = 0

  await context.route(`${POLLING_SITE_URL}/api/notice`, async (route) => {
    noticeRequests += 1
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        message: "ok",
        data: POLLING_NOTICE_TEXT,
      }),
    })
  })

  await seedUserPreferences(serviceWorker, {
    siteAnnouncementNotifications: {
      enabled: true,
      notificationEnabled: false,
      intervalMinutes: 15,
    },
  })
  await seedStoredAccounts(serviceWorker, [
    createStoredAccount({
      id: POLLING_ACCOUNT_ID,
      site_name: POLLING_SITE_NAME,
      site_url: POLLING_SITE_URL,
      site_type: SITE_TYPES.NEW_API,
      account_info: {
        id: 42,
        username: "announcement-polling-user",
        access_token: "announcement-polling-token",
      },
    }),
  ])

  await page.goto(SITE_ANNOUNCEMENTS_URL(extensionId))
  await waitForExtensionRoot(page)
  await expectPermissionOnboardingHidden(page)

  const statusResponse = await sendRuntimeActionFromPage<{
    success: boolean
    data?: unknown[]
    error?: string
  }>(page, {
    action: RuntimeActionIds.SiteAnnouncementsGetStatus,
  })
  expect(statusResponse).toMatchObject({ success: true })
  const settingsResponse = await sendRuntimeActionFromPage<{
    success: boolean
    data?: unknown
    error?: string
  }>(page, {
    action: RuntimeActionIds.SiteAnnouncementsUpdatePreferences,
    settings: {
      enabled: true,
      notificationEnabled: false,
      intervalMinutes: 15,
    },
  })
  expect(settingsResponse).toMatchObject({ success: true })
  const activeServiceWorker = await getServiceWorker(context)

  await expect
    .poll(() => getSiteAnnouncementAlarm(activeServiceWorker), {
      message: "site announcement scheduler should reconcile an enabled alarm",
    })
    .toMatchObject({
      name: SITE_ANNOUNCEMENTS_ALARM_NAME,
      periodInMinutes: 15,
    })

  await scheduleSiteAnnouncementAlarmSoon(activeServiceWorker)

  await expect
    .poll(
      async () => {
        const store = await readSiteAnnouncementsStore(activeServiceWorker)
        return store?.sites[POLLING_SITE_KEY]?.records[0]
      },
      {
        message: "site announcement alarm should fetch and persist records",
        timeout: 15_000,
      },
    )
    .toMatchObject({
      siteName: POLLING_SITE_NAME,
      siteType: SITE_TYPES.NEW_API,
      baseUrl: POLLING_SITE_URL,
      accountId: POLLING_ACCOUNT_ID,
      providerId: SITE_ANNOUNCEMENT_PROVIDER_IDS.Common,
      content: POLLING_NOTICE_TEXT,
      read: false,
    })
  expect(noticeRequests).toBeGreaterThanOrEqual(1)

  await page.reload()
  await waitForExtensionRoot(page)

  await expect(
    page.getByRole("heading", { name: "Background polling notice" }),
  ).toBeVisible()
  await expect(page.getByText(POLLING_SITE_NAME)).toBeVisible()
  await expect(page.getByText("Showing 1 of 1 announcement")).toBeVisible()
})
