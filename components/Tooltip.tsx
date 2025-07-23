import { useState, useRef, useEffect } from "react"
import type { ReactNode } from "react"

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto'
  className?: string
  delay?: number
}

export default function Tooltip({ 
  content, 
  children, 
  position = 'auto', 
  className = '',
  delay = 0 
}: TooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [actualPosition, setActualPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('top')
  const containerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

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

  // 检测最佳位置
  useEffect(() => {
    if (showTooltip && position === 'auto' && containerRef.current && tooltipRef.current) {
      const container = containerRef.current
      const tooltip = tooltipRef.current
      const containerRect = container.getBoundingClientRect()
      const tooltipRect = tooltip.getBoundingClientRect()
      
      // 插件窗口的边界（假设宽度为384px，高度为600px）
      const windowWidth = 384
      const windowHeight = 600
      
      let bestPosition: 'top' | 'bottom' | 'left' | 'right' = 'top'
      
      // 检查是否有足够空间显示在上方
      if (containerRect.top > tooltipRect.height + 10) {
        bestPosition = 'top'
      }
      // 检查是否有足够空间显示在下方
      else if (containerRect.bottom + tooltipRect.height + 10 < windowHeight) {
        bestPosition = 'bottom'
      }
      // 检查是否有足够空间显示在左侧
      else if (containerRect.left > tooltipRect.width + 10) {
        bestPosition = 'left'
      }
      // 检查是否有足够空间显示在右侧
      else if (containerRect.right + tooltipRect.width + 10 < windowWidth) {
        bestPosition = 'right'
      }
      // 默认显示在上方，即使空间不足
      else {
        bestPosition = 'top'
      }
      
      setActualPosition(bestPosition)
    } else if (position !== 'auto') {
      setActualPosition(position)
    }
  }, [showTooltip, position])

  const getPositionClasses = () => {
    switch (actualPosition) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2'
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2'
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2'
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2'
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2'
    }
  }

  const getArrowClasses = () => {
    switch (actualPosition) {
      case 'top':
        return 'absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-gray-900'
      case 'bottom':
        return 'absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-gray-900'
      case 'left':
        return 'absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-2 border-b-2 border-l-4 border-transparent border-l-gray-900'
      case 'right':
        return 'absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-2 border-b-2 border-r-4 border-transparent border-r-gray-900'
      default:
        return 'absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-gray-900'
    }
  }

  return (
    <div className="relative w-fit" ref={containerRef}>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      
      <div 
        ref={tooltipRef}
        className={`absolute ${getPositionClasses()} px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-[9999] whitespace-nowrap transition-all duration-200 ${showTooltip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'} ${className}`}
      >
        {content}
        <div className={getArrowClasses()}></div>
      </div>
    </div>
  )
}