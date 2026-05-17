export const MODEL_LIST_TEST_IDS = {
  addApiCredentialProfileButton: "model-list-add-api-credential-profile-button",
} as const

/**
 * Returns the stable test id for a rendered batch verification row.
 */
export function getBatchVerifyRowTestId(itemKey: string) {
  return `batch-verify-row-${itemKey}`
}

/**
 * Returns the stable test id for a batch verification model checkbox.
 */
export function getBatchVerifyModelCheckboxTestId(itemKey: string) {
  return `batch-verify-model-checkbox-${itemKey}`
}
