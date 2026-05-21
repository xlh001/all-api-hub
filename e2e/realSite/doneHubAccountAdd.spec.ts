import { SITE_TYPES } from "~/constants/siteType"
import { test } from "~~/e2e/fixtures/extensionTest"
import {
  forceExtensionLanguage,
  seedUserPreferences,
  stubLlmMetadataIndex,
} from "~~/e2e/utils/commonUserFlows"
import { getServiceWorker } from "~~/e2e/utils/extensionState"
import { runCompatibleRealSiteAccountKeyFlow } from "~~/e2e/utils/realSite/compatibleAccountKeyFlow"
import {
  getDoneHubRealSiteSkipReason,
  loginToRealDoneHubSite,
  resolveDoneHubRealSiteConfig,
} from "~~/e2e/utils/realSite/doneHub"

test.describe("real-site E2E: DoneHub account add flow", () => {
  test.setTimeout(180_000)

  test.beforeEach(async ({ context, page }) => {
    await forceExtensionLanguage(page, "en")
    await stubLlmMetadataIndex(context)
  })

  test("logs into a real DoneHub site, saves the account, then creates and deletes a key", async ({
    context,
    extensionId,
    page,
  }) => {
    const realSite = resolveDoneHubRealSiteConfig()
    test.skip(
      !realSite.config,
      getDoneHubRealSiteSkipReason(realSite.missingEnvKeys),
    )

    const config = realSite.config!
    const serviceWorker = await getServiceWorker(context)

    await seedUserPreferences(serviceWorker, {
      managedSiteType: SITE_TYPES.DONE_HUB,
      autoFillCurrentSiteUrlOnAccountAdd: false,
      autoProvisionKeyOnAccountAdd: false,
      openChangelogOnUpdate: false,
    })

    const sitePage = await context.newPage()
    await runCompatibleRealSiteAccountKeyFlow({
      page,
      extensionId,
      sitePage,
      config,
      siteType: SITE_TYPES.DONE_HUB,
      expectedDetectedSiteType: SITE_TYPES.DONE_HUB,
      label: "DoneHub",
      login: loginToRealDoneHubSite,
    })
  })
})
