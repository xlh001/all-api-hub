import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline"
import { JSX, useCallback } from "react"

import { Button } from "~/components/ui"
import { openAccountManagerWithSearch } from "~/utils/navigation.ts"

interface AccountLinkButtonProps {
  accountId: string
  accountName: string
  className?: string
}

/**
 * A button that links to the account manager page with the given account ID.
 * @param {AccountLinkButtonProps} props - The properties of the button.
 * @param {string} props.accountId - The ID of the account to link to.
 * @param {string} props.accountName - The name of the account to display.
 * @param {string} [props.className] - The CSS class name to apply to the button.
 * @returns {JSX.Element} - The button element.
 */
export default function AccountLinkButton({
  accountId,
  accountName,
  className
}: AccountLinkButtonProps): JSX.Element {
  const handleClick = useCallback(async () => {
    await openAccountManagerWithSearch(accountId)
  }, [accountId])

  return (
    <Button
      variant="link"
      className={className}
      onClick={handleClick}
      aria-label={`View account ${accountName} in manager`}>
      <span className="truncate">{accountName}</span>
      <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" aria-hidden="true" />
    </Button>
  )
}
