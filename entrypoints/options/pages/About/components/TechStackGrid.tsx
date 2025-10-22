export interface TechItem {
  name: string
  version: string
  description: string
}

export interface TechStackGridProps {
  items: TechItem[]
}

const TechStackGrid = ({ items }: TechStackGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((tech, index) => (
        <div
          key={index}
          className="bg-white dark:bg-dark-bg-secondary border border-gray-200 dark:border-dark-bg-tertiary rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-base font-medium text-gray-900 dark:text-dark-text-primary">
              {tech.name}
            </span>
            <span className="text-xs bg-gray-100 dark:bg-dark-bg-tertiary text-gray-600 dark:text-dark-text-secondary px-2 py-1 rounded">
              v{tech.version}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
            {tech.description}
          </p>
        </div>
      ))}
    </div>
  )
}

export default TechStackGrid
