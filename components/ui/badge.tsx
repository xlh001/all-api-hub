import { cva, type VariantProps } from "class-variance-authority"
import React from "react"

import { cn } from "~/lib/utils.ts"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-blue-600 text-white hover:bg-blue-700",
        secondary:
          "border-transparent bg-gray-200 text-gray-900 dark:bg-dark-bg-tertiary dark:text-dark-text-primary hover:bg-gray-300 dark:hover:bg-dark-bg-primary",
        destructive:
          "border-transparent bg-red-600 text-white hover:bg-red-700",
        danger: "border-transparent bg-red-600 text-white hover:bg-red-700",
        success:
          "border-transparent bg-green-600 text-white hover:bg-green-700",
        warning:
          "border-transparent bg-yellow-600 text-white hover:bg-yellow-700",
        info: "border-transparent bg-blue-600 text-white hover:bg-blue-700",
        outline:
          "border-gray-300 dark:border-dark-bg-tertiary text-gray-700 dark:text-dark-text-secondary",
        ghost:
          "border-transparent text-gray-700 dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-bg-secondary"
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    { className, variant, size, leftIcon, rightIcon, children, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}>
        {leftIcon && <span className="mr-1">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-1">{rightIcon}</span>}
      </div>
    )
  }
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }
