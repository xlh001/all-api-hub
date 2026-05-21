import type { Page } from "@playwright/test"

import type { AccountSiteType } from "~/constants/siteType"
import { expect } from "~~/e2e/fixtures/extensionTest"
import { runRealSiteAccountKeyFlow } from "~~/e2e/utils/realSite/accountKeyFlow"
import type { CompatibleApiRealSiteConfig } from "~~/e2e/utils/realSite/compatibleApi"

type CompatibleRealSiteLoginResult = {
  user: Record<string, unknown>
}

export async function runCompatibleRealSiteAccountKeyFlow(params: {
  page: Page
  extensionId: string
  sitePage: Page
  config: CompatibleApiRealSiteConfig
  siteType: AccountSiteType
  label: string
  expectedDetectedSiteType?: AccountSiteType
  login: (
    page: Page,
    config: CompatibleApiRealSiteConfig,
  ) => Promise<CompatibleRealSiteLoginResult>
}) {
  await runRealSiteAccountKeyFlow({
    page: params.page,
    extensionId: params.extensionId,
    sitePage: params.sitePage,
    baseUrl: params.config.baseUrl,
    siteType: params.siteType,
    expectedDetectedSiteType: params.expectedDetectedSiteType,
    label: params.label,
    login: async (sitePage) => {
      const loginResult = await params.login(sitePage, params.config)
      expect(loginResult.user).toBeTruthy()
    },
  })
}
