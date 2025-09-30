import { GlobeAltIcon, XMarkIcon } from "@heroicons/react/24/outline"

interface UrlInputProps {
  url: string
  setUrl: (url: string) => void
  isDetected: boolean
}

export default function UrlInput({ url, setUrl, isDetected }: UrlInputProps) {
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputUrl = e.target.value
    if (inputUrl.trim()) {
      try {
        const urlObj = new URL(inputUrl)
        const baseUrl = `${urlObj.protocol}//${urlObj.host}`
        setUrl(baseUrl)
      } catch (error) {
        setUrl(inputUrl)
      }
    } else {
      setUrl("")
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        站点地址
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <GlobeAltIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="url"
          value={url}
          onChange={handleUrlChange}
          placeholder="https://example.com"
          className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
          required
          disabled={isDetected}
        />
        {url && (
          <button
            type="button"
            onClick={() => setUrl("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isDetected}>
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>
      <p className="mt-2 text-xs text-gray-500">
        请输入 One API 或 New API 站点的完整地址
      </p>
    </div>
  )
}
