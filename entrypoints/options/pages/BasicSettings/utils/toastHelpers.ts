import toast from "react-hot-toast"

/**
 * Shows a toast notification based on the success status of an operation.
 * @param success - Whether the operation was successful.
 * @param successMsg - The message to show on success.
 * @param errorMsg - The message to show on failure. Defaults to "Failed to save settings".
 */
export const showSettingsToast = (
  success: boolean,
  successMsg: string,
  errorMsg: string = "保存设置失败"
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
  const successMsg = `${setting} 更新成功`
  const errorMsg = `${setting} 更新失败`
  showSettingsToast(success, successMsg, errorMsg)
}

/**
 * Shows a toast notification for a reset operation.
 * @param success - Whether the reset was successful.
 */
export const showResetToast = (success: boolean): void => {
  const successMsg = "所有设置已重置为默认值"
  const errorMsg = "重置设置失败"
  showSettingsToast(success, successMsg, errorMsg)
}
