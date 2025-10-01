export function LoadingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-8 h-8 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin mb-4" />
      <p className="text-sm text-gray-500">正在获密钥列表...</p>
    </div>
  )
}
