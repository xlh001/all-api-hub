import { modelMetadataService } from "~/services/modelMetadata"

const DATE_SUFFIX_REGEX = /-\d{8}$/

const isStandardStandaloneName = (model: string): boolean => {
  if (!model) return false
  return !/[/:]/.test(model)
}

const removeDateSuffix = (model: string): string => {
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

  let actualModel = trimmed

  if (actualModel.startsWith("BigModel/")) {
    actualModel = actualModel.slice("BigModel/".length)
  }

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

  if (metadata) {
    const { standardName, vendorName } = metadata

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
      if (includeVendor && vendorName) {
        return `${vendorName}/${standardName}`
      }
      return standardName
    }
  }

  let vendor = ""
  const fallbackVendor = modelMetadataService.findVendorByPattern(actualModel)
  if (fallbackVendor) {
    vendor = fallbackVendor
  }

  if (includeVendor && vendor) {
    return `${vendor}/${actualModel}`
  }

  return actualModel
}

export const modelNormalizationInternals = {
  isStandardStandaloneName,
  removeDateSuffix
}
