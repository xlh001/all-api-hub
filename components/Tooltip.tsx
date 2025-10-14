import { type ReactElement, type ReactNode, useId } from "react"
import { Tooltip as ReactTooltip } from "react-tooltip"

interface TooltipProps {
  content: ReactNode
  children: ReactElement
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
  const tooltipId = `tooltip-${useId()}`

  const isString = typeof content === "string"

  const defaultClassName = `z-[9999] bg-gray-900 dark:bg-dark-bg-tertiary text-white dark:text-dark-text-primary text-xs rounded-lg shadow-lg px-3 py-2 ${className}`
  return (
    <>
      <span id={tooltipId} className="inline-block">
        {children}
      </span>

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
