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
          className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-medium text-gray-900">{tech.name}</h3>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              v{tech.version}
            </span>
          </div>
          <p className="text-sm text-gray-500">{tech.description}</p>
        </div>
      ))}
    </div>
  )
}

export default TechStackGrid
