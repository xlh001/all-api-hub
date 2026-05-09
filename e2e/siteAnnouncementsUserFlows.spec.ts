import { OPTIONS_PAGE_PATH } from "~/constants/extensionPages"
import { MENU_ITEM_IDS } from "~/constants/optionsMenuIds"
import { SITE_TYPES } from "~/constants/siteType"
import { STORAGE_KEYS } from "~/services/core/storageKeys"
import {
  SITE_ANNOUNCEMENT_PROVIDER_IDS,
  SITE_ANNOUNCEMENT_STATUS,
  type SiteAnnouncementStoreState,
} from "~/types/siteAnnouncements"
import { expect, test } from "~~/e2e/fixtures/extensionTest"
import {
  forceExtensionLanguage,
  installExtensionPageGuards,
  seedSiteAnnouncementsStore,
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
