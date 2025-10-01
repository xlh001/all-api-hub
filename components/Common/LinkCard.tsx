import type { SVGProps } from "react"

export interface LinkCardProps {
  Icon: any
  title: string
  description: string
  href: string
  buttonText: string
  buttonClass?: string
  iconClass?: string
}

const LinkCard = ({
  Icon,
  title,
  description,
  href,
  buttonText,
  buttonClass = "bg-gray-900 text-white hover:bg-gray-800",
  iconClass = "text-gray-900"
}: LinkCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-start space-x-4">
        <Icon className={`w-6 h-6 mt-1 flex-shrink-0 ${iconClass}`} />
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-3">{description}</p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${buttonClass}`}>
            {buttonText}
          </a>
        </div>
      </div>
    </div>
  )
}

export default LinkCard
