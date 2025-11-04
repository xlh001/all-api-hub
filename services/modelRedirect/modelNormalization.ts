import { modelMetadataService } from "~/services/modelMetadata"

const DATE_SUFFIX_REGEX = /-\d{8}$/

export const isStandardStandaloneName = (model: string): boolean => {
  if (!model) return false
  return !/[/:]/.test(model)
}

export const removeDateSuffix = (model: string): string => {
  return model.replace(DATE_SUFFIX_REGEX, "")
}

export const renameModel = (
  model: string,
  includeVendor: boolean
): string | undefined => {
  if (!model) return undefined

  const trimmed = model.trim()
  if (!trimmed) return undefined

  if (!includeVendor && isStandardStandaloneName(trimmed)) {
    return trimmed
  }

  if (includeVendor) {
    const slashCount = (trimmed.match(/\//g) || []).length

    if (slashCount === 1 && !trimmed.includes(":")) {
      const parts = trimmed.split("/")

      if (
        parts.length === 2 &&
        parts[0].trim() !== "" &&
        parts[1].trim() !== "" &&
        parts[0] !== "BigModel" &&
        !trimmed.startsWith("Pro/")
      ) {
        return trimmed
      }
    }
  }

  // 处理特殊前缀（如 BigModel/GLM-4.5 → GLM-4.5）
  const specialPrefix = "BigModel/"
  let actualModel = trimmed
  if (actualModel.startsWith(specialPrefix)) {
    actualModel = actualModel.slice(specialPrefix.length)
  }

  // 提取真实模型名
  const lastSlashIndex = actualModel.lastIndexOf("/")
  if (lastSlashIndex !== -1) {
    actualModel = actualModel.slice(lastSlashIndex + 1)
  }

  // 移除冒号后缀
  const colonIndex = actualModel.indexOf(":")
  if (colonIndex !== -1) {
    actualModel = actualModel.slice(0, colonIndex)
  }

  // 移除日期后缀
  actualModel = removeDateSuffix(actualModel)

  // 查找标准化名称
  const metadata = modelMetadataService.findStandardModelName(actualModel)

  if (metadata) {
    const { standardName, vendorName } = metadata

    // 标准名称本身包含厂商前缀
    if (standardName.includes("/")) {
      if (includeVendor) {
        return standardName
      }
      const slashIdx = standardName.lastIndexOf("/")
      if (slashIdx !== -1) {
        return standardName.slice(slashIdx + 1)
      }
      return standardName
    } else {
      // 标准名称不包含厂商前缀
      if (includeVendor && vendorName) {
        return `${vendorName}/${standardName}`
      }
      return standardName
    }
  }

  // 未找到标准化名称，使用降级逻辑
  let vendor = ""
  const fallbackVendor = modelMetadataService.findVendorByPattern(actualModel)
  if (fallbackVendor) {
    vendor = fallbackVendor
  }

  // 组合最终名称
  if (includeVendor && vendor) {
    return `${vendor}/${actualModel}`
  }

  return actualModel
}
