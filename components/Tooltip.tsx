import type { ReactNode } from "react"
import { Tooltip as ReactTooltip } from "react-tooltip"

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  position?:
    | "top"
    | "top-start"
    | "top-end"
    | "right"
    | "right-start"
    | "right-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "left"
    | "left-start"
    | "left-end"
  delay?: number
  className?: string
}

export default function Tooltip({
  content,
  children,
  position = "top",
  delay = 0,
  className = ""
}: TooltipProps) {
  const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`

  // 判断 content 是否为 string
  const isString = typeof content === "string"

  const defaultClassName = `z-[9999] bg-gray-900 text-white text-xs rounded-lg shadow-lg px-3 py-2 ${className}`
  return (
    <>
      <div id={tooltipId} className="inline-block">
        {children}
      </div>

      {isString ? (
        <ReactTooltip
          anchorId={tooltipId}
          place={position}
          content={content}
          delayShow={delay}
          className={defaultClassName}
        />
      ) : (
        <ReactTooltip
          anchorId={tooltipId}
          place={position}
          delayShow={delay}
          className={defaultClassName}>
          {content}
        </ReactTooltip>
      )}
    </>
  )
}
