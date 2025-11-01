import { ChannelDialog } from "./ChannelDialog"
import { useChannelDialogContext } from "../context/ChannelDialogContext"

/**
 * Global ChannelDialog container that can be triggered from anywhere
 */
export function ChannelDialogContainer() {
  const { state, closeDialog, handleSuccess } = useChannelDialogContext()

  return (
    <ChannelDialog
      isOpen={state.isOpen}
      onClose={closeDialog}
      mode={state.mode}
      initialValues={state.initialValues}
      initialModels={state.initialModels}
      initialGroups={state.initialGroups}
      onSuccess={handleSuccess}
    />
  )
}
