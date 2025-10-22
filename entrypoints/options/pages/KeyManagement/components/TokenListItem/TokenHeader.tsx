import {
  DocumentDuplicateIcon,
  PencilIcon,
  TrashIcon
} from "@heroicons/react/24/outline"
import { NewAPI } from "@lobehub/icons"
import { useState } from "react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

import { CherryIcon } from "~/components/icons/CherryIcon"
import { Badge, Heading6, IconButton } from "~/components/ui"
import { importToNewApi } from "~/services/newApiService"
import type { DisplaySiteData } from "~/types"
import { OpenInCherryStudio } from "~/utils/cherryStudio"
import { getErrorMessage } from "~/utils/error"

import { showSettingsToast } from "../../../BasicSettings/utils/toastHelpers"
import { AccountToken } from "../../type"

interface TokenHeaderProps {
  token: AccountToken
  copyKey: (key: string, name: string) => void
  handleEditToken: (token: AccountToken) => void
  handleDeleteToken: (token: AccountToken) => void
  account: DisplaySiteData
}

function TokenActionButtons({
  token,
  copyKey,
  handleEditToken,
  handleDeleteToken,
  account
}: TokenHeaderProps) {
  const { t } = useTranslation("keyManagement")
  const [isImporting, setIsImporting] = useState(false)

  const handleImportToNewApi = async () => {
    setIsImporting(true)
    try {
      const ImportResult = await importToNewApi(account, token)
      showSettingsToast(ImportResult)
    } catch (error) {
      toast.error(
        t("messages:toast.error.importFailed", {
          error: getErrorMessage(error)
        })
      )
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
      <IconButton
        aria-label={t("common:actions.copyKey")}
        size="sm"
        variant="ghost"
        onClick={() => copyKey(token.key, token.name)}>
        <DocumentDuplicateIcon className="w-4 h-4 text-gray-500 dark:text-dark-text-tertiary" />
      </IconButton>
      <IconButton
        aria-label={t("actions.useInCherry")}
        size="sm"
        variant="ghost"
        onClick={() => OpenInCherryStudio(account, token)}>
        <CherryIcon className="w-4 h-4 text-purple-500 dark:text-purple-400" />
      </IconButton>
      <IconButton
        aria-label={t("actions.importToNewApi")}
        size="sm"
        variant="ghost"
        loading={isImporting}
        onClick={handleImportToNewApi}>
        <NewAPI.Color className="w-4 h-4" />
      </IconButton>
      <IconButton
        aria-label={t("actions.editKey")}
        size="sm"
        variant="outline"
        onClick={() => handleEditToken(token)}>
        <PencilIcon className="w-4 h-4 text-blue-500 dark:text-blue-400" />
      </IconButton>
      <IconButton
        aria-label={t("actions.deleteKey")}
        size="sm"
        variant="destructive"
        onClick={() => handleDeleteToken(token)}>
        <TrashIcon className="w-4 h-4" />
      </IconButton>
    </div>
  )
}

export function TokenHeader({
  token,
  copyKey,
  handleEditToken,
  handleDeleteToken,
  account
}: TokenHeaderProps) {
  const { t } = useTranslation("keyManagement")
  return (
    <div className="flex items-start gap-2 min-w-0">
      {/* 左侧：标题和标签 - 可压缩 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
          <Heading6 className="text-sm sm:text-base md:text-lg truncate">
            {token.name}
          </Heading6>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <Badge
            variant={token.status === 1 ? "success" : "destructive"}
            size="sm">
            {token.status === 1 ? t("actions.enable") : t("actions.disable")}
          </Badge>
          <Badge variant="outline" size="sm">
            {token.accountName}
          </Badge>
        </div>
      </div>

      {/* 右侧：操作按钮 - 固定不压缩 */}
      <TokenActionButtons
        token={token}
        copyKey={copyKey}
        handleEditToken={handleEditToken}
        handleDeleteToken={handleDeleteToken}
        account={account}
      />
    </div>
  )
}
