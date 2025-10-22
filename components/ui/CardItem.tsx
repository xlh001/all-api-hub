import { cva, type VariantProps } from "class-variance-authority"
import React from "react"

import { cn } from "~/utils/cn"

const cardItemVariants = cva(
  "flex items-center justify-between transition-colors",
  {
    variants: {
      padding: {
        none: "p-0",
        sm: "p-3",
        default: "py-4 px-6",
        md: "py-5 px-6",
        lg: "py-6 px-8"
      },
      interactive: {
        false: "",
        true: "hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary cursor-pointer"
      }
    },
    defaultVariants: {
      padding: "default",
      interactive: false
    }
  }
)

export interface CardSectionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardItemVariants> {
  leftContent?: React.ReactNode
  rightContent?: React.ReactNode
  icon?: React.ReactNode
  title?: string
  description?: string
  onClick?: () => void
}

const CardItem = React.forwardRef<HTMLDivElement, CardSectionProps>(
  (
    {
      className,
      padding,
      interactive,
      leftContent,
      rightContent,
      icon,
      title,
      description,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const isClickable = onClick || interactive

    return (
      <div
        ref={ref}
        className={cn(
          cardItemVariants({
            padding,
            interactive: !!isClickable,
            className
          })
        )}
        onClick={onClick}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onKeyDown={
          isClickable
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onClick?.()
                }
              }
            : undefined
        }
        {...props}>
        {children || (
          <>
            <div className="flex items-center space-x-3">
              {icon && (
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-dark-bg-tertiary transition-colors">
                  {icon}
                </div>
              )}
              <div>
                {title && (
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-dark-text-primary transition-colors">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="text-sm text-gray-600 dark:text-dark-text-secondary transition-colors">
                    {description}
                  </p>
                )}
                {leftContent}
              </div>
            </div>
            {rightContent && <div>{rightContent}</div>}
          </>
        )}
      </div>
    )
  }
)
CardItem.displayName = "CardItem"

export { CardItem, cardItemVariants }
