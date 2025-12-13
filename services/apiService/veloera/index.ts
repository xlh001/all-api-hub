import { REQUEST_CONFIG } from "~/services/apiService/common/constant"
import { ApiError } from "~/services/apiService/common/errors"
import { fetchAllItems } from "~/services/apiService/common/pagination"
import { fetchApiData } from "~/services/apiService/common/utils"
import type {
  ManagedSiteChannel,
  ManagedSiteChannelListData,
} from "~/types/managedSite"

type VeloeraChannelInfo = {
  is_multi_key?: boolean
  multi_key_size?: number
  multi_key_status_list?: unknown[] | null
  multi_key_polling_index?: number
  multi_key_mode?: string
}

type VeloeraChannelRaw = Partial<
  Omit<ManagedSiteChannel, "channel_info"> & {
    channel_info?: VeloeraChannelInfo
  }
>

/**
 * Create an empty channel_info object when upstream omits it.
 */
const createDefaultChannelInfo = (): ManagedSiteChannel["channel_info"] => ({
  is_multi_key: false,
  multi_key_size: 0,
  multi_key_status_list: null,
  multi_key_polling_index: 0,
  multi_key_mode: "",
})

/**
 * Best-effort conversion for numeric fields.
 */
const toNumberOrZero = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

/**
 * Normalize Veloera channel payloads to match New API's `ManagedSiteChannel`.
 */
const normalizeChannel = (raw: VeloeraChannelRaw): ManagedSiteChannel => {
  const rawInfo = raw.channel_info
  const channelInfo = rawInfo
    ? {
        is_multi_key: Boolean(rawInfo.is_multi_key),
        multi_key_size: toNumberOrZero(rawInfo.multi_key_size),
        multi_key_status_list: rawInfo.multi_key_status_list ?? null,
        multi_key_polling_index: toNumberOrZero(rawInfo.multi_key_polling_index),
        multi_key_mode: rawInfo.multi_key_mode ?? "",
      }
    : createDefaultChannelInfo()

  return {
    id: toNumberOrZero(raw.id),
    type: raw.type as ManagedSiteChannel["type"],
    key: raw.key ?? "",
    name: raw.name ?? "",
    base_url: raw.base_url ?? "",
    models: raw.models ?? "",
    status: toNumberOrZero(raw.status) as ManagedSiteChannel["status"],
    weight: toNumberOrZero(raw.weight),
    priority: toNumberOrZero(raw.priority),
    openai_organization: raw.openai_organization ?? null,
    test_model: raw.test_model ?? null,
    created_time: toNumberOrZero(raw.created_time),
    test_time: toNumberOrZero(raw.test_time),
    response_time: toNumberOrZero(raw.response_time),
    other: raw.other ?? "",
    balance: toNumberOrZero(raw.balance),
    balance_updated_time: toNumberOrZero(raw.balance_updated_time),
    group: raw.group ?? "default",
    used_quota: toNumberOrZero(raw.used_quota),
    model_mapping: raw.model_mapping ?? "",
    status_code_mapping: raw.status_code_mapping ?? "",
    auto_ban: toNumberOrZero(raw.auto_ban),
    other_info: raw.other_info ?? "",
    tag: raw.tag ?? null,
    param_override: raw.param_override ?? null,
    header_override: raw.header_override ?? null,
    remark: raw.remark ?? null,
    channel_info: channelInfo,
    setting: raw.setting ?? "",
    settings: raw.settings ?? raw.setting ?? "",
  }
}

/**
 * List all channels from a Veloera-managed site.
 *
 * Veloera returns a bare channel array inside `data` for `/api/channel/`.
 * This implementation paginates from `p=0` and adapts the response into the
 * same `ManagedSiteChannelListData` structure used by the New API implementation.
 */
export async function listAllChannels(
  baseUrl: string,
  adminToken: string,
  userId?: number | string,
  options?: {
    pageSize?: number
    beforeRequest?: () => Promise<void>
  },
): Promise<ManagedSiteChannelListData> {
  const pageSize = options?.pageSize ?? REQUEST_CONFIG.DEFAULT_PAGE_SIZE
  const beforeRequest = options?.beforeRequest

  const allItems = await fetchAllItems<ManagedSiteChannel>(
    async (page) => {
      await beforeRequest?.()

      const endpoint = `/api/channel/?p=${page}&page_size=${pageSize}`
      const data = await fetchApiData<unknown>({
        baseUrl,
        endpoint,
        userId,
        token: adminToken,
      })

      if (!Array.isArray(data)) {
        throw new ApiError("Failed to fetch channels", undefined, endpoint)
      }

      const normalized = (data as VeloeraChannelRaw[]).map(normalizeChannel)
      return {
        items: normalized,
        hasMore: normalized.length >= pageSize,
      }
    },
    {
      pageSize,
      startPage: 0,
      maxPages: REQUEST_CONFIG.MAX_PAGES,
    },
  )

  const typeCounts: Record<string, number> = {}
  for (const channel of allItems) {
    const key = String(channel.type)
    typeCounts[key] = (typeCounts[key] || 0) + 1
  }

  return {
    items: allItems,
    total: allItems.length,
    type_counts: typeCounts,
  } as ManagedSiteChannelListData
}
