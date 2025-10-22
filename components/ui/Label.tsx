import { cva, type VariantProps } from "class-variance-authority"
import React from "react"

import { cn } from "~/utils/cn"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "text-gray-700 dark:text-dark-text-secondary",
        muted: "text-gray-500 dark:text-dark-text-tertiary",
        error: "text-red-600 dark:text-red-400",
        success: "text-green-600 dark:text-green-400"
      },
      size: {
        default: "text-sm",
        sm: "text-xs",
        lg: "text-base"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  required?: boolean
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, variant, size, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(labelVariants({ variant, size, className }))}
      {...props}>
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  )
)
Label.displayName = "Label"

export { Label, labelVariants }
