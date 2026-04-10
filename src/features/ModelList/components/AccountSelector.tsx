import type { Ref } from "react"
import { useTranslation } from "react-i18next"

import { Heading3, SearchableSelect } from "~/components/ui"
import {
  ALL_ACCOUNTS_SOURCE_VALUE,
  toAccountSourceValue,
  toProfileSourceValue,
} from "~/features/ModelList/modelManagementSources"
import type { DisplaySiteData } from "~/types"
import type { ApiCredentialProfile } from "~/types/apiCredentialProfiles"
import { tryParseUrl } from "~/utils/core/urlParsing"

interface AccountSelectorProps {
  selectedSourceValue: string
  setSelectedSourceValue: (sourceValue: string) => void
  accounts: DisplaySiteData[]
  profiles: ApiCredentialProfile[]
  selectorOpen?: boolean
  onSelectorOpenChange?: (open: boolean) => void
  selectorTriggerRef?: Ref<HTMLButtonElement>
}

/**
 * Dropdown selector for choosing which source's models to view.
 * @param props Component props.
 * @param props.selectedSourceValue Currently selected source value.
 * @param props.setSelectedSourceValue Setter to update the selected source.
 * @param props.accounts Available accounts to display.
 * @param props.profiles Available API credential profiles to display.
 * @returns Searchable select control wrapped with heading.
 */
export function AccountSelector({
  selectedSourceValue,
  setSelectedSourceValue,
  accounts,
  profiles,
  selectorOpen,
  onSelectorOpenChange,
  selectorTriggerRef,
}: AccountSelectorProps) {
  const { t } = useTranslation("modelList")
  return (
    <div className="mb-6">
      <Heading3 className="mb-3">{t("selectSource")}</Heading3>
      <SearchableSelect
        ref={selectorTriggerRef}
        options={[
          ...(accounts.length > 0
            ? [{ value: ALL_ACCOUNTS_SOURCE_VALUE, label: t("allAccounts") }]
            : []),
          ...accounts.map((account) => ({
            value: toAccountSourceValue(account.id),
            label: account.name,
          })),
          ...profiles.map((profile) => ({
            value: toProfileSourceValue(profile.id),
            label: t("sourceLabels.profileOption", {
              name: profile.name,
              host: tryParseUrl(profile.baseUrl)?.hostname ?? profile.baseUrl,
            }),
          })),
        ]}
        value={selectedSourceValue ?? ""}
        onChange={setSelectedSourceValue}
        open={selectorOpen}
        onOpenChange={onSelectorOpenChange}
        placeholder={t("pleaseSelectSource")}
      />
    </div>
  )
}
