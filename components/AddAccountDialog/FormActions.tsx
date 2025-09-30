import { SparklesIcon } from "@heroicons/react/24/outline"
import { isValidExchangeRate } from "../../services/accountOperations"

interface FormActionsProps {
  isDetected: boolean
  isSaving: boolean
  siteName: string
  username: string
  accessToken: string
  userId: string
  exchangeRate: string
  onClose: () => void
}

export default function FormActions({
  isDetected,
  isSaving,
  siteName,
  username,
  accessToken,
  userId,
  exchangeRate,
  onClose
}: FormActionsProps) {
  const isFormValid =
    siteName.trim() &&
    username.trim() &&
    accessToken.trim() &&
    userId.trim() &&
    isValidExchangeRate(exchangeRate)

  return (
    <div className="flex space-x-3 pt-2">
      <button
        type="button"
        onClick={onClose}
        className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500">
        取消
      </button>
      <button
        type="submit"
        disabled={!isFormValid || isSaving}
        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
        {isSaving ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>保存中...</span>
          </>
        ) : (
          <>
            <SparklesIcon className="w-4 h-4" />
            <span>{isDetected ? "确认添加" : "保存账号"}</span>
          </>
        )}
      </button>
    </div>
  )
}