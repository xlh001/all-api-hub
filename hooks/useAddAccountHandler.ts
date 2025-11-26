import { showFirefoxWarningDialog } from "~/entrypoints/popup/components/FirefoxAddAccountWarningDialog/showFirefoxWarningDialog.tsx"
import { useDialogStateContext } from "~/features/AccountManagement/hooks/DialogStateContext.tsx"
import {
  isDesktopByUA,
  isExtensionSidePanel,
  isFirefox
} from "~/utils/browser.ts"

export function useAddAccountHandler() {
  const { openAddAccount } = useDialogStateContext()

  const handleAddAccountClick = () => {
    if (isFirefox() && isDesktopByUA() && !isExtensionSidePanel()) {
      showFirefoxWarningDialog()
    } else {
      openAddAccount()
    }
  }

  return { handleAddAccountClick }
}
