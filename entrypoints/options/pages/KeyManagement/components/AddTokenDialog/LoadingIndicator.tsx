export function LoadingIndicator() {
  return (
    <div className="space-y-4">
      <div className="animate-pulse">
        <div className="mb-4 h-4 w-1/4 rounded bg-gray-200 dark:bg-dark-bg-tertiary"></div>
        <div className="space-y-3">
          <div className="h-10 rounded bg-gray-200 dark:bg-dark-bg-tertiary"></div>
          <div className="h-10 rounded bg-gray-200 dark:bg-dark-bg-tertiary"></div>
          <div className="h-10 rounded bg-gray-200 dark:bg-dark-bg-tertiary"></div>
        </div>
      </div>
    </div>
  )
}
