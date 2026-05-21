import type { Page } from "@playwright/test"

import {
  createAndVerifyTokenFromApp,
  deleteTokenFromKeyManagementPage,
} from "~~/e2e/utils/accountLifecycle"

const TEST_TOKEN_NAME_PREFIX = "AAH E2E"
const MAX_TEST_TOKEN_NAME_LENGTH = 30
const MAX_TEST_TOKEN_LABEL_LENGTH = 8
const MAX_TEST_TOKEN_RUN_ID_LENGTH = 12

export async function runRealSiteKeyLifecycleFromAccountRow(params: {
  page: Page
  extensionId: string
  siteType: string
  baseUrl: string
  label: string
}) {
  const tokenName = buildRealSiteTestTokenName({
    label: params.label,
    runId: buildRealSiteRunId(),
  })
  let createdTokenName: string | null = null
  let keyManagementPage = params.page

  try {
    const tokenResult = await createAndVerifyTokenFromApp({
      page: params.page,
      extensionId: params.extensionId,
      siteType: params.siteType,
      baseUrl: params.baseUrl,
      tokenName,
      openFromAccountRow: true,
    })
    keyManagementPage = tokenResult.page
    createdTokenName = tokenName
  } finally {
    if (createdTokenName) {
      await deleteTokenFromKeyManagementPage({
        page: keyManagementPage,
        token: createdTokenName,
      })
    }
  }
}

export function buildRealSiteTestTokenName(params: {
  label: string
  runId: string
}) {
  const label = truncateTokenNamePart(
    normalizeTokenNameLabel(params.label),
    MAX_TEST_TOKEN_LABEL_LENGTH,
  )
  const runId = truncateTokenNamePart(
    normalizeTokenNameRunId(params.runId),
    MAX_TEST_TOKEN_RUN_ID_LENGTH,
  )

  return [TEST_TOKEN_NAME_PREFIX, label, runId]
    .filter(Boolean)
    .join(" ")
    .slice(0, MAX_TEST_TOKEN_NAME_LENGTH)
}

export function buildRealSiteRunId() {
  return `${Date.now().toString(36).slice(-6)}${Math.random()
    .toString(36)
    .slice(2, 6)}`
}

function normalizeTokenNameLabel(value: string) {
  return value
    .trim()
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .trim()
}

function normalizeTokenNameRunId(value: string) {
  return value
    .trim()
    .replace(/[:#]+/gu, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .trim()
}

function truncateTokenNamePart(value: string, maxLength: number) {
  return value.slice(0, maxLength).replace(/-+$/gu, "")
}
