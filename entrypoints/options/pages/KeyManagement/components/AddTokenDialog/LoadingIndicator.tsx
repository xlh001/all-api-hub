export function LoadingIndicator() {
  return (
    <div className="space-y-4">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-dark-bg-tertiary rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-10 bg-gray-200 dark:bg-dark-bg-tertiary rounded"></div>
          <div className="h-10 bg-gray-200 dark:bg-dark-bg-tertiary rounded"></div>
          <div className="h-10 bg-gray-200 dark:bg-dark-bg-tertiary rounded"></div>
        </div>
      </div>
    </div>
  )
}
