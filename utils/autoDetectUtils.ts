/**
 * 自动识别错误处理工具模块
 *
 * 作用：
 * 1. 定义自动识别过程中可能出现的错误类型枚举
 * 2. 提供智能错误分析功能，将通用错误信息转换为结构化的错误对象
 * 3. 包含错误处理的辅助函数，如打开登录页面等
 *
 * 主要功能：
 * - analyzeAutoDetectError: 分析错误消息并返回结构化错误信息
 * - getLoginUrl: 生成站点登录页面URL
 * - openLoginTab: 在新标签页中打开登录页面
 *
 * 使用场景：
 * - AddAccountDialog 和 EditAccountDialog 中的自动识别错误处理
 * - AutoDetectErrorAlert 组件中的错误展示和操作
 */
import { FAQ_URL } from "~/constants/about"

import { getErrorMessage } from "./error.ts"

// 自动识别错误类型
export enum AutoDetectErrorType {
  TIMEOUT = "timeout",
  UNAUTHORIZED = "unauthorized",
  INVALID_RESPONSE = "invalid_response",
  NETWORK_ERROR = "network_error",
  UNKNOWN = "unknown"
}

// 自动识别错误信息
export interface AutoDetectError {
  type: AutoDetectErrorType
  message: string
  actionText?: string
  actionUrl?: string
  helpDocUrl?: string
}

// 分析错误并返回结构化错误信息
export function analyzeAutoDetectError(error: any): AutoDetectError {
  const errorMessage = getErrorMessage(error)

  // 超时错误
  if (errorMessage.includes("超时") || errorMessage.includes("timeout")) {
    return {
      type: AutoDetectErrorType.TIMEOUT,
      message: "自动识别超时，请尝试手动添加",
      helpDocUrl: FAQ_URL
    }
  }

  // 401 认证错误
  if (
    errorMessage.includes("401") ||
    errorMessage.includes("未授权") ||
    errorMessage.includes("Unauthorized")
  ) {
    return {
      type: AutoDetectErrorType.UNAUTHORIZED,
      message:
        "您未在当前站点登录，或者登录信息已过期，无法自动添加，可查看帮助文档或点击先进行登录",
      actionText: "登录此站点",
      helpDocUrl: FAQ_URL
    }
  }

  // 响应格式错误
  if (
    errorMessage.includes("格式") ||
    errorMessage.includes("解析") ||
    errorMessage.includes("JSON") ||
    errorMessage.includes("数据不符合") ||
    errorMessage.includes("无法获取")
  ) {
    return {
      type: AutoDetectErrorType.INVALID_RESPONSE,
      message:
        "自动识别未成功，站点返回数据不符合预期，请手动输入信息或确保已在目标站点登录",
      helpDocUrl: FAQ_URL
    }
  }

  // 网络错误
  if (
    errorMessage.includes("网络") ||
    errorMessage.includes("连接") ||
    errorMessage.includes("Network")
  ) {
    return {
      type: AutoDetectErrorType.NETWORK_ERROR,
      message: "网络连接失败，请检查网络连接后重试",
      helpDocUrl: FAQ_URL
    }
  }

  // 未知错误
  return {
    type: AutoDetectErrorType.UNKNOWN,
    message: "自动识别失败：" + errorMessage,
    helpDocUrl: FAQ_URL
  }
}

// 创建错误消息组件的props
export interface AutoDetectErrorProps {
  error: AutoDetectError
  siteUrl?: string
  onHelpClick?: () => void
  onActionClick?: () => void
}

// 获取用于打开登录页面的URL
export function getLoginUrl(siteUrl: string): string {
  try {
    const url = new URL(siteUrl)
    // 对于 One API 和 New API，通常登录页面在 /login
    return `${url.protocol}//${url.host}/login`
  } catch {
    return siteUrl
  }
}

// 打开新标签页进行登录
export function openLoginTab(siteUrl: string): void {
  const loginUrl = getLoginUrl(siteUrl)
  chrome.tabs.create({ url: loginUrl })
}
