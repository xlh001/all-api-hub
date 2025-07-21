import { useState } from "react"
import type { ReactNode } from "react"

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
  delay?: number
}

export default function Tooltip({ 
  content, 
  children, 
  position = 'top', 
  className = '',
  delay = 0 
}: TooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const handleMouseEnter = () => {
    if (delay > 0) {
      setTimeout(() => setShowTooltip(true), delay)
    } else {
      setShowTooltip(true)
    }
  }

  const handleMouseLeave = () => {
    setShowTooltip(false)
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-0 mb-2'
      case 'bottom':
        return 'top-full left-0 mt-2'
      case 'left':
        return 'right-full top-0 mr-2'
      case 'right':
        return 'left-full top-0 ml-2'
      default:
        return 'bottom-full left-0 mb-2'
    }
  }

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'absolute top-full left-4 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-gray-900'
      case 'bottom':
        return 'absolute bottom-full left-4 w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-gray-900'
      case 'left':
        return 'absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-2 border-b-2 border-l-4 border-transparent border-l-gray-900'
      case 'right':
        return 'absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-2 border-b-2 border-r-4 border-transparent border-r-gray-900'
      default:
        return 'absolute top-full left-4 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-gray-900'
    }
  }

  return (
    <div className="relative w-fit">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      
      <div className={`absolute ${getPositionClasses()} px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10 whitespace-nowrap transition-all duration-200 ${showTooltip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'} ${className}`}>
        {content}
        <div className={getArrowClasses()}></div>
      </div>
    </div>
  )
}