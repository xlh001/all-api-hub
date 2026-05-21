import { SITE_TYPES } from "~/constants/siteType"
import { expect, test } from "~~/e2e/fixtures/extensionTest"
import {
  forceExtensionLanguage,
  seedUserPreferences,
  stubLlmMetadataIndex,
} from "~~/e2e/utils/commonUserFlows"
import { getServiceWorker } from "~~/e2e/utils/extensionState"
import { runRealSiteAccountKeyFlow } from "~~/e2e/utils/realSite/accountKeyFlow"
import {
  getSub2ApiRealSiteSkipReason,
  loginToRealSub2ApiSite,
  resolveSub2ApiRealSiteConfig,
} from "~~/e2e/utils/realSite/sub2api"

test.describe("real-site E2E: Sub2API auto-detect account add flow", () => {
  test.setTimeout(180_000)

  test.beforeEach(async ({ context, page }) => {
    await forceExtensionLanguage(page, "en")
    await stubLlmMetadataIndex(context)
  })

  test("logs into a real Sub2API site, saves the account, then creates and deletes a key", async ({
    context,
    extensionId,
    page,
  }) => {
    const realSite = resolveSub2ApiRealSiteConfig()
    test.skip(
      !realSite.config,
      getSub2ApiRealSiteSkipReason(realSite.missingEnvKeys),
    )

    const config = realSite.config!
    const serviceWorker = await getServiceWorker(context)

    await seedUserPreferences(serviceWorker, {
      autoFillCurrentSiteUrlOnAccountAdd: false,
      autoProvisionKeyOnAccountAdd: false,
      openChangelogOnUpdate: false,
      tempWindowFallback: {
        enabled: false,
      },
    })

    const sitePage = await context.newPage()
    await runRealSiteAccountKeyFlow({
      page,
      extensionId,
      sitePage,
      baseUrl: config.baseUrl,
      siteType: SITE_TYPES.SUB2API,
      expectedDetectedSiteType: SITE_TYPES.SUB2API,
      label: "Sub2API",
      login: async (realSitePage) => {
        const loginResult = await loginToRealSub2ApiSite(realSitePage, config)
        expect(loginResult.authState.accessToken).not.toBe("")

        return {
          prepareDetectedDialog: async (dialog) => {
            await expect(dialog.siteNameInput).toHaveValue(/.+/, {
              timeout: 60_000,
            })

            await expect(dialog.userIdInput).toHaveValue(/.+/, {
              timeout: 60_000,
            })
            await expect(dialog.accessTokenInput).toHaveValue(
              loginResult.authState.accessToken,
              {
                timeout: 60_000,
              },
            )
            await expect(dialog.sub2apiRefreshTokenSwitch).toHaveAttribute(
              "aria-checked",
              "false",
            )
            await expect(dialog.sub2apiImportSessionButton).toHaveCount(0)

            if (!loginResult.authState.refreshToken) {
              return
            }

            await dialog.sub2apiRefreshTokenSwitch.click()
            await expect(dialog.sub2apiRefreshTokenSwitch).toHaveAttribute(
              "aria-checked",
              "true",
            )

            const importSessionButtonVisible =
              await dialog.sub2apiImportSessionButton
                .waitFor({ state: "visible", timeout: 5_000 })
                .then(() => true)
                .catch(() => false)

            if (!importSessionButtonVisible) {
              return
            }

            await dialog.sub2apiImportSessionButton.click()
            await expect(dialog.sub2apiRefreshTokenInput).toHaveValue(
              loginResult.authState.refreshToken,
              {
                timeout: 60_000,
              },
            )
          },
        }
      },
    })
  })
})
