// ============= 错误处理 =============
export const API_ERROR_CODES = {
  HTTP_401: "HTTP_401",
  HTTP_403: "HTTP_403",
  HTTP_429: "HTTP_429",
  HTTP_OTHER: "HTTP_OTHER",
  CONTENT_TYPE_MISMATCH: "CONTENT_TYPE_MISMATCH",
  ROBOT_CHALLENGE: "ROBOT_CHALLENGE",
  JSON_PARSE_ERROR: "JSON_PARSE_ERROR",
  BUSINESS_ERROR: "BUSINESS_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  UNKNOWN: "UNKNOWN",
} as const

export type ApiErrorCode =
  (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES]

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string,
    public code?: ApiErrorCode,
  ) {
    super(message)
    this.name = "ApiError"
  }
}
