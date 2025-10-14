import { useEffect, useState } from "react"

import { UI_CONSTANTS } from "~/constants/ui"

import { AccountToken } from "../../../type.ts"

// We duplicate some types here to avoid circular dependencies
// if we were to import them directly from the AddTokenDialog component.

interface Account {
  id: string
  name: string
  baseUrl: string
  userId: number
  token: string
}

interface AddTokenDialogProps {
  isOpen: boolean
  availableAccounts: Account[]
  preSelectedAccountId?: string | null
  editingToken?: AccountToken | null
}

export interface FormData {
  accountId: string
  name: string
  quota: string
  expiredTime: string
  unlimitedQuota: boolean
  modelLimitsEnabled: boolean
  modelLimits: string[]
  allowIps: string
  group: string
}

export const initialFormData: FormData = {
  accountId: "",
  name: "",
  quota: "",
  expiredTime: "",
  unlimitedQuota: true,
  modelLimitsEnabled: false,
  modelLimits: [],
  allowIps: "",
  group: "default"
}

const isValidIpList = (ips: string): boolean => {
  if (!ips) return true // Empty is considered valid
  const ipList = ips.split(",").map((ip) => ip.trim())
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/

  return ipList.every((ip) => {
    if (!ip) return false
    if (ip === "*") return true // Wildcard is allowed
    return (
      ipRegex.test(ip) &&
      ip.split(".").every((part) => {
        const num = parseInt(part)
        return num >= 0 && num <= 255
      })
    )
  })
}

export function useTokenForm({
  isOpen,
  preSelectedAccountId,
  availableAccounts,
  editingToken
}: AddTokenDialogProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isEditMode = !!editingToken

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && editingToken) {
        const matchingAccount = availableAccounts.find(
          (acc) => acc.name === editingToken.accountName
        )
        const accountId =
          matchingAccount?.id ||
          (availableAccounts.length > 0 ? availableAccounts[0].id : "")

        setFormData({
          accountId,
          name: editingToken.name,
          quota: editingToken.unlimited_quota
            ? ""
            : (
                editingToken.remain_quota /
                UI_CONSTANTS.EXCHANGE_RATE.CONVERSION_FACTOR
              ).toString(),
          expiredTime:
            editingToken.expired_time === -1
              ? ""
              : new Date(editingToken.expired_time * 1000)
                  .toISOString()
                  .slice(0, 16),
          unlimitedQuota: editingToken.unlimited_quota,
          modelLimitsEnabled: editingToken.model_limits_enabled || false,
          modelLimits: editingToken.model_limits
            ? editingToken.model_limits.split(",")
            : [],
          allowIps: editingToken.allow_ips || "",
          group: editingToken.group || "default"
        })
      } else {
        const defaultAccountId =
          preSelectedAccountId ||
          (availableAccounts.length > 0 ? availableAccounts[0].id : "")
        setFormData({
          ...initialFormData,
          accountId: defaultAccountId
        })
      }
    }
  }, [
    isOpen,
    preSelectedAccountId,
    availableAccounts,
    isEditMode,
    editingToken
  ])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.accountId) {
      newErrors.accountId = "请选择账号"
    }
    if (!formData.name.trim()) {
      newErrors.name = "密钥名称不能为空"
    }
    if (!formData.unlimitedQuota) {
      const quota = parseFloat(formData.quota)
      if (isNaN(quota) || quota <= 0) {
        newErrors.quota = "请输入有效的额度金额"
      }
    }
    if (formData.expiredTime) {
      const expiredDate = new Date(formData.expiredTime)
      if (expiredDate <= new Date()) {
        newErrors.expiredTime = "过期时间必须大于当前时间"
      }
    }
    if (formData.allowIps && !isValidIpList(formData.allowIps)) {
      newErrors.allowIps = "请输入有效的IP地址，多个IP用逗号分隔"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const resetForm = () => {
    setFormData(initialFormData)
    setErrors({})
  }

  return { formData, setFormData, errors, validateForm, isEditMode, resetForm }
}
