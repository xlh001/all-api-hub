export interface FeatureListProps {
  title: string
  items: string[]
  color: "green" | "blue"
}

const FeatureList = ({ title, items, color }: FeatureListProps) => {
  const palette =
    color === "green"
      ? {
          dot: "bg-green-500",
          box: "bg-green-50 border-green-200",
          text: "text-green-800",
          bullet: "bg-green-500"
        }
      : {
          dot: "bg-blue-500",
          box: "bg-blue-50 border-blue-200",
          text: "text-blue-800",
          bullet: "bg-blue-500"
        }

  return (
    <div>
      <h3 className="text-base font-medium text-gray-800 mb-3 flex items-center">
        <div className={`w-2 h-2 ${palette.dot} rounded-full mr-2`}></div>
        {title}
      </h3>
      <div className={`rounded-lg p-4 border ${palette.box}`}>
        <ul className="space-y-2">
          {items.map((feature, index) => (
            <li key={index} className={`flex items-start space-x-2 text-sm ${palette.text}`}>
              <div className={`w-1.5 h-1.5 ${palette.bullet} rounded-full mt-2 flex-shrink-0`}></div>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default FeatureList
