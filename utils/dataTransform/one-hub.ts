// 类型定义
export interface NormalizedModelItem {
  model_name: string
  quota_type: number
  model_ratio: number
  model_price: number
  owner_by: string
  completion_ratio: number
  enable_groups: string[]
  supported_endpoint_types: string[]
}

export interface NormalizedModel {
  auto_groups: string[]
  data: NormalizedModelItem[]
  group_ratio: Record<string, number>
  success: boolean
  supported_endpoint: Record<string, { path: string; method: "POST" | "GET" }>
  usable_group: Record<string, string>
  vendors: Array<{ id?: number; name: string; icon?: string }>
}

interface RawModel {
  groups: string[]
  owned_by: string
  price: {
    model: string
    type: string // "tokens" | "times"
    channel_type: number
    input: number
    output: number
    locked: boolean
    extra_ratios?: Record<string, number>
  }
}

interface Vendor {
  id: number
  name: string
  icon?: string
}

interface GroupMap {
  [key: string]: {
    id: number
    symbol: string
    name: string
    ratio: number
  }
}

interface EndpointMap {
  [key: string]: { path: string; method: "POST" | "GET" }
}

/**
 * 通用 transform 函数
 */
export function transformModelPricing(
  rawData: Record<string, RawModel>,
  vendors: Vendor[] = [],
  groupMap: GroupMap = {},
  supportedEndpoints: EndpointMap = null
): NormalizedModel {
  const autoGroups = Object.keys(groupMap).length
    ? Object.keys(groupMap)
    : ["default"]

  const data: NormalizedModelItem[] = Object.entries(rawData).map(
    ([modelName, model]) => {
      const enableGroups = model.groups.length > 0 ? model.groups : ["default"]

      return {
        model_name: modelName,
        quota_type: model.price.type === "tokens" ? 0 : 1,
        model_ratio: 1,
        model_price: {
          input: model.price.input,
          output: model.price.output
        },
        owner_by: model.owned_by || "",
        completion_ratio: model.price.output / model.price.input || 1,
        enable_groups: enableGroups,
        supported_endpoint_types: supportedEndpoints || []
      }
    }
  )

  const group_ratio: Record<string, number> = {}
  for (const [key, group] of Object.entries(groupMap)) {
    group_ratio[key] = group.ratio || 1
  }

  const usable_group: Record<string, string> = {}
  for (const [key, group] of Object.entries(groupMap)) {
    usable_group[key] = group.name
  }

  return {
    auto_groups: autoGroups,
    data,
    group_ratio,
    success: true,
    supported_endpoint: supportedEndpoints,
    usable_group,
    vendors
  }
}
