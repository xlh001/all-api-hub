import type { ApiVerificationProbeId } from "~/services/verification/aiApiVerification"

export const API_CREDENTIAL_PROFILES_TEST_IDS = {
  addButton: "api-credential-profiles-add-button",
  dialog: "api-credential-profile-dialog",
  dialogSaveButton: "api-credential-profile-dialog-save-button",
  popupView: "api-credential-profiles-popup-view",
  verifyModelId: "profile-verify-model-id",
  telemetryBalance: "api-credential-telemetry-balance",
  telemetryTodayUsage: "api-credential-telemetry-today-usage",
  telemetryTodayRequests: "api-credential-telemetry-today-requests",
  telemetryModels: "api-credential-telemetry-models",
} as const

const API_CREDENTIAL_PROFILE_VERIFY_PROBE_TEST_ID_PREFIX =
  "profile-verify-probe-"

/**
 * Returns the stable test id for an API credential verification probe card.
 */
export function getApiCredentialProfileVerifyProbeTestId(
  probeId: ApiVerificationProbeId,
) {
  return `${API_CREDENTIAL_PROFILE_VERIFY_PROBE_TEST_ID_PREFIX}${probeId}`
}
