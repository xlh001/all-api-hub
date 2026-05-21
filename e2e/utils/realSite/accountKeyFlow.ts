import type { Page } from "@playwright/test"

import { saveAutoDetectedAccountFromApp } from "~~/e2e/utils/accountLifecycle"
import { installExtensionPageGuards } from "~~/e2e/utils/commonUserFlows"
import type { AccountAddDialog } from "~~/e2e/utils/realSite/accountAdd"
import { runRealSiteKeyLifecycleFromAccountRow } from "~~/e2e/utils/realSite/keyManagement"

type RealSiteAccountKeyLoginResult = void | {
  prepareDetectedDialog?: (dialog: AccountAddDialog) => Promise<void>
}

export async function runRealSiteAccountKeyFlow(params: {
  page: Page
  extensionId: string
  sitePage: Page
  baseUrl: string
  siteType: string
  expectedDetectedSiteType?: string
  label: string
  login: (sitePage: Page) => Promise<RealSiteAccountKeyLoginResult>
}) {
  try {
    const loginResult = await params.login(params.sitePage)
    installExtensionPageGuards(params.page)

    const savedAccount = await saveAutoDetectedAccountFromApp({
      page: params.page,
      extensionId: params.extensionId,
      baseUrl: params.baseUrl,
      siteType: params.siteType,
      expectedSiteType: params.expectedDetectedSiteType,
      prepareDetectedDialog: loginResult?.prepareDetectedDialog,
    })

    await runRealSiteKeyLifecycleFromAccountRow({
      page: params.page,
      extensionId: params.extensionId,
      siteType: savedAccount.siteType,
      baseUrl: savedAccount.baseUrl,
      label: params.label,
    })
  } finally {
    await params.sitePage.close()
  }
}
