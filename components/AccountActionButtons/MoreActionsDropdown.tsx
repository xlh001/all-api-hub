import { Menu, MenuButton, MenuItems } from "@headlessui/react"
import {
  ChartPieIcon,
  CpuChipIcon,
  EllipsisHorizontalIcon,
  PencilIcon,
  TrashIcon
} from "@heroicons/react/24/outline"
import React from "react"

import type { DisplaySiteData } from "../../types"
import { AccountActionMenuItem } from "./AccountActionMenuItem"

interface MoreActionsDropdownProps {
  site: DisplaySiteData
  onViewUsage: (site: DisplaySiteData) => void
  onViewModels: (site: DisplaySiteData) => void
  onEditAccount: (site: DisplaySiteData) => void
  onDeleteAccount: (site: DisplaySiteData) => void
}

export const MoreActionsDropdown: React.FC<MoreActionsDropdownProps> = ({
  site,
  onViewUsage,
  onViewModels,
  onEditAccount,
  onDeleteAccount
}) => {
  return (
    <Menu as="div" className="relative">
      <MenuButton className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors">
        <EllipsisHorizontalIcon className="w-4 h-4 text-gray-500" />
      </MenuButton>
      <MenuItems
        anchor="bottom end"
        className="z-50 w-24 bg-white rounded-lg shadow-lg border border-gray-200 py-1 focus:outline-none [--anchor-gap:4px] [--anchor-padding:8px]">
        <AccountActionMenuItem
          onClick={() => onViewModels(site)}
          icon={CpuChipIcon}
          label="模型"
        />
        <AccountActionMenuItem
          onClick={() => onViewUsage(site)}
          icon={ChartPieIcon}
          label="用量"
        />
        <hr />
        <AccountActionMenuItem
          onClick={() => onEditAccount(site)}
          icon={PencilIcon}
          label="编辑"
        />
        <AccountActionMenuItem
          onClick={() => onDeleteAccount(site)}
          icon={TrashIcon}
          label="删除"
          isDestructive
        />
      </MenuItems>
    </Menu>
  )
}
