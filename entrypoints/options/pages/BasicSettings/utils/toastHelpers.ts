import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

/**
 * Shows a toast notification based on the success status of an operation.
 * @param success - Whether the operation was successful.
 * @param successMsg - The message to show on success.
 * @param errorMsg - The message to show on failure. Defaults to "Failed to save settings".
 */
export const showSettingsToast = (
  success: boolean,
  successMsg: string,
  errorMsg: string = ""
): void => {
  if (success) {
    toast.success(successMsg)
  } else {
    toast.error(errorMsg)
  }
}

/**
 * Shows a toast notification for an update operation.
 * @param success - Whether the update was successful.
 * @param setting - The name of the setting that was updated.
 */
export const showUpdateToast = (success: boolean, setting: string): void => {
  const { t } = useTranslation()
  const successMsg = `${setting} ${t("basicSettings.updateSuccess")}`
  const errorMsg = `${setting} ${t("basicSettings.updateFailed")}`
  showSettingsToast(success, successMsg, errorMsg)
}

/**
 * Shows a toast notification for a reset operation.
 * @param success - Whether the reset was successful.
 */
export const showResetToast = (success: boolean): void => {
  const { t } = useTranslation()
  const successMsg = t("basicSettings.resetSuccess")
  const errorMsg = t("basicSettings.resetFailed")
  showSettingsToast(success, successMsg, errorMsg)
}
