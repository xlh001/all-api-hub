import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { PRIVACY_TEXT } from "~/constants/about"

const PrivacyNotice = () => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <InformationCircleIcon className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="text-green-800 font-medium mb-1">{PRIVACY_TEXT.title}</p>
          <p className="text-green-700">{PRIVACY_TEXT.body}</p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyNotice
