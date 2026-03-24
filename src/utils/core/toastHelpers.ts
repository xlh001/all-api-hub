import toast from "react-hot-toast"

import { t } from "~/utils/i18n/core"

type ToastResultObject = {
  success: boolean
  message?: string
  successFallback?: string
  errorFallback?: string
}

type ToastParams =
  | [success: boolean, successMsg?: string, errorMsg?: string]
  | [result: ToastResultObject]

const normalizeToastMessage = (message?: string) => {
  const trimmed = message?.trim()
  return trimmed ? trimmed : null
}

const getDefaultToastMessage = (success: boolean) =>
  success
    ? t("messages:toast.success.operationCompleted")
    : t("messages:toast.error.operationFailedGeneric")

/**
 * Shows a toast notification based on the success status of an operation.
 */
export function showResultToast(...args: ToastParams): void {
  if (typeof args[0] === "boolean") {
    // 兼容旧逻辑
    const [success, successMsg, errorMsg] = args
    const message = normalizeToastMessage(success ? successMsg : errorMsg)
    toast[success ? "success" : "error"](
      message || getDefaultToastMessage(success),
    )
  } else {
    // 支持对象参数
    const { success, message, successFallback, errorFallback } = args[0]
    const normalizedMessage = normalizeToastMessage(message)
    const fallbackMessage = normalizeToastMessage(
      success ? successFallback : errorFallback,
    )

    toast[success ? "success" : "error"](
      normalizedMessage || fallbackMessage || getDefaultToastMessage(success),
    )
  }
}

/**
 * Shows a toast notification for an update operation.
 * @param success - Whether the update was successful.
 * @param setting - The name of the setting that was updated.
 */
export const showUpdateToast = (success: boolean, setting: string): void => {
  const successMsg = t("settings:messages.updateSuccess", { name: setting })
  const errorMsg = t("settings:messages.updateFailed", { name: setting })
  showResultToast(success, successMsg, errorMsg)
}

/**
 * Shows a toast notification for a reset operation.
 * @param success - Whether the reset was successful.
 */
export const showResetToast = (success: boolean): void => {
  const successMsg = t("settings:messages.updateSuccess")
  const errorMsg = t("settings:danger.resetFailed")
  showResultToast(success, successMsg, errorMsg)
}
