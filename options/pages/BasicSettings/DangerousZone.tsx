interface DangerousZoneProps {
  handleResetToDefaults: () => void
}

export default function DangerousZone({
  handleResetToDefaults
}: DangerousZoneProps) {
  return (
    <section>
      <h2 className="text-lg font-medium text-red-600 mb-4">危险操作</h2>
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-red-800">
              重置所有设置
            </h3>
            <p className="text-sm text-red-600 mt-1">
              将所有配置重置为默认值，此操作不可撤销
            </p>
          </div>
          <button
            onClick={handleResetToDefaults}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors">
            重置设置
          </button>
        </div>
      </div>
    </section>
  )
}