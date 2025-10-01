import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"

export function WarningNote() {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
      <div className="flex items-start space-x-2">
        <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-yellow-800">
          <p className="font-medium mb-1">注意事项</p>
          <ul className="text-xs space-y-1">
            <li>• 请妥善保管API密钥，避免泄露</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
