export interface FeatureListProps {
  title: string
  items: string[]
  color: "green" | "blue"
}

const FeatureList = ({ title, items, color }: FeatureListProps) => {
  if (items.length === 0) {
    return null
  }

  const palette =
    color === "green"
      ? {
          dot: "bg-green-500",
          box: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/30",
          text: "text-green-800 dark:text-green-300",
          bullet: "bg-green-500"
        }
      : {
          dot: "bg-blue-500",
          box: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/30",
          text: "text-blue-800 dark:text-blue-300",
          bullet: "bg-blue-500"
        }

  return (
    <div>
      <h3 className="text-base font-medium text-gray-800 dark:text-dark-text-primary mb-3 flex items-center">
        <div className={`w-2 h-2 ${palette.dot} rounded-full mr-2`}></div>
        {title}
      </h3>
      <div className={`rounded-lg p-4 border ${palette.box}`}>
        <ul className="space-y-2">
          {items.map((feature, index) => (
            <li
              key={index}
              className={`flex items-start space-x-2 text-sm ${palette.text}`}>
              <div
                className={`w-1.5 h-1.5 ${palette.bullet} rounded-full mt-2 flex-shrink-0`}></div>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default FeatureList
