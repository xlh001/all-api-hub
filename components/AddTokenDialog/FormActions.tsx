interface FormActionsProps {
  isSubmitting: boolean
  isEditMode: boolean
  onClose: () => void
  onSubmit: () => void
  canSubmit: boolean
}

export function FormActions({ isSubmitting, isEditMode, onClose, onSubmit, canSubmit }: FormActionsProps) {
  return (
    <div className="flex justify-end space-x-3 pt-4">
      <button
        onClick={onClose}
        disabled={isSubmitting}
        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
      >
        取消
      </button>
      <button
        onClick={onSubmit}
        disabled={isSubmitting || !canSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
      >
        {isSubmitting && (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        )}
        <span>{isSubmitting ? (isEditMode ? '更新中...' : '创建中...') : (isEditMode ? '更新密钥' : '创建密钥')}</span>
      </button>
    </div>
  )
}