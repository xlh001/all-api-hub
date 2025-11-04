import { modelMetadataService } from "~/services/modelMetadata"

const SPECIAL_PREFIXES = [
  "BigModel/",
  "BigModel_",
  "Pro/",
  "Pro_",
  "VIP/",
  "VIP_",
  "Internal/",
  "Internal_",
  "Sandbox/",
  "Sandbox_"
]

const OWNER_MODEL_REGEX =
  /^[A-Za-z0-9][A-Za-z0-9_.-]{0,62}\/[A-Za-z0-9][A-Za-z0-9_.-:]{0,62}$/

const DATE_SUFFIX_COMPACT_REGEX = /(?:[-_]?)(?:19|20)\d{6,8}$/i
const DATE_SUFFIX_SEPARATOR_REGEX =
  /[-_](?:19|20)\d{2}(?:[-_]\d{2}){1,2}$/i

const isStandardStandaloneName = (model: string): boolean => {
  if (!model) return false
  return !/[/:]/.test(model)
}

const hasSpecialPrefix = (model: string): boolean => {
  const lower = model.toLowerCase()
  return SPECIAL_PREFIXES.some((prefix) =>
    lower.startsWith(prefix.toLowerCase())
  )
}

const removeSpecialPrefixes = (model: string): string => {
  let cleaned = model
  let updated = true
  while (updated) {
    updated = false
    for (const prefix of SPECIAL_PREFIXES) {
      if (cleaned.toLowerCase().startsWith(prefix.toLowerCase())) {
        cleaned = cleaned.slice(prefix.length)
        updated = true
      }
    }
  }
  return cleaned
}

const removeDateSuffix = (model: string): string => {
  let result = model
  let changed = true
  while (changed) {
    changed = false
    if (DATE_SUFFIX_COMPACT_REGEX.test(result)) {
      result = result.replace(DATE_SUFFIX_COMPACT_REGEX, "")
      changed = true
    }
    if (DATE_SUFFIX_SEPARATOR_REGEX.test(result)) {
      result = result.replace(DATE_SUFFIX_SEPARATOR_REGEX, "")
      changed = true
    }
  }
  return result
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

  if (
    includeVendor &&
    OWNER_MODEL_REGEX.test(trimmed) &&
    !hasSpecialPrefix(trimmed)
  ) {
    const parts = trimmed.split("/")
    if (
      parts.length === 2 &&
      parts[0] !== "BigModel" &&
      !trimmed.startsWith("Pro/")
    ) {
      return trimmed
    }
  }

  let cleaned = removeSpecialPrefixes(trimmed)

  let actualModel = cleaned
  const lastSlashIndex = actualModel.lastIndexOf("/")
  if (lastSlashIndex !== -1) {
    actualModel = actualModel.slice(lastSlashIndex + 1)
  }

  const colonIndex = actualModel.indexOf(":")
  if (colonIndex !== -1) {
    actualModel = actualModel.slice(0, colonIndex)
  }

  actualModel = removeDateSuffix(actualModel)

  const metadata = modelMetadataService.findStandardModelName(actualModel)
  let vendor = metadata?.vendorName ?? ""

  if (metadata) {
    const standardName = metadata.standardName
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
      actualModel = standardName
    }
  }

  if (!vendor) {
    const fallbackVendor = modelMetadataService.findVendorByPattern(actualModel)
    if (fallbackVendor) {
      vendor = fallbackVendor
    }
  }

  if (includeVendor && vendor) {
    return `${vendor}/${actualModel}`
  }

  return actualModel
}

export const modelNormalizationInternals = {
  removeSpecialPrefixes,
  removeDateSuffix,
  isStandardStandaloneName,
  hasSpecialPrefix
}
