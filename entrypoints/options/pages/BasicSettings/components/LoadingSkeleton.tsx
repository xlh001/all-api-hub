import { Card } from "~/components/ui"

export default function LoadingSkeleton() {
  return (
    <div className="p-6">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-dark-bg-tertiary rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <Card padding="default">
            <div className="h-16 bg-gray-200 dark:bg-dark-bg-tertiary rounded"></div>
          </Card>
          <Card padding="default">
            <div className="h-16 bg-gray-200 dark:bg-dark-bg-tertiary rounded"></div>
          </Card>
          <Card padding="default">
            <div className="h-16 bg-gray-200 dark:bg-dark-bg-tertiary rounded"></div>
          </Card>
        </div>
      </div>
    </div>
  )
}
