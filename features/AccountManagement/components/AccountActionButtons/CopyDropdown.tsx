import { Menu, MenuButton, MenuItems } from "@headlessui/react"
import { DocumentDuplicateIcon, KeyIcon } from "@heroicons/react/24/outline"
import React from "react"

import Tooltip from "~/components/Tooltip"
import type { DisplaySiteData } from "~/types"

import { AccountActionMenuItem } from "./AccountActionMenuItem"

interface CopyDropdownProps {
  site: DisplaySiteData
  onCopyUrl: (site: DisplaySiteData) => void
  onViewKeys: (siteId: string) => void
  onCopyKey: (site: DisplaySiteData) => void
}

export const CopyDropdown: React.FC<CopyDropdownProps> = ({
  site,
  onCopyUrl,
  onViewKeys,
  onCopyKey
}) => {
  const handleCopyUrlLocal = () => {
    navigator.clipboard.writeText(site.baseUrl)
    onCopyUrl(site)
  }

  return (
    <Menu as="div" className="relative">
      <Tooltip content="复制" position="top">
        <MenuButton className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-colors">
          <DocumentDuplicateIcon className="w-4 h-4 text-gray-500 dark:text-dark-text-secondary" />
        </MenuButton>
      </Tooltip>
      <MenuItems
        anchor="bottom end"
        className="z-50 w-32 bg-white dark:bg-dark-bg-secondary rounded-lg shadow-lg border border-gray-200 dark:border-dark-bg-tertiary py-1 focus:outline-none [--anchor-gap:4px] [--anchor-padding:8px]">
        <AccountActionMenuItem
          onClick={handleCopyUrlLocal}
          icon={DocumentDuplicateIcon}
          label="复制 URL"
        />
        <AccountActionMenuItem
          onClick={() => onCopyKey(site)}
          icon={DocumentDuplicateIcon}
          label="复制密钥"
        />
        <hr />
        <AccountActionMenuItem
          onClick={() => onViewKeys(site.id)}
          icon={KeyIcon}
          label="管理密钥"
        />
      </MenuItems>
    </Menu>
  )
}
