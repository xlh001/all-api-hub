import { cva, type VariantProps } from "class-variance-authority"
import React from "react"

import { cn } from "~/utils/cn"

import { BodySmall, Typography } from "./Typography"

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

    const Component = (isClickable ? "button" : "div") as any

    return (
      <Component
        ref={ref}
        className={cn(
          cardItemVariants({
            padding,
            interactive: !!isClickable,
            className
          })
        )}
        onClick={onClick}
        type={isClickable ? "button" : undefined}
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
                  <Typography
                    variant="h6"
                    className="transition-colors text-gray-900 dark:text-dark-text-primary">
                    {title}
                  </Typography>
                )}
                {description && (
                  <BodySmall className="transition-colors text-gray-600 dark:text-dark-text-secondary">
                    {description}
                  </BodySmall>
                )}
                {leftContent}
              </div>
            </div>
            {rightContent && <div>{rightContent}</div>}
          </>
        )}
      </Component>
    )
  }
)
CardItem.displayName = "CardItem"

export { CardItem, cardItemVariants }
